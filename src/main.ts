import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // Habilita validação global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('API de Gerenciamento de Usuários e Tarefas')
    .setDescription(
      'API REST Enterprise desenvolvida com NestJS, TypeScript e TypeORM. ' +
        'Demonstrando arquitetura DDD, SOLID e Clean Code para gerenciamento completo de usuários e tarefas.',
    )
    .setVersion('1.0.0')
    .addTag('users', 'Endpoints para gerenciamento de usuários')
    .addTag('tasks', 'Endpoints para gerenciamento de tarefas')
    .setContact(
      'Desenvolvedor',
      'https://github.com/seu-usuario',
      'seu-email@example.com',
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'API Docs - Usuários e Tarefas',
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation: http://localhost:${port}/api/docs`);
}
void bootstrap();
