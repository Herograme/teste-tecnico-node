import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task, TaskStatus } from './entities/task.entity';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

describe('TasksService', () => {
  let service: TasksService;
  let usersService: UsersService;

  const mockUser: User = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Test User',
    email: 'test@example.com',
    createdAt: new Date('2024-01-01'),
    tasks: [],
  };

  const mockTask: Task = {
    id: '223e4567-e89b-12d3-a456-426614174001',
    title: 'Test Task',
    description: 'Test Description',
    status: TaskStatus.PENDING,
    userId: '123e4567-e89b-12d3-a456-426614174000',
    user: mockUser,
    createdAt: new Date('2024-01-01'),
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockUsersService = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockRepository,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    usersService = module.get<UsersService>(UsersService);

    // Limpar mocks antes de cada teste
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new task successfully', async () => {
      const createTaskPayload = {
        title: 'Test Task',
        description: 'Test Description',
        userId: '123e4567-e89b-12d3-a456-426614174000',
        status: TaskStatus.PENDING,
      };

      mockUsersService.findById.mockResolvedValue(mockUser);
      mockRepository.create.mockReturnValue(mockTask);
      mockRepository.save.mockResolvedValue(mockTask);

      const result = await service.create(createTaskPayload);

      expect(result).toEqual(mockTask);
      expect(usersService.findById).toHaveBeenCalledWith({
        id: createTaskPayload.userId,
      });
      expect(mockRepository.create).toHaveBeenCalledWith(createTaskPayload);
      expect(mockRepository.save).toHaveBeenCalledWith(mockTask);
    });

    it('should create a task with default pending status', async () => {
      const createTaskPayload = {
        title: 'Test Task',
        description: 'Test Description',
        userId: '123e4567-e89b-12d3-a456-426614174000',
      };

      mockUsersService.findById.mockResolvedValue(mockUser);
      mockRepository.create.mockReturnValue(mockTask);
      mockRepository.save.mockResolvedValue(mockTask);

      const result = await service.create(createTaskPayload);

      expect(result).toEqual(mockTask);
      expect(usersService.findById).toHaveBeenCalledWith({
        id: createTaskPayload.userId,
      });
    });

    it('should throw NotFoundException when user does not exist', async () => {
      const createTaskPayload = {
        title: 'Test Task',
        description: 'Test Description',
        userId: '999e4567-e89b-12d3-a456-426614174999',
        status: TaskStatus.PENDING,
      };

      mockUsersService.findById.mockRejectedValue(
        new NotFoundException('Usuário não encontrado'),
      );

      await expect(service.create(createTaskPayload)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.create(createTaskPayload)).rejects.toThrow(
        'Usuário não encontrado',
      );
      expect(mockRepository.create).not.toHaveBeenCalled();
      expect(mockRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array of tasks with user relations', async () => {
      const tasks = [
        mockTask,
        {
          ...mockTask,
          id: '323e4567-e89b-12d3-a456-426614174002',
          title: 'Test Task 2',
        },
      ];

      mockRepository.find.mockResolvedValue(tasks);

      const result = await service.findAll();

      expect(result).toEqual(tasks);
      expect(mockRepository.find).toHaveBeenCalledWith({
        relations: ['user'],
        order: { createdAt: 'DESC' },
      });
    });

    it('should return an empty array when no tasks exist', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(mockRepository.find).toHaveBeenCalledWith({
        relations: ['user'],
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('findById', () => {
    it('should return a task with user relation when found', async () => {
      const payload = { id: '223e4567-e89b-12d3-a456-426614174001' };

      mockRepository.findOne.mockResolvedValue(mockTask);

      const result = await service.findById(payload);

      expect(result).toEqual(mockTask);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: payload.id },
        relations: ['user'],
      });
    });

    it('should throw NotFoundException when task not found', async () => {
      const payload = { id: '999e4567-e89b-12d3-a456-426614174999' };

      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findById(payload)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findById(payload)).rejects.toThrow(
        'Tarefa não encontrada',
      );
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: payload.id },
        relations: ['user'],
      });
    });
  });

  describe('update', () => {
    it('should update a task title successfully', async () => {
      const id = '223e4567-e89b-12d3-a456-426614174001';
      const updatePayload = { title: 'Updated Title' };
      const updatedTask = { ...mockTask, title: 'Updated Title' };

      mockRepository.findOne.mockResolvedValue(mockTask);
      mockRepository.save.mockResolvedValue(updatedTask);

      const result = await service.update(id, updatePayload);

      expect(result).toEqual(updatedTask);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: ['user'],
      });
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should update a task description successfully', async () => {
      const id = '223e4567-e89b-12d3-a456-426614174001';
      const updatePayload = { description: 'Updated Description' };
      const updatedTask = { ...mockTask, description: 'Updated Description' };

      mockRepository.findOne.mockResolvedValue(mockTask);
      mockRepository.save.mockResolvedValue(updatedTask);

      const result = await service.update(id, updatePayload);

      expect(result).toEqual(updatedTask);
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should update task status to done', async () => {
      const id = '223e4567-e89b-12d3-a456-426614174001';
      const updatePayload = { status: TaskStatus.DONE };
      const updatedTask = { ...mockTask, status: TaskStatus.DONE };

      mockRepository.findOne.mockResolvedValue(mockTask);
      mockRepository.save.mockResolvedValue(updatedTask);

      const result = await service.update(id, updatePayload);

      expect(result).toEqual(updatedTask);
      expect(result.status).toBe(TaskStatus.DONE);
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should update multiple fields at once', async () => {
      const id = '223e4567-e89b-12d3-a456-426614174001';
      const updatePayload = {
        title: 'New Title',
        description: 'New Description',
        status: TaskStatus.DONE,
      };
      const updatedTask = {
        ...mockTask,
        title: 'New Title',
        description: 'New Description',
        status: TaskStatus.DONE,
      };

      mockRepository.findOne.mockResolvedValue(mockTask);
      mockRepository.save.mockResolvedValue(updatedTask);

      const result = await service.update(id, updatePayload);

      expect(result).toEqual(updatedTask);
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when task to update does not exist', async () => {
      const id = '999e4567-e89b-12d3-a456-426614174999';
      const updatePayload = { title: 'Updated Title' };

      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update(id, updatePayload)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.update(id, updatePayload)).rejects.toThrow(
        'Tarefa não encontrada',
      );
      expect(mockRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a task successfully', async () => {
      const payload = { id: '223e4567-e89b-12d3-a456-426614174001' };

      mockRepository.findOne.mockResolvedValue(mockTask);
      mockRepository.remove.mockResolvedValue(mockTask);

      await service.delete(payload);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: payload.id },
        relations: ['user'],
      });
      expect(mockRepository.remove).toHaveBeenCalledWith(mockTask);
    });

    it('should throw NotFoundException when task to delete does not exist', async () => {
      const payload = { id: '999e4567-e89b-12d3-a456-426614174999' };

      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.delete(payload)).rejects.toThrow(NotFoundException);
      await expect(service.delete(payload)).rejects.toThrow(
        'Tarefa não encontrada',
      );
      expect(mockRepository.remove).not.toHaveBeenCalled();
    });
  });
});
