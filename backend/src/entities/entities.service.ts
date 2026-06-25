import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
import { CreateEntityDto } from './dto/create-entity.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EntitiesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const schools = await this.prisma.school.findMany();
    const kitchens = await this.prisma.kitchen.findMany();
    const vendors = await this.prisma.user.findMany({
      where: { role: Role.MITRA },
    });

    const formattedSchools = schools.map((s) => ({
      id: s.id,
      name: s.name,
      type: 'school',
      lat: s.latitude,
      lng: s.longitude,
      address: s.address,
      capacity: s.capacity,
      status: s.status,
      description: s.description,
      phone: s.phone,
    }));

    const formattedKitchens = kitchens.map((k) => ({
      id: k.id,
      name: k.name,
      type: 'kitchen',
      lat: k.latitude,
      lng: k.longitude,
      address: k.address,
      capacity: k.capacity,
      status: k.status,
      rating: k.rating,
      description: k.description,
      phone: k.phone,
    }));

    const formattedVendors = vendors.map((v) => ({
      id: v.id,
      name: v.businessName || v.name || 'Vendor Pemasok',
      type: 'vendor',
      lat: v.latitude,
      lng: v.longitude,
      address: v.address || '',
      status: v.status || 'active',
      rating: v.rating || 0,
      commodities: v.commodities ? v.commodities.split(',').map((c) => c.trim()).filter(Boolean) : [],
      description: v.description,
      phone: v.phone,
      auditScore: v.auditScore,
    }));

    return [...formattedSchools, ...formattedKitchens, ...formattedVendors];
  }

  async findOne(type: string, id: string) {
    if (type === 'school') {
      const s = await this.prisma.school.findUnique({ where: { id } });
      if (!s) throw new NotFoundException('School not found');
      return {
        id: s.id,
        name: s.name,
        type: 'school',
        lat: s.latitude,
        lng: s.longitude,
        address: s.address,
        capacity: s.capacity,
        status: s.status,
        description: s.description,
        phone: s.phone,
      };
    }

    if (type === 'kitchen') {
      const k = await this.prisma.kitchen.findUnique({ where: { id } });
      if (!k) throw new NotFoundException('Kitchen not found');
      return {
        id: k.id,
        name: k.name,
        type: 'kitchen',
        lat: k.latitude,
        lng: k.longitude,
        address: k.address,
        capacity: k.capacity,
        status: k.status,
        rating: k.rating,
        description: k.description,
        phone: k.phone,
      };
    }

    if (type === 'vendor') {
      const v = await this.prisma.user.findFirst({
        where: { id, role: Role.MITRA },
      });
      if (!v) throw new NotFoundException('Vendor not found');
      return {
        id: v.id,
        name: v.businessName || v.name || 'Vendor Pemasok',
        type: 'vendor',
        lat: v.latitude,
        lng: v.longitude,
        address: v.address || '',
        status: v.status || 'active',
        rating: v.rating || 0,
        commodities: v.commodities ? v.commodities.split(',').map((c) => c.trim()).filter(Boolean) : [],
        description: v.description,
        phone: v.phone,
        auditScore: v.auditScore,
      };
    }

    throw new BadRequestException('Invalid entity type');
  }

  async findById(id: string) {
    // 1. Try finding in School
    const s = await this.prisma.school.findUnique({ where: { id } });
    if (s) {
      return {
        id: s.id,
        name: s.name,
        type: 'school',
        lat: s.latitude,
        lng: s.longitude,
        address: s.address,
        capacity: s.capacity,
        status: s.status,
        description: s.description,
        phone: s.phone,
      };
    }

    // 2. Try finding in Kitchen
    const k = await this.prisma.kitchen.findUnique({ where: { id } });
    if (k) {
      return {
        id: k.id,
        name: k.name,
        type: 'kitchen',
        lat: k.latitude,
        lng: k.longitude,
        address: k.address,
        capacity: k.capacity,
        status: k.status,
        rating: k.rating,
        description: k.description,
        phone: k.phone,
      };
    }

    // 3. Try finding in User (with VENDOR role)
    const v = await this.prisma.user.findFirst({
      where: { id, role: Role.MITRA },
    });
    if (v) {
      return {
        id: v.id,
        name: v.businessName || v.name || 'Vendor Pemasok',
        type: 'vendor',
        lat: v.latitude,
        lng: v.longitude,
        address: v.address || '',
        status: v.status || 'active',
        rating: v.rating || 0,
        commodities: v.commodities ? v.commodities.split(',').map((c) => c.trim()).filter(Boolean) : [],
        description: v.description,
        phone: v.phone,
        auditScore: v.auditScore,
      };
    }

    throw new NotFoundException('Entity not found');
  }

  async create(dto: CreateEntityDto) {
    const status = dto.status || 'active';

    if (dto.type === 'school') {
      const s = await this.prisma.school.create({
        data: {
          name: dto.name,
          latitude: dto.lat,
          longitude: dto.lng,
          address: dto.address,
          capacity: dto.capacity || 0,
          status: status,
          description: dto.description,
          phone: dto.phone,
        },
      });
      return { ...s, type: 'school', lat: s.latitude, lng: s.longitude };
    }

    if (dto.type === 'kitchen') {
      const k = await this.prisma.kitchen.create({
        data: {
          name: dto.name,
          latitude: dto.lat,
          longitude: dto.lng,
          address: dto.address,
          capacity: dto.capacity || 0,
          status: status,
          rating: 0,
          description: dto.description,
          phone: dto.phone,
        },
      });
      return { ...k, type: 'kitchen', lat: k.latitude, lng: k.longitude };
    }

    if (dto.type === 'vendor') {
      const dummyEmail = `vendor-${Date.now()}@satugizi.com`;
      const dummyPassword = await bcrypt.hash('password123', 10);
      const commoditiesStr = dto.commodities ? dto.commodities.join(', ') : '';

      const v = await this.prisma.user.create({
        data: {
          email: dummyEmail,
          password: dummyPassword,
          name: dto.name,
          role: Role.MITRA,
          businessName: dto.name,
          phone: dto.phone,
          commodities: commoditiesStr,
          latitude: dto.lat,
          longitude: dto.lng,
          address: dto.address,
          status: status,
          rating: 0,
          description: dto.description,
          auditScore: 80, // default audit score
        },
      });
      return {
        id: v.id,
        name: v.businessName,
        type: 'vendor',
        lat: v.latitude,
        lng: v.longitude,
        address: v.address,
        status: v.status,
        rating: v.rating,
        commodities: dto.commodities || [],
        phone: v.phone,
        description: v.description,
        auditScore: v.auditScore,
      };
    }

    throw new BadRequestException('Invalid entity type');
  }
}
