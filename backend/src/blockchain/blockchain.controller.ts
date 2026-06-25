import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString } from 'class-validator';
import { Role } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { BlockchainService } from './blockchain.service';

class AnchorDto {
  @IsString() contract: string;
  @IsString() method: string;
  @IsString() summary: string;
  @IsOptional() @IsObject() data?: Record<string, unknown>;
}

const CONTRACTS = [
  { key: 'vendorCredentialRegistry', name: 'VendorCredentialRegistry', address: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9', desc: 'NPWP, NIB & sertifikat vendor (BGN)' },
  { key: 'permitRegistry', name: 'PermitRegistry', address: '0x5FbDB2315678afecb367f032d93F642f64180aa3', desc: 'Registry izin & inspeksi dapur/vendor' },
  { key: 'redistributionLedger', name: 'RedistributionLedger', address: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512', desc: 'Ledger transfer stok antarwilayah' },
  { key: 'procurementRFQ', name: 'ProcurementRFQ', address: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0', desc: 'RFQ, quote & rating supplier' },
];

@ApiTags('Blockchain & Audit Trail')
@ApiBearerAuth()
@Controller('api/blockchain')
export class BlockchainController {
  constructor(private readonly service: BlockchainService) {}

  @Get('audit-trail')
  auditTrail(@Query() q: PaginationQueryDto) {
    return this.service.auditTrail(q);
  }

  @Get('contracts')
  contracts() {
    return CONTRACTS;
  }

  @Get('verify')
  verify(@Query('reference') reference: string) {
    return this.service.verify(reference ?? '');
  }

  @Roles(Role.PEMERINTAH, Role.SPPG, Role.MITRA)
  @Post('anchor')
  anchor(@Body() dto: AnchorDto) {
    return this.service.anchor(dto);
  }
}
