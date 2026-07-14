import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';

/**
 * Global exception filter — normalises every error into a consistent JSON
 * envelope and translates common Prisma errors into proper HTTP statuses.
 * User-facing messages are in Indonesian.
 */

// NestJS built-ins (guards, throttler, 404 router, …) throw English default
// messages; map them to Indonesian before they reach the client.
const DEFAULT_MESSAGES_ID: Record<string, string> = {
  Unauthorized: 'Anda belum login atau sesi telah berakhir',
  'Forbidden resource': 'Anda tidak memiliki akses untuk melakukan aksi ini',
  Forbidden: 'Anda tidak memiliki akses untuk melakukan aksi ini',
  'Not Found': 'Data tidak ditemukan',
  'Bad Request': 'Permintaan tidak valid',
  'Too Many Requests': 'Terlalu banyak permintaan, coba lagi beberapa saat lagi',
  'ThrottlerException: Too Many Requests':
    'Terlalu banyak permintaan, coba lagi beberapa saat lagi',
  'Internal server error': 'Terjadi kesalahan pada server',
};

const translate = (m: string) => DEFAULT_MESSAGES_ID[m] ?? m;

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Terjadi kesalahan pada server';
    let error = 'InternalServerError';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'string') {
        message = translate(res);
      } else if (typeof res === 'object' && res !== null) {
        const raw = (res as any).message ?? exception.message;
        message = Array.isArray(raw) ? raw.map(translate) : translate(raw);
        error = (res as any).error ?? exception.name;
      }
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      ({ status, message, error } = this.handlePrisma(exception));
    } else if (exception instanceof Prisma.PrismaClientValidationError) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Parameter permintaan tidak valid';
      error = 'PrismaValidationError';
    } else if (exception instanceof Error) {
      // Raw internal errors (stack traces, driver messages) are logged below,
      // never leaked to the client.
      message = 'Terjadi kesalahan pada server';
    }

    if (status >= 500) {
      this.logger.error(`${request.method} ${request.url}`, (exception as Error)?.stack);
    }

    response.status(status).json({
      statusCode: status,
      error,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }

  private handlePrisma(e: Prisma.PrismaClientKnownRequestError) {
    switch (e.code) {
      case 'P2002':
        return {
          status: HttpStatus.CONFLICT,
          error: 'Conflict',
          message: `Nilai sudah terpakai untuk ${(e.meta?.target as string[])?.join(', ') ?? 'field ini'}`,
        };
      case 'P2025':
        return {
          status: HttpStatus.NOT_FOUND,
          error: 'NotFound',
          message: 'Data tidak ditemukan',
        };
      case 'P2003':
        return {
          status: HttpStatus.BAD_REQUEST,
          error: 'BadRequest',
          message: 'Data terkait tidak ditemukan atau masih dipakai data lain',
        };
      default:
        return {
          status: HttpStatus.BAD_REQUEST,
          error: 'DatabaseError',
          message: 'Terjadi kesalahan pada database',
        };
    }
  }
}
