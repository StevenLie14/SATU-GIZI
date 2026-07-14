import { Injectable, NotFoundException } from '@nestjs/common';
import { ApprovalStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { paginate } from '../common/utils/paginate';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { CreateProposalDto, UpdateProposalDto } from './dto/proposal.dto';

@Injectable()
export class ProposalsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(q: PaginationQueryDto) {
    const where = q.search
      ? {
          OR: [
            { judul: { contains: q.search, mode: 'insensitive' } },
            { pengaju: { contains: q.search, mode: 'insensitive' } },
          ],
        }
      : undefined;
    return paginate(this.prisma.budgetProposal, q, { where, orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string) {
    const item = await this.prisma.budgetProposal.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Proposal tidak ditemukan');
    return item;
  }

  create(dto: CreateProposalDto) {
    return this.prisma.budgetProposal.create({ data: dto });
  }

  async update(id: string, dto: UpdateProposalDto) {
    await this.findOne(id);
    return this.prisma.budgetProposal.update({ where: { id }, data: dto });
  }

  async setStatus(id: string, status: ApprovalStatus) {
    await this.findOne(id);
    return this.prisma.budgetProposal.update({ where: { id }, data: { status } });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.budgetProposal.delete({ where: { id } });
  }
}
