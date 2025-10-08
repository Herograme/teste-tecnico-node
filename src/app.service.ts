import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async checkReadiness(): Promise<{
    status: string;
    timestamp: string;
    database: string;
  }> {
    let databaseStatus = 'disconnected';

    try {
      // Tenta fazer uma query simples para verificar a conexão
      if (this.dataSource.isInitialized) {
        await this.dataSource.query('SELECT 1');
        databaseStatus = 'connected';
      }
    } catch (error) {
      databaseStatus = 'error';
      console.error('Database connection check failed:', error);
    }

    return {
      status: databaseStatus === 'connected' ? 'ready' : 'not_ready',
      timestamp: new Date().toISOString(),
      database: databaseStatus,
    };
  }
}
