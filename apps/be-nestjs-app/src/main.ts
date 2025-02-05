/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { generateOpenApi } from '@ts-rest/open-api';
import { SwaggerModule } from '@nestjs/swagger';
import { SocketIoAdapter } from './socket-io.adapter';
import {
  authContract,
  blogContract,
  categoryContract,
  dashboardContract,
  mediaContract,
  hospitalContract,
  membershipContract,
  metricContract,
  noteContract,
  payosContract,
  pregnancyContract,
  reminderContract,
  tagContract,
  userContract,
} from '@pregnancy-journal-monorepo/contract';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //tạo swagger và contract
  const apiDocument = generateOpenApi(
    {
      auth: authContract,
      user: userContract,
      pay: payosContract,
      tag: tagContract,
      metric: metricContract,
      dashboard: dashboardContract,
      pregnancy: pregnancyContract,
      blog: blogContract,
      note: noteContract,
      reminder: reminderContract,
      hospital: hospitalContract,
      membership: membershipContract,
      media: mediaContract,
      category: categoryContract,
    },
    {
      info: {
        title: 'Office Hour API',
        version: '1.0.0',
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      // Apply security globally
      security: [
        {
          bearerAuth: [],
        },
      ],
      servers: [
        {
          url: process.env.HOST_URL,
        },
      ],
    },
  );

  SwaggerModule.setup('api', app, apiDocument);
  app.useWebSocketAdapter(new SocketIoAdapter(app));
  app.enableCors({
    origin: process.env.FE_PAGE_URL || 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: [
      'DNT',
      'User-Agent',
      'X-Requested-With',
      'If-Modified-Since',
      'Cache-Control',
      'Content-Type',
      'Range',
      'Authorization',
    ],
    exposedHeaders: ['Content-Length', 'Content-Range', 'Content-Type'],
    maxAge: 86400,
  });

  const globalPrefix = 'api';

  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(`🚀 Application is running on: ${process.env.HOST_URL}${globalPrefix}`);
}

bootstrap();
