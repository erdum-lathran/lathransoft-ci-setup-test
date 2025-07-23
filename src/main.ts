import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ApplicationMode } from './enum';
import { ConfigService } from '@nestjs/config';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
import * as cookieParser from 'cookie-parser'; // Import cookie-parser
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { join } from 'path';
import { logFile, overrideConsole } from './utils/logger';
import { RedisIoAdapter } from './config/redis.adapter';
import { WsAdapter } from '@nestjs/platform-ws';

overrideConsole();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis(); // important
  app.useWebSocketAdapter(redisIoAdapter);

  const { port, mode, globalPrefix } = getConfigValues(configService);

  setupAppConfigurations(app, globalPrefix);

  // if (mode === ApplicationMode.DEVELOPMENT) {
  // }
  setupSwaggerDocumentation(app, globalPrefix);

  // Enable global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Automatically transform payloads to DTOs
      whitelist: true, // Automatically strip properties that are not in the DTO
    }),
  );

  await startApplication(app, port, globalPrefix);
}

function getConfigValues(configService: ConfigService) {
  return {
    port: configService.get<number>('PORT', 8080),
    mode: configService.get<string>('MODE', ApplicationMode.DEVELOPMENT),
    globalPrefix: configService.get<string>(
      'GLOBAL_PREFIX',
      ApplicationMode.DEVELOPMENT,
    ),
  };
}

function setupAppConfigurations(app, globalPrefix: string): void {
  // app.enableCors({ origin: ['http://localhost:5173', '*'] });
  app.enableCors({
    origin: ['https://dms.easyaab.com', 'http://localhost:5173'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.use('/api/v1/uploads', express.static(join(__dirname, '..', 'uploads')));
  app.use(bodyParser.json({ limit: '250mb' }));
  app.use(bodyParser.urlencoded({ extended: true, limit: '250mb' }));
  // app.use(morgan('dev'));

  app.use((req, res, next) => {
    console.log('Incoming Request:', {
      method: req.method,
      url: req.originalUrl,
      headers: req.headers,
      body: req.body,
    });
    next();
  });

  app.use(morgan('combined', { stream: logFile }));
  app.use(cookieParser());
  app.setGlobalPrefix(globalPrefix);
}

function setupSwaggerDocumentation(app, globalPrefix: string): void {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Document Management System')
    .setDescription(
      'DMS is a document management system that allows users to upload, download, and share documents with others.',
    )
    .setVersion('3.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access_token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(`${globalPrefix}/doc`, app, document);
}

async function startApplication(
  app,
  port: number,
  globalPrefix: string,
): Promise<void> {
  await app.listen(port, () => {
    console.log(
      `🚀 App is running at http://localhost:${port}/${globalPrefix}/doc`,
    );
  });
}

bootstrap();
