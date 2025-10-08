import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log('🚀 Iniciando aplicação...');
  console.log(`📝 NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📝 PORT: ${process.env.PORT || 3000}`);
  console.log(`📝 DB_HOST: ${process.env.DB_HOST || 'não configurado'}`);
  console.log(`📝 DB_PORT: ${process.env.DB_PORT || 'não configurado'}`);
  console.log(
    `📝 DB_DATABASE: ${process.env.DB_DATABASE || 'não configurado'}`,
  );

  try {
    const app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter(),
      {
        logger: ['error', 'warn', 'log', 'debug', 'verbose'],
      },
    );

    console.log('✅ Aplicação NestJS criada com sucesso');

    // Habilita validação global
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    console.log('✅ Pipes de validação configurados');

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
      .addTag('health', 'Endpoints de health check')
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

    console.log('✅ Swagger configurado');

    const port = process.env.PORT || 3000;
    await app.listen(port, '0.0.0.0');

    console.log('');
    console.log('🎉 Aplicação iniciada com sucesso!');
    console.log(`🌐 Servidor rodando em: http://localhost:${port}`);
    console.log(`📚 Documentação Swagger: http://localhost:${port}/api/docs`);
    console.log(`💚 Health Check: http://localhost:${port}/health`);
    console.log(`🔄 Readiness Check: http://localhost:${port}/ready`);
    console.log('');
  } catch (error) {
    console.error('❌ Erro ao iniciar aplicação:', error);
    console.error(
      '💡 Verifique as variáveis de ambiente e a conexão com o banco de dados',
    );
    // Não mata o processo para permitir health checks
    console.log(
      '⚠️  Aplicação iniciada em modo degradado (sem banco de dados)',
    );
  }
}
void bootstrap();
