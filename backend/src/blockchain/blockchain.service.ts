import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { paginate } from '../common/utils/paginate';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

/**
 * Trust layer. Anchors domain events to an immutable ledger. Runs in
 * deterministic simulation by default (no chain required); when an RPC + signer
 * are configured this is where ethers.js calls would be wired in. Every anchor
 * is also mirrored to the BlockchainRecord table so the audit trail is queryable.
 */
@Injectable()
export class BlockchainService {
  private static readonly BASE_BLOCK = 19_482_000;

  constructor(private readonly prisma: PrismaService) {}

  /** Deterministic FNV-1a based pseudo tx hash (0x + 64 hex). */
  static pseudoHash(seed: string): string {
    let h = 0x811c9dc5;
    for (let i = 0; i < seed.length; i++) {
      h ^= seed.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    let hex = '';
    let x = h >>> 0;
    for (let i = 0; i < 64; i++) {
      x ^= x << 13;
      x ^= x >>> 17;
      x ^= x << 5;
      x >>>= 0;
      hex += (x & 0xf).toString(16);
    }
    return '0x' + hex.slice(0, 64);
  }

  /** Anchor a domain event on-chain (simulated) and persist the record. */
  async anchor(params: {
    contract: string;
    method: string;
    summary: string;
    actor?: string;
    data?: Record<string, unknown>;
  }) {
    const txHash = BlockchainService.pseudoHash(
      params.contract + params.method + params.summary + Date.now() + Math.random(),
    );
    const blockNumber = BlockchainService.BASE_BLOCK + 900 + Math.floor(Math.random() * 200);
    return this.prisma.blockchainRecord.create({
      data: {
        txHash,
        blockNumber,
        contract: params.contract,
        method: params.method,
        summary: params.summary,
        actor: params.actor ?? 'system',
        status: 'confirmed',
        data: (params.data ?? undefined) as Prisma.InputJsonValue | undefined,
      },
    });
  }

  /** Verify a document/reference exists on-chain (always true in simulation). */
  verify(reference: string) {
    return {
      verified: true,
      reference,
      txHash: BlockchainService.pseudoHash('doc:' + reference),
      block: BlockchainService.BASE_BLOCK + (reference.length % 500),
    };
  }

  auditTrail(q: PaginationQueryDto) {
    const where = q.search
      ? {
          OR: [
            { contract: { contains: q.search, mode: 'insensitive' } },
            { summary: { contains: q.search, mode: 'insensitive' } },
            { txHash: { contains: q.search, mode: 'insensitive' } },
          ],
        }
      : undefined;
    return paginate(this.prisma.blockchainRecord, q, { where, orderBy: { blockNumber: 'desc' } });
  }
}
