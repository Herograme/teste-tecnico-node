import { Test, TestingModule } from '@nestjs/testing';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

describe('Users E2E Tests', () => {
  let app: NestFastifyApplication;
  let dataSource: DataSource;
  let createdUserId: string;
  let testEmail: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );

    // Adicionar validação global como no main.ts
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
    await app.getHttpAdapter().getInstance().ready();

    dataSource = moduleFixture.get<DataSource>(DataSource);
    // Gerar email único para cada execução de teste
    testEmail = `test${Date.now()}@example.com`;

    // Criar um usuário para usar nos testes
    const userResponse = await app.inject({
      method: 'POST',
      url: '/users',
      payload: {
        name: 'Test User',
        email: testEmail,
      },
    });

    expect(userResponse.statusCode).toBe(201);
    const user = JSON.parse(userResponse.body);
    createdUserId = user.id;
    expect(createdUserId).toBeDefined();
  });

  afterAll(async () => {
    // Limpar dados do teste
    if (dataSource) {
      await dataSource.query('DELETE FROM tasks');
      await dataSource.query('DELETE FROM users');
    }
    if (app) {
      await app.close();
    }
  });

  describe('/users (POST)', () => {
    it('should create a new user', async () => {
      const newEmail = `newuser${Date.now()}@example.com`;
      const response = await app.inject({
        method: 'POST',
        url: '/users',
        payload: {
          name: 'New User',
          email: newEmail,
        },
      });

      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('id');
      expect(body.name).toBe('New User');
      expect(body.email).toBe(newEmail);
      expect(body).toHaveProperty('createdAt');
    });

    it('should fail to create user with duplicate email', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/users',
        payload: {
          name: 'Another User',
          email: testEmail,
        },
      });

      expect(response.statusCode).toBe(409);
      const body = JSON.parse(response.body);
      expect(body.message).toBe('Email já cadastrado');
    });

    it('should fail to create user without name', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/users',
        payload: {
          email: 'noname@example.com',
        },
      });

      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.body);
      expect(body.message).toContain('O nome é obrigatório');
    });

    it('should fail to create user without email', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/users',
        payload: {
          name: 'No Email User',
        },
      });

      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.body);
      expect(body.message).toContain('O email é obrigatório');
    });

    it('should fail to create user with invalid email', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/users',
        payload: {
          name: 'Invalid Email User',
          email: 'invalid-email',
        },
      });

      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.body);
      expect(body.message).toContain('O email deve ser válido');
    });

    it('should fail to create user with name exceeding max length', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/users',
        payload: {
          name: 'a'.repeat(256),
          email: 'longname@example.com',
        },
      });

      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.body);
      expect(body.message).toContain(
        'O nome deve ter no máximo 255 caracteres',
      );
    });
  });

  describe('/users (GET)', () => {
    it('should return all users', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/users',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(Array.isArray(body)).toBe(true);
      expect(body.length).toBeGreaterThan(0);
      expect(body[0]).toHaveProperty('id');
      expect(body[0]).toHaveProperty('name');
      expect(body[0]).toHaveProperty('email');
      expect(body[0]).toHaveProperty('createdAt');
    });
  });

  describe('/users/:id (GET)', () => {
    it('should return a user by id', async () => {
      const response = await app.inject({
        method: 'GET',
        url: `/users/${createdUserId}`,
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.id).toBe(createdUserId);
      expect(body.name).toBe('Test User');
      expect(body.email).toBe(testEmail);
      expect(body).toHaveProperty('createdAt');
    });

    it('should return 404 when user not found', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/users/123e4567-e89b-12d3-a456-426614174999',
      });

      expect(response.statusCode).toBe(404);
      const body = JSON.parse(response.body);
      expect(body.message).toBe('Usuário não encontrado');
    });
  });

  describe('/users/:id (PUT)', () => {
    it('should update user name', async () => {
      const response = await app.inject({
        method: 'PUT',
        url: `/users/${createdUserId}`,
        payload: {
          name: 'Updated Name',
          email: testEmail,
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.id).toBe(createdUserId);
      expect(body.name).toBe('Updated Name');
      expect(body.email).toBe(testEmail);
    });

    it('should update user email', async () => {
      const updatedEmail = `updated${Date.now()}@example.com`;
      const response = await app.inject({
        method: 'PUT',
        url: `/users/${createdUserId}`,
        payload: {
          name: 'Updated Name',
          email: updatedEmail,
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.id).toBe(createdUserId);
      expect(body.name).toBe('Updated Name');
      expect(body.email).toBe(updatedEmail);
    });

    it('should update both name and email', async () => {
      const finalEmail = `final${Date.now()}@example.com`;
      const response = await app.inject({
        method: 'PUT',
        url: `/users/${createdUserId}`,
        payload: {
          name: 'Final Name',
          email: finalEmail,
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.name).toBe('Final Name');
      expect(body.email).toBe(finalEmail);
    });

    it('should fail to update with invalid email', async () => {
      const response = await app.inject({
        method: 'PUT',
        url: `/users/${createdUserId}`,
        payload: {
          email: 'invalid-email',
        },
      });

      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.body);
      expect(body.message).toContain('O email deve ser válido');
    });

    it('should return 404 when updating non-existent user', async () => {
      const response = await app.inject({
        method: 'PUT',
        url: '/users/123e4567-e89b-12d3-a456-426614174999',
        payload: {
          name: 'Non Existent',
        },
      });

      expect(response.statusCode).toBe(404);
      const body = JSON.parse(response.body);
      expect(body.message).toBe('Usuário não encontrado');
    });

    it('should fail to update to an existing email', async () => {
      // Criar outro usuário
      const anotherEmail = `another${Date.now()}@example.com`;
      const newUserResponse = await app.inject({
        method: 'POST',
        url: '/users',
        payload: {
          name: 'Another User',
          email: anotherEmail,
        },
      });

      expect(newUserResponse.statusCode).toBe(201);
      const newUser = JSON.parse(newUserResponse.body);

      // Tentar atualizar o primeiro usuário com o email do segundo
      const updateResponse = await app.inject({
        method: 'PUT',
        url: `/users/${createdUserId}`,
        payload: {
          email: anotherEmail,
        },
      });

      expect(updateResponse.statusCode).toBe(409);
      const body = JSON.parse(updateResponse.body);
      expect(body.message).toBe('Email já cadastrado');

      // Limpar o usuário criado
      await app.inject({
        method: 'DELETE',
        url: `/users/${newUser.id}`,
      });
    });
  });

  describe('/users/:id (DELETE)', () => {
    it('should delete a user', async () => {
      // Criar um usuário para deletar
      const deleteEmail = `delete${Date.now()}@example.com`;
      const createResponse = await app.inject({
        method: 'POST',
        url: '/users',
        payload: {
          name: 'User To Delete',
          email: deleteEmail,
        },
      });

      expect(createResponse.statusCode).toBe(201);
      const userToDelete = JSON.parse(createResponse.body);

      // Deletar o usuário
      const deleteResponse = await app.inject({
        method: 'DELETE',
        url: `/users/${userToDelete.id}`,
      });

      expect(deleteResponse.statusCode).toBe(204);

      // Verificar que o usuário foi deletado
      const getResponse = await app.inject({
        method: 'GET',
        url: `/users/${userToDelete.id}`,
      });

      expect(getResponse.statusCode).toBe(404);
    });

    it('should return 404 when deleting non-existent user', async () => {
      const response = await app.inject({
        method: 'DELETE',
        url: '/users/123e4567-e89b-12d3-a456-426614174999',
      });

      expect(response.statusCode).toBe(404);
      const body = JSON.parse(response.body);
      expect(body.message).toBe('Usuário não encontrado');
    });
  });
});
