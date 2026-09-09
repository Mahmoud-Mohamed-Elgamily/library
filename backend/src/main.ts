import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  )

  const config = new DocumentBuilder().setTitle("Library Management System APIs").setDescription("Backend API for the Library Management System").setVersion("1.0").addBearerAuth({
    type: "http",
    scheme: "bearer",
    bearerFormat: 'JWT',
  }, "access-token").build()

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, documentFactory)
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();