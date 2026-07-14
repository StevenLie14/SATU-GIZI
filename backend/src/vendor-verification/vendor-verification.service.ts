import { Injectable, NotFoundException } from '@nestjs/common';
import { VerificationStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { BlockchainService } from '../blockchain/blockchain.service';
import { paginate } from '../common/utils/paginate';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import {
  CertificateDto,
  CreateVendorVerificationDto,
  UpdateVendorVerificationDto,
} from './dto/vendor-verification.dto';

const BASE_COMPLIANCE = [
  'NPWP terverifikasi (DJP)',
  'NIB / Izin Usaha aktif (OSS)',
  'Sertifikat Laik Higiene Sanitasi (SLHS)',
  'Sertifikat Halal (BPJPH)',
  'Standar Keamanan Pangan (HACCP/ISO 22000)',
  'Persetujuan Badan Gizi Nasional (BGN)',
];

@Injectable()
export class VendorVerificationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly blockchain: BlockchainService,
  ) {}

  findAll(q: PaginationQueryDto) {
    const where = q.search
      ? {
          OR: [
            { nama: { contains: q.search, mode: 'insensitive' } },
            { npwp: { contains: q.search, mode: 'insensitive' } },
            { nib: { contains: q.search, mode: 'insensitive' } },
            { lokasi: { contains: q.search, mode: 'insensitive' } },
          ],
        }
      : undefined;
    return paginate(this.prisma.vendorVerification, q, {
      where,
      orderBy: { createdAt: 'desc' },
      include: { certificates: true, compliance: true },
    });
  }

  /** Compliance summary for dashboard cards. */
  async summary() {
    const vendors = await this.prisma.vendorVerification.findMany();
    return {
      total: vendors.length,
      verified: vendors.filter((v) => v.status === VerificationStatus.TERVERIFIKASI).length,
      proses: vendors.filter(
        (v) =>
          v.status === VerificationStatus.PROSES || v.status === VerificationStatus.DOKUMEN_KURANG,
      ).length,
      umkm: vendors.filter((v) => v.isUMKM).length,
      complianceRate: vendors.length
        ? Math.round((vendors.filter((v) => v.bgnApproved).length / vendors.length) * 100)
        : 0,
    };
  }

  async findOne(id: string) {
    const vendor = await this.prisma.vendorVerification.findUnique({
      where: { id },
      include: { certificates: true, compliance: true },
    });
    if (!vendor) throw new NotFoundException('Verifikasi vendor tidak ditemukan');
    return vendor;
  }

  create(dto: CreateVendorVerificationDto) {
    return this.prisma.vendorVerification.create({
      data: {
        ...dto,
        compliance: { create: BASE_COMPLIANCE.map((label) => ({ label, done: false })) },
      },
      include: { certificates: true, compliance: true },
    });
  }

  async update(id: string, dto: UpdateVendorVerificationDto) {
    await this.ensure(id);
    return this.prisma.vendorVerification.update({ where: { id }, data: dto });
  }

  /** Anchor a certificate document to the VendorCredentialRegistry. */
  async addCertificate(id: string, dto: CertificateDto) {
    const vendor = await this.ensure(id);
    const anchor = await this.blockchain.anchor({
      contract: 'VendorCredentialRegistry',
      method: 'addCertificate',
      summary: `${dto.type} — ${vendor.nama}`,
      actor: 'Inspektur',
    });

    const existing = await this.prisma.certificate.findFirst({
      where: { vendorId: id, type: dto.type },
    });

    if (existing) {
      return this.prisma.certificate.update({
        where: { id: existing.id },
        data: { ...dto, docHash: anchor.txHash },
      });
    }

    return this.prisma.certificate.create({
      data: { ...dto, vendorId: id, docHash: anchor.txHash },
    });
  }

  /** BGN approval — flips status and anchors on-chain. */
  async approveBGN(id: string) {
    const vendor = await this.ensure(id);
    await this.prisma.complianceItem.updateMany({
      where: { vendorId: id, label: { contains: 'BGN' } },
      data: { done: true },
    });
    const anchor = await this.blockchain.anchor({
      contract: 'VendorCredentialRegistry',
      method: 'setBGNApproval',
      summary: `Vendor terverifikasi BGN: ${vendor.nama}`,
      actor: 'Badan Gizi Nasional',
      data: { npwp: vendor.npwp, nib: vendor.nib },
    });
    const updated = await this.prisma.vendorVerification.update({
      where: { id },
      data: { bgnApproved: true, status: VerificationStatus.TERVERIFIKASI },
      include: { certificates: true, compliance: true },
    });
    return { ...updated, txHash: anchor.txHash };
  }

  async remove(id: string) {
    await this.ensure(id);
    return this.prisma.vendorVerification.delete({ where: { id } });
  }

  private async ensure(id: string) {
    const vendor = await this.prisma.vendorVerification.findUnique({ where: { id } });
    if (!vendor) throw new NotFoundException('Verifikasi vendor tidak ditemukan');
    return vendor;
  }
}
