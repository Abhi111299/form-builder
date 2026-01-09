import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Form Builder Service')
  .setDescription('API Documentation for Form Builder')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
