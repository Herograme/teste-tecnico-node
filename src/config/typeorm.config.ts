import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getTypeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_DATABASE'),
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true, // Habilita criação automática de tabelas (necessário para Coolify)
  logging: configService.get('NODE_ENV') === 'development',

  // Configurações de timeout e resiliência
  connectTimeoutMS: 10000, // 10 segundos para conectar
  maxQueryExecutionTime: 5000, // 5 segundos máximo por query

  // Configurações de pool de conexões
  extra: {
    connectionTimeoutMillis: 10000, // Timeout de conexão PostgreSQL
    query_timeout: 10000, // Timeout de query PostgreSQL
    statement_timeout: 10000, // Timeout de statement PostgreSQL
    idle_in_transaction_session_timeout: 10000, // Timeout de transação idle
    max: 10, // Máximo de conexões no pool
    min: 2, // Mínimo de conexões no pool
    idleTimeoutMillis: 30000, // Tempo para fechar conexões idle
  },

  // Retry automático
  retryAttempts: 3,
  retryDelay: 3000, // 3 segundos entre tentativas

  // Não abortar a aplicação se falhar a conexão inicial
  autoLoadEntities: true,
});
