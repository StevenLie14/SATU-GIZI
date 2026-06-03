import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { EntitiesService } from './entities.service';
import { CreateEntityDto } from './dto/create-entity.dto';

@Controller('api/entities')
export class EntitiesController {
  constructor(private readonly entitiesService: EntitiesService) {}

  @Get()
  findAll() {
    return this.entitiesService.findAll();
  }

  @Get(':type/:id')
  findOne(@Param('type') type: string, @Param('id') id: string) {
    return this.entitiesService.findOne(type, id);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.entitiesService.findById(id);
  }

  @Post()
  create(@Body() dto: CreateEntityDto) {
    return this.entitiesService.create(dto);
  }
}
