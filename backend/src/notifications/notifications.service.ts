import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { paginate } from '../common/utils/paginate';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { CreateNotificationDto } from './dto/notification.dto';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Notifications addressed to the user plus broadcast (userId = null). */
  findAll(userId: string, q: PaginationQueryDto) {
    const where = { OR: [{ userId }, { userId: null }] };
    return paginate(this.prisma.notification, q, { where, orderBy: { createdAt: 'desc' } });
  }

  unreadCount(userId: string) {
    return this.prisma.notification.count({
      where: { dibaca: false, OR: [{ userId }, { userId: null }] },
    });
  }

  create(dto: CreateNotificationDto) {
    return this.prisma.notification.create({ data: dto });
  }

  async markRead(id: string) {
    const notif = await this.prisma.notification.findUnique({ where: { id } });
    if (!notif) throw new NotFoundException('Notifikasi tidak ditemukan');
    return this.prisma.notification.update({ where: { id }, data: { dibaca: true } });
  }

  async markAllRead(userId: string) {
    await this.prisma.notification.updateMany({
      where: { dibaca: false, OR: [{ userId }, { userId: null }] },
      data: { dibaca: true },
    });
    return { success: true };
  }

  async remove(id: string) {
    const notif = await this.prisma.notification.findUnique({ where: { id } });
    if (!notif) throw new NotFoundException('Notifikasi tidak ditemukan');
    return this.prisma.notification.delete({ where: { id } });
  }
}
