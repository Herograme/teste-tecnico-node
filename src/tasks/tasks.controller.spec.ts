import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStatus } from './entities/task.entity';

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  const mockUser = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Test User',
    email: 'test@example.com',
    createdAt: new Date('2024-01-01'),
    tasks: [],
  };

  const mockTask = {
    id: '223e4567-e89b-12d3-a456-426614174001',
    title: 'Test Task',
    description: 'Test Description',
    status: TaskStatus.PENDING,
    userId: '123e4567-e89b-12d3-a456-426614174000',
    user: mockUser,
    createdAt: new Date('2024-01-01'),
  };

  const mockTasksService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: mockTasksService,
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);

    // Limpar mocks antes de cada teste
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new task and return response', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        userId: '123e4567-e89b-12d3-a456-426614174000',
        status: TaskStatus.PENDING,
      };

      mockTasksService.create.mockResolvedValue(mockTask);

      const result = await controller.create(createTaskDto);

      expect(result).toEqual({
        id: mockTask.id,
        title: mockTask.title,
        description: mockTask.description,
        status: mockTask.status,
        userId: mockTask.userId,
        createdAt: mockTask.createdAt,
      });
      expect(service.create).toHaveBeenCalledWith(createTaskDto);
    });

    it('should create a task without status (default pending)', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        userId: '123e4567-e89b-12d3-a456-426614174000',
      };

      mockTasksService.create.mockResolvedValue(mockTask);

      const result = await controller.create(createTaskDto);

      expect(result.status).toBe(TaskStatus.PENDING);
      expect(service.create).toHaveBeenCalledWith(createTaskDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of tasks with user names', async () => {
      const tasks = [
        mockTask,
        {
          ...mockTask,
          id: '323e4567-e89b-12d3-a456-426614174002',
          title: 'Test Task 2',
        },
      ];

      mockTasksService.findAll.mockResolvedValue(tasks);

      const result = await controller.findAll();

      expect(result).toEqual(
        tasks.map((task) => ({
          id: task.id,
          title: task.title,
          description: task.description,
          status: task.status,
          userId: task.userId,
          userName: task.user.name,
          createdAt: task.createdAt,
        })),
      );
      expect(service.findAll).toHaveBeenCalled();
    });

    it('should return an empty array when no tasks exist', async () => {
      mockTasksService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a task by id with user name', async () => {
      const id = '223e4567-e89b-12d3-a456-426614174001';

      mockTasksService.findById.mockResolvedValue(mockTask);

      const result = await controller.findById(id);

      expect(result).toEqual({
        id: mockTask.id,
        title: mockTask.title,
        description: mockTask.description,
        status: mockTask.status,
        userId: mockTask.userId,
        userName: mockTask.user.name,
        createdAt: mockTask.createdAt,
      });
      expect(service.findById).toHaveBeenCalledWith({ id });
    });
  });

  describe('update', () => {
    it('should update task title and return response', async () => {
      const id = '223e4567-e89b-12d3-a456-426614174001';
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Title',
      };
      const updatedTask = {
        ...mockTask,
        title: 'Updated Title',
      };

      mockTasksService.update.mockResolvedValue(updatedTask);

      const result = await controller.update(id, updateTaskDto);

      expect(result).toEqual({
        id: updatedTask.id,
        title: updatedTask.title,
        description: updatedTask.description,
        status: updatedTask.status,
        userId: updatedTask.userId,
        userName: updatedTask.user.name,
        createdAt: updatedTask.createdAt,
      });
      expect(service.update).toHaveBeenCalledWith(id, updateTaskDto);
    });

    it('should update task description', async () => {
      const id = '223e4567-e89b-12d3-a456-426614174001';
      const updateTaskDto: UpdateTaskDto = {
        description: 'Updated Description',
      };
      const updatedTask = {
        ...mockTask,
        description: 'Updated Description',
      };

      mockTasksService.update.mockResolvedValue(updatedTask);

      const result = await controller.update(id, updateTaskDto);

      expect(result.description).toBe('Updated Description');
      expect(service.update).toHaveBeenCalledWith(id, updateTaskDto);
    });

    it('should update task status to done', async () => {
      const id = '223e4567-e89b-12d3-a456-426614174001';
      const updateTaskDto: UpdateTaskDto = {
        status: TaskStatus.DONE,
      };
      const updatedTask = {
        ...mockTask,
        status: TaskStatus.DONE,
      };

      mockTasksService.update.mockResolvedValue(updatedTask);

      const result = await controller.update(id, updateTaskDto);

      expect(result.status).toBe(TaskStatus.DONE);
      expect(service.update).toHaveBeenCalledWith(id, updateTaskDto);
    });

    it('should update multiple fields at once', async () => {
      const id = '223e4567-e89b-12d3-a456-426614174001';
      const updateTaskDto: UpdateTaskDto = {
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

      mockTasksService.update.mockResolvedValue(updatedTask);

      const result = await controller.update(id, updateTaskDto);

      expect(result).toEqual({
        id: updatedTask.id,
        title: updatedTask.title,
        description: updatedTask.description,
        status: updatedTask.status,
        userId: updatedTask.userId,
        userName: updatedTask.user.name,
        createdAt: updatedTask.createdAt,
      });
      expect(service.update).toHaveBeenCalledWith(id, updateTaskDto);
    });
  });

  describe('delete', () => {
    it('should delete a task', async () => {
      const id = '223e4567-e89b-12d3-a456-426614174001';

      mockTasksService.delete.mockResolvedValue(undefined);

      await controller.delete(id);

      expect(service.delete).toHaveBeenCalledWith({ id });
    });
  });
});
