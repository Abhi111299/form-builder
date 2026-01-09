import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from './config/swagger.config';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { config } from 'dotenv'; // Add this import

// Load .env file
config();  // Load environment variables from .env file
console.log('DATABASE_URL:', process.env.DATABASE_URL);
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

   app.enableCors({
    // origin: [
    //   'http://localhost:3000',
    //   'http://127.0.0.1:3000',
    //   'http://192.168.1.30:3000', // frontend dev machine IP (change if needed)
    // ],
    origin: '*',
    credentials: false,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    // allowedHeaders: 'Content-Type, Authorization',
  });

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
      enableImplicitConversion: true, // 🔥 REQUIRED FOR QUERY PARAMS
    },
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter());

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  // await app.listen(process.env.PORT || 3005);
  await app.listen(process.env.PORT || 3005, '0.0.0.0');

}
bootstrap();
