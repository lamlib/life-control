import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { TransformInterceptor } from './transform/transform.interceptor';
import { HttpExceptionFilter } from './http-exception/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: false });

  // https://docs.nestjs.com/openapi/introduction
  const config = new DocumentBuilder()
  .setTitle('Clover application')
  .setDescription('Life control API description')
  .setVersion('1.0')
  .addTag('cats')
  .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.useGlobalPipes(new ValidationPipe())

  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
