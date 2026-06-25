import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EntitiesService } from './entities.service';
import { CreateEntityDto } from './dto/create-entity.dto';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Peta Sebaran (Entities)')
@Controller('api/entities')
export class EntitiesController {
  constructor(private readonly entitiesService: EntitiesService) {}

  @Public()
  @Get()
  findAll() {
    return this.entitiesService.findAll();
  }

  @Public()
  @Get(':type/:id')
  findOne(@Param('type') type: string, @Param('id') id: string) {
    return this.entitiesService.findOne(type, id);
  }

  @Public()
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.entitiesService.findById(id);
  }

  @Public()
  @Post()
  create(@Body() dto: CreateEntityDto) {
    return this.entitiesService.create(dto);
  }
}
