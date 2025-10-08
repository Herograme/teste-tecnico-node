import { Test, TestingModule } from '@nestjs/testing';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { TaskStatus } from '../src/tasks/entities/task.entity';

describe('Tasks E2E Tests', () => {
  let app: NestFastifyApplication;
  let dataSource: DataSource;
  let createdUserId: string;
  let createdTaskId: string;

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

    // Criar um usuário para usar nos testes de tasks
    const userResponse = await app.inject({
      method: 'POST',
      url: '/users',
      payload: {
        name: 'Test User for Tasks',
        email: `taskuser${Date.now()}@example.com`,
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

  describe('/tasks (POST)', () => {
    it('should create a new task', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/tasks',
        payload: {
          title: 'Test Task',
          description: 'Test Description',
          userId: createdUserId,
          status: TaskStatus.PENDING,
        },
      });

      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('id');
      expect(body.title).toBe('Test Task');
      expect(body.description).toBe('Test Description');
      expect(body.status).toBe(TaskStatus.PENDING);
      expect(body.userId).toBe(createdUserId);
      expect(body).toHaveProperty('createdAt');

      // Guardar o ID para usar nos próximos testes
      createdTaskId = body.id;
    });

    it('should create a task with explicit status', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/tasks',
        payload: {
          title: 'Done Task',
          description: 'Already done',
          userId: createdUserId,
          status: TaskStatus.DONE,
        },
      });

      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.body);
      expect(body.status).toBe(TaskStatus.DONE);
    });

    it('should fail to create task without title', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/tasks',
        payload: {
          description: 'No title',
          userId: createdUserId,
          status: TaskStatus.PENDING,
        },
      });

      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.body);
      expect(body.message).toContain('O título é obrigatório');
    });

    it('should fail to create task without description', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/tasks',
        payload: {
          title: 'No description',
          userId: createdUserId,
          status: TaskStatus.PENDING,
        },
      });

      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.body);
      expect(body.message).toContain('A descrição é obrigatória');
    });

    it('should fail to create task without userId', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/tasks',
        payload: {
          title: 'No user',
          description: 'No user associated',
          status: TaskStatus.PENDING,
        },
      });

      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.body);
      expect(body.message).toContain('O userId é obrigatório');
    });

    it('should fail to create task with invalid userId', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/tasks',
        payload: {
          title: 'Invalid user',
          description: 'Invalid user id',
          userId: 'not-a-uuid',
          status: TaskStatus.PENDING,
        },
      });

      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.body);
      expect(body.message).toContain('O userId deve ser um UUID válido');
    });

    it('should fail to create task with non-existent userId', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/tasks',
        payload: {
          title: 'Non-existent user',
          description: 'User does not exist',
          userId: '00000000-0000-4000-a000-000000000000',
          status: TaskStatus.PENDING,
        },
      });

      expect(response.statusCode).toBe(404);
      const body = JSON.parse(response.body);
      expect(body.message).toBe('Usuário não encontrado');
    });

    it('should fail to create task with title exceeding max length', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/tasks',
        payload: {
          title: 'a'.repeat(256),
          description: 'Long title',
          userId: createdUserId,
          status: TaskStatus.PENDING,
        },
      });

      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.body);
      expect(body.message).toContain(
        'O título deve ter no máximo 255 caracteres',
      );
    });

    it('should fail to create task with invalid status', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/tasks',
        payload: {
          title: 'Invalid status',
          description: 'Invalid status value',
          userId: createdUserId,
          status: 'invalid-status',
        },
      });

      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.body);
      expect(body.message).toContain('Status deve ser pending ou done');
    });
  });

  describe('/tasks (GET)', () => {
    it('should return all tasks with user information', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/tasks',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(Array.isArray(body)).toBe(true);
      expect(body.length).toBeGreaterThan(0);
      expect(body[0]).toHaveProperty('id');
      expect(body[0]).toHaveProperty('title');
      expect(body[0]).toHaveProperty('description');
      expect(body[0]).toHaveProperty('status');
      expect(body[0]).toHaveProperty('userId');
      expect(body[0]).toHaveProperty('userName');
      expect(body[0]).toHaveProperty('createdAt');
    });
  });

  describe('/tasks/:id (GET)', () => {
    it('should return a task by id with user information', async () => {
      const response = await app.inject({
        method: 'GET',
        url: `/tasks/${createdTaskId}`,
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.id).toBe(createdTaskId);
      expect(body.title).toBe('Test Task');
      expect(body.description).toBe('Test Description');
      expect(body.status).toBe(TaskStatus.PENDING);
      expect(body.userId).toBe(createdUserId);
      expect(body.userName).toBe('Test User for Tasks');
      expect(body).toHaveProperty('createdAt');
    });

    it('should return 404 when task not found', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/tasks/123e4567-e89b-12d3-a456-426614174999',
      });

      expect(response.statusCode).toBe(404);
      const body = JSON.parse(response.body);
      expect(body.message).toBe('Tarefa não encontrada');
    });
  });

  describe('/tasks/:id (PUT)', () => {
    it('should update task title', async () => {
      const response = await app.inject({
        method: 'PUT',
        url: `/tasks/${createdTaskId}`,
        payload: {
          title: 'Updated Title',
          description: 'Test Description',
          status: TaskStatus.PENDING,
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.id).toBe(createdTaskId);
      expect(body.title).toBe('Updated Title');
      expect(body.description).toBe('Test Description');
      expect(body.status).toBe(TaskStatus.PENDING);
    });

    it('should update task description', async () => {
      const response = await app.inject({
        method: 'PUT',
        url: `/tasks/${createdTaskId}`,
        payload: {
          title: 'Updated Title',
          description: 'Updated Description',
          status: TaskStatus.PENDING,
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.title).toBe('Updated Title');
      expect(body.description).toBe('Updated Description');
    });

    it('should update task status to done', async () => {
      const response = await app.inject({
        method: 'PUT',
        url: `/tasks/${createdTaskId}`,
        payload: {
          status: TaskStatus.DONE,
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.status).toBe(TaskStatus.DONE);
    });

    it('should update task status back to pending', async () => {
      const response = await app.inject({
        method: 'PUT',
        url: `/tasks/${createdTaskId}`,
        payload: {
          status: TaskStatus.PENDING,
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.status).toBe(TaskStatus.PENDING);
    });

    it('should update multiple fields at once', async () => {
      const response = await app.inject({
        method: 'PUT',
        url: `/tasks/${createdTaskId}`,
        payload: {
          title: 'Final Title',
          description: 'Final Description',
          status: TaskStatus.DONE,
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.title).toBe('Final Title');
      expect(body.description).toBe('Final Description');
      expect(body.status).toBe(TaskStatus.DONE);
    });

    it('should fail to update with invalid status', async () => {
      const response = await app.inject({
        method: 'PUT',
        url: `/tasks/${createdTaskId}`,
        payload: {
          status: 'invalid-status',
        },
      });

      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.body);
      expect(body.message).toContain('Status deve ser pending ou done');
    });

    it('should fail to update with title exceeding max length', async () => {
      const response = await app.inject({
        method: 'PUT',
        url: `/tasks/${createdTaskId}`,
        payload: {
          title: 'a'.repeat(256),
        },
      });

      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.body);
      expect(body.message).toContain(
        'O título deve ter no máximo 255 caracteres',
      );
    });

    it('should return 404 when updating non-existent task', async () => {
      const response = await app.inject({
        method: 'PUT',
        url: '/tasks/123e4567-e89b-12d3-a456-426614174999',
        payload: {
          title: 'Non Existent',
        },
      });

      expect(response.statusCode).toBe(404);
      const body = JSON.parse(response.body);
      expect(body.message).toBe('Tarefa não encontrada');
    });
  });

  describe('/tasks/:id (DELETE)', () => {
    it('should delete a task', async () => {
      // Criar uma task para deletar
      const createResponse = await app.inject({
        method: 'POST',
        url: '/tasks',
        payload: {
          title: 'Task To Delete',
          description: 'Will be deleted',
          userId: createdUserId,
          status: TaskStatus.PENDING,
        },
      });

      expect(createResponse.statusCode).toBe(201);
      const taskToDelete = JSON.parse(createResponse.body);

      // Deletar a task
      const deleteResponse = await app.inject({
        method: 'DELETE',
        url: `/tasks/${taskToDelete.id}`,
      });

      expect(deleteResponse.statusCode).toBe(204);

      // Verificar que a task foi deletada
      const getResponse = await app.inject({
        method: 'GET',
        url: `/tasks/${taskToDelete.id}`,
      });

      expect(getResponse.statusCode).toBe(404);
    });

    it('should return 404 when deleting non-existent task', async () => {
      const response = await app.inject({
        method: 'DELETE',
        url: '/tasks/123e4567-e89b-12d3-a456-426614174999',
      });

      expect(response.statusCode).toBe(404);
      const body = JSON.parse(response.body);
      expect(body.message).toBe('Tarefa não encontrada');
    });
  });

  describe('Cascade delete', () => {
    it('should delete tasks when user is deleted', async () => {
      // Criar um novo usuário
      const cascadeEmail = `userwithtasks${Date.now()}@example.com`;
      const newUserResponse = await app.inject({
        method: 'POST',
        url: '/users',
        payload: {
          name: 'User With Tasks',
          email: cascadeEmail,
        },
      });

      expect(newUserResponse.statusCode).toBe(201);
      const newUser = JSON.parse(newUserResponse.body);

      // Criar tasks para esse usuário
      const task1Response = await app.inject({
        method: 'POST',
        url: '/tasks',
        payload: {
          title: 'Task 1',
          description: 'Description 1',
          userId: newUser.id,
          status: TaskStatus.PENDING,
        },
      });

      expect(task1Response.statusCode).toBe(201);
      const task1 = JSON.parse(task1Response.body);

      const task2Response = await app.inject({
        method: 'POST',
        url: '/tasks',
        payload: {
          title: 'Task 2',
          description: 'Description 2',
          userId: newUser.id,
          status: TaskStatus.PENDING,
        },
      });

      expect(task2Response.statusCode).toBe(201);
      const task2 = JSON.parse(task2Response.body);

      // Deletar o usuário
      const deleteUserResponse = await app.inject({
        method: 'DELETE',
        url: `/users/${newUser.id}`,
      });

      expect(deleteUserResponse.statusCode).toBe(204);

      // Verificar que as tasks também foram deletadas
      const task1GetResponse = await app.inject({
        method: 'GET',
        url: `/tasks/${task1.id}`,
      });

      expect(task1GetResponse.statusCode).toBe(404);

      const task2GetResponse = await app.inject({
        method: 'GET',
        url: `/tasks/${task2.id}`,
      });

      expect(task2GetResponse.statusCode).toBe(404);
    });
  });
});
