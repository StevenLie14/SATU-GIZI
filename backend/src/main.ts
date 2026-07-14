import { NestFactory } from '@nestjs/core';
import { INestApplication, ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function createApp(): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.enableCors({ origin: true, credentials: true });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
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
  SwaggerModule.setup('docs', app, document);

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
