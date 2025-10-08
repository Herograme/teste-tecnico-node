import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUser = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Test User',
    email: 'test@example.com',
    createdAt: new Date('2024-01-01'),
  };

  const mockUsersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);

    // Limpar mocks antes de cada teste
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user and return response', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Test User',
        email: 'test@example.com',
      };

      mockUsersService.create.mockResolvedValue(mockUser);

      const result = await controller.create(createUserDto);

      expect(result).toEqual({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        createdAt: mockUser.createdAt,
      });
      expect(service.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [
        mockUser,
        {
          id: '223e4567-e89b-12d3-a456-426614174001',
          name: 'Test User 2',
          email: 'test2@example.com',
          createdAt: new Date('2024-01-02'),
        },
      ];

      mockUsersService.findAll.mockResolvedValue(users);

      const result = await controller.findAll();

      expect(result).toEqual(
        users.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        })),
      );
      expect(service.findAll).toHaveBeenCalled();
    });

    it('should return an empty array when no users exist', async () => {
      mockUsersService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a user by id', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';

      mockUsersService.findById.mockResolvedValue(mockUser);

      const result = await controller.findById(id);

      expect(result).toEqual({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        createdAt: mockUser.createdAt,
      });
      expect(service.findById).toHaveBeenCalledWith({ id });
    });
  });

  describe('update', () => {
    it('should update a user and return response', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const updateUserDto: UpdateUserDto = {
        name: 'Updated Name',
      };
      const updatedUser = {
        ...mockUser,
        name: 'Updated Name',
      };

      mockUsersService.update.mockResolvedValue(updatedUser);

      const result = await controller.update(id, updateUserDto);

      expect(result).toEqual({
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        createdAt: updatedUser.createdAt,
      });
      expect(service.update).toHaveBeenCalledWith(id, updateUserDto);
    });

    it('should update user email', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const updateUserDto: UpdateUserDto = {
        email: 'newemail@example.com',
      };
      const updatedUser = {
        ...mockUser,
        email: 'newemail@example.com',
      };

      mockUsersService.update.mockResolvedValue(updatedUser);

      const result = await controller.update(id, updateUserDto);

      expect(result).toEqual({
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        createdAt: updatedUser.createdAt,
      });
      expect(service.update).toHaveBeenCalledWith(id, updateUserDto);
    });

    it('should update both name and email', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const updateUserDto: UpdateUserDto = {
        name: 'New Name',
        email: 'newemail@example.com',
      };
      const updatedUser = {
        ...mockUser,
        name: 'New Name',
        email: 'newemail@example.com',
      };

      mockUsersService.update.mockResolvedValue(updatedUser);

      const result = await controller.update(id, updateUserDto);

      expect(result).toEqual({
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        createdAt: updatedUser.createdAt,
      });
      expect(service.update).toHaveBeenCalledWith(id, updateUserDto);
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';

      mockUsersService.delete.mockResolvedValue(undefined);

      await controller.delete(id);

      expect(service.delete).toHaveBeenCalledWith({ id });
    });
  });
});
