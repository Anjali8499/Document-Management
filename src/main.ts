import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS (just in case)
  app.enableCors();

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Document Management API')
    .setDescription('API documentation for document management service')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document); // Swagger UI route

  await app.listen(process.env.PORT ?? 3000);

}

void bootstrap();
