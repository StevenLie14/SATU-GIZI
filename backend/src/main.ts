import { NestFactory } from '@nestjs/core';
import { INestApplication, ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { validationExceptionFactory } from './common/validation/validation-messages';

async function createApp(): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule);

  // CSP must allow the CDN that serves Swagger UI assets (see SwaggerModule.setup).
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          'script-src': ["'self'", 'https://cdn.jsdelivr.net'],
          'style-src': ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
          'img-src': ["'self'", 'data:', 'https://cdn.jsdelivr.net'],
        },
      },
    }),
  );
  app.enableCors({ origin: true, credentials: true });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      exceptionFactory: validationExceptionFactory,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());

  // OpenAPI / Swagger docs
  const config = new DocumentBuilder()
    .setTitle('MBG Chain API')
    .setDescription(
      'Backend API for the MBG Chain (Makan Bergizi Gratis) platform — vendor permits & supervision, supply-demand matching, B2B procurement, AI insights & blockchain trust layer.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  // Static assets from node_modules/swagger-ui-dist are not bundled into the
  // Vercel serverless function, so load them from a CDN instead.
  SwaggerModule.setup('docs', app, document, {
    customCssUrl:
      'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css',
    customJs: [
      'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js',
      'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-standalone-preset.js',
    ],
  });

  return app;
}

async function bootstrap() {
  const app = await createApp();
  const logger = new Logger('Bootstrap');

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`🚀 MBG Chain API running on http://localhost:${port}`);
  logger.log(`📚 API docs available at http://localhost:${port}/docs`);
}

// On Vercel the entrypoint must export a request handler instead of
// listening on a port; the Nest app is created once per lambda instance
// and reused across invocations.
type RequestHandler = (req: unknown, res: unknown) => void;
let cachedHandler: RequestHandler | undefined;

export default async function handler(req: unknown, res: unknown) {
  if (!cachedHandler) {
    const app = await createApp();
    await app.init();
    cachedHandler = app.getHttpAdapter().getInstance() as RequestHandler;
  }
  return cachedHandler(req, res);
}

if (!process.env.VERCEL) {
  bootstrap();
}
