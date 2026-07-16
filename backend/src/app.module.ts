import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EntitiesModule } from './entities/entities.module';
import { HealthModule } from './health/health.module';
import { BlockchainModule } from './blockchain/blockchain.module';

// Distribution & docs
import { DistributionModule } from './distribution/distribution.module';
import { PersonnelModule } from './personnel/personnel.module';
import { LogisticsModule } from './logistics/logistics.module';

// Budget & reports
import { BudgetModule } from './budget/budget.module';
import { ProposalsModule } from './proposals/proposals.module';
import { ReportsModule } from './reports/reports.module';
import { ReviewsModule } from './reviews/reviews.module';

// Menu & nutrition
import { MenuModule } from './menu/menu.module';
import { IngredientsModule } from './ingredients/ingredients.module';
import { NutritionModule } from './nutrition/nutrition.module';

// Team & partners
import { PartnersModule } from './partners/partners.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { BeneficiariesModule } from './beneficiaries/beneficiaries.module';
import { KitchenStaffModule } from './kitchen-staff/kitchen-staff.module';

// Master data
import { KitchensModule } from './kitchens/kitchens.module';
import { VendorVerificationModule } from './vendor-verification/vendor-verification.module';

// Supply chain
import { RequirementsModule } from './requirements/requirements.module';
import { ProcurementModule } from './procurement/procurement.module';
import { MarketplaceModule } from './marketplace/marketplace.module';
import { StockModule } from './stock/stock.module';
import { AnalyticsModule } from './analytics/analytics.module';

// Cross-cutting
import { AiModule } from './ai/ai.module';
import { NotificationsModule } from './notifications/notifications.module';
import { GeoRulesModule } from './geo-rules/geo-rules.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 120 }]),
    PrismaModule,
    BlockchainModule,
    AuthModule,
    UsersModule,
    EntitiesModule,
    HealthModule,
    DistributionModule,
    PersonnelModule,
    LogisticsModule,
    BudgetModule,
    ProposalsModule,
    ReportsModule,
    ReviewsModule,
    MenuModule,
    IngredientsModule,
    NutritionModule,
    PartnersModule,
    SuppliersModule,
    BeneficiariesModule,
    KitchenStaffModule,
    KitchensModule,
    VendorVerificationModule,
    RequirementsModule,
    ProcurementModule,
    MarketplaceModule,
    StockModule,
    AnalyticsModule,
    AiModule,
    NotificationsModule,
    GeoRulesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
