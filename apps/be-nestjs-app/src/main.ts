/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import {
  authContract,
  blogContract,
  categoryContract,
  childContract,
  commentContract,
  dashboardContract,
  hospitalContract,
  mediaContract,
  membershipContract,
  metricContract,
  noteContract,
  paymentContract,
  payosContract,
  postContract,
  reactionContract,
  recordContract,
  reminderContract,
  standardContract,
  tagContract,
  userContract,
} from '@pregnancy-journal-monorepo/contract';
import { generateOpenApi } from '@ts-rest/open-api';
import { json, urlencoded } from 'express';
import { AppModule } from './app/app.module';
import { SocketIoAdapter } from './socket-io.adapter';
import { UnsubscribeOnCloseInterceptor } from './unsubscribe-on-close.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //tạo swagger và contract
  const apiDocument = generateOpenApi(
    {
      auth: authContract,
      user_for_admin: userContract,
      pay: payosContract,
      tag: tagContract,
      metric: metricContract,
      child: childContract,
      dashboard: dashboardContract,
      blog: blogContract,
      reaction: reactionContract,
      post: postContract,
      comment: commentContract,
      note: noteContract,
      reminder: reminderContract,
      hospital: hospitalContract,
      membership: membershipContract,
      media: mediaContract,
      category: categoryContract,
      record: recordContract,
      standard: standardContract,
      payment: paymentContract,
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
    origin: '*',
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
      'child_id',
      'Access-Control-Allow-Origin',
    ],
    exposedHeaders: ['Content-Length', 'Content-Range', 'Content-Type'],
    maxAge: 86400,
  });

  const globalPrefix = 'api';
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  // Handle abort request by intercepting close event
  app.useGlobalInterceptors(new UnsubscribeOnCloseInterceptor());
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(`🚀 Server running on DB: ${process.env.DB_URL}`);
  Logger.log(`🚀 Application is running on: ${process.env.HOST_URL}${globalPrefix}`);
}

bootstrap();
