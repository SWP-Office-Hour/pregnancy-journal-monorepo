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
  dashboardContract,
  hospitalContract,
  mediaContract,
  membershipContract,
  metricContract,
  noteContract,
  payosContract,
  pregnancyContract,
  reminderContract,
  tagContract,
  userContract,
} from '@pregnancy-journal-monorepo/contract';
import express from 'express';
import { join } from 'path';

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
        // {
        //   url: process.env.HOST_URL,
        // },
        {
          url: process.env.HOST_URL,
        },
      ],
    }
  );

  SwaggerModule.setup('api', app, apiDocument);
  app.useWebSocketAdapter(new SocketIoAdapter(app));

  const globalPrefix = 'api';

  const port = process.env.PORT || 3000;
  // app.use('/uploads', express.static(join(__dirname, '..', 'images')));
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: ${process.env.HOST_URL}${globalPrefix}`
  );
}

bootstrap();
