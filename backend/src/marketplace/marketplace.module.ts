import { Module } from '@nestjs/common';
import { RfqService } from './rfq.service';
import { RfqController } from './rfq.controller';
import { CatalogService } from './catalog.service';
import { CatalogController } from './catalog.controller';
import { ProducerService } from './producer.service';
import { ProducerController } from './producer.controller';

/** B2B matchmaking: RFQ/quotes, raw-material catalog, local-producer & UMKM network. */
@Module({
  controllers: [RfqController, CatalogController, ProducerController],
  providers: [RfqService, CatalogService, ProducerService],
})
export class MarketplaceModule {}
