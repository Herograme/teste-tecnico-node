import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiTags('health')
  @ApiOperation({ summary: 'Endpoint raiz da aplicação' })
  @ApiResponse({ status: 200, description: 'Retorna mensagem de boas-vindas' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @ApiTags('health')
  @ApiOperation({
    summary: 'Health check da aplicação',
    description:
      'Verifica se a aplicação está rodando. Não depende do banco de dados.',
  })
  @ApiResponse({
    status: 200,
    description: 'Aplicação está saudável',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string', example: '2025-10-08T16:10:00.000Z' },
        uptime: { type: 'number', example: 123.45 },
        environment: { type: 'string', example: 'production' },
      },
    },
  })
  healthCheck(): object {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    };
  }

  @Get('ready')
  @ApiTags('health')
  @ApiOperation({
    summary: 'Readiness check da aplicação',
    description:
      'Verifica se a aplicação está pronta para receber tráfego. Pode depender do banco de dados.',
  })
  @ApiResponse({
    status: 200,
    description: 'Aplicação está pronta',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ready' },
        timestamp: { type: 'string', example: '2025-10-08T16:10:00.000Z' },
        database: { type: 'string', example: 'connected' },
      },
    },
  })
  async readinessCheck(): Promise<object> {
    return this.appService.checkReadiness();
  }
}
