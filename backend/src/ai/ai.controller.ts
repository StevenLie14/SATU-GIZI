import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { AiService } from './ai.service';

class AskDto {
  @IsString() question: string;
}

@ApiTags('AI Copilot')
@ApiBearerAuth()
@Controller('api/ai')
export class AiController {
  constructor(private readonly service: AiService) {}

  @Get('insights')
  insights(@Query('role') role?: string) {
    return this.service.generateInsights(role);
  }

  @Get('summary')
  summary(@Query('role') role?: string) {
    return this.service.summary(role);
  }

  @Get('supplier-match')
  supplierMatch(@Query('komoditas') komoditas: string) {
    return this.service.supplierMatch(komoditas ?? '');
  }

  @Post('ask')
  ask(@Body() dto: AskDto) {
    return this.service.ask(dto.question);
  }
}
