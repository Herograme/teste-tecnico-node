import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataSource } from 'typeorm';

describe('AppController', () => {
  let appController: AppController;

  const mockDataSource = {
    isInitialized: true,
    query: jest.fn().mockResolvedValue([{ '?column?': 1 }]),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });

  describe('health check', () => {
    it('should return health status', () => {
      const result = appController.healthCheck();

      expect(result).toHaveProperty('status', 'ok');
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('uptime');
      expect(result).toHaveProperty('environment');
    });

    it('should return current timestamp', () => {
      const result: any = appController.healthCheck();
      const timestamp = new Date(result.timestamp);

      expect(timestamp).toBeInstanceOf(Date);
      expect(timestamp.getTime()).toBeLessThanOrEqual(Date.now());
    });
  });

  describe('readiness check', () => {
    it('should return ready status when database is connected', async () => {
      const result = await appController.readinessCheck();

      expect(result).toHaveProperty('status', 'ready');
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('database', 'connected');
    });

    it('should return not_ready status when database is disconnected', async () => {
      mockDataSource.isInitialized = false;

      const result = await appController.readinessCheck();

      expect(result).toHaveProperty('status', 'not_ready');
      expect(result).toHaveProperty('database', 'disconnected');

      // Restore mock
      mockDataSource.isInitialized = true;
    });

    it('should return error status when database query fails', async () => {
      mockDataSource.query.mockRejectedValueOnce(
        new Error('Connection failed'),
      );

      const result = await appController.readinessCheck();

      expect(result).toHaveProperty('status', 'not_ready');
      expect(result).toHaveProperty('database', 'error');
    });
  });
});
