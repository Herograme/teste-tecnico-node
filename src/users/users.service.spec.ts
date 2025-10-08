import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  const mockUser: User = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Test User',
    email: 'test@example.com',
    createdAt: new Date('2024-01-01'),
    tasks: [],
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));

    // Limpar mocks antes de cada teste
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user successfully', async () => {
      const createUserPayload = {
        name: 'Test User',
        email: 'test@example.com',
      };

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockUser);
      mockRepository.save.mockResolvedValue(mockUser);

      const result = await service.create(createUserPayload);

      expect(result).toEqual(mockUser);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: createUserPayload.email },
      });
      expect(mockRepository.create).toHaveBeenCalledWith(createUserPayload);
      expect(mockRepository.save).toHaveBeenCalledWith(mockUser);
    });

    it('should throw ConflictException when email already exists', async () => {
      const createUserPayload = {
        name: 'Test User',
        email: 'test@example.com',
      };

      mockRepository.findOne.mockResolvedValue(mockUser);

      await expect(service.create(createUserPayload)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.create(createUserPayload)).rejects.toThrow(
        'Email já cadastrado',
      );
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: createUserPayload.email },
      });
      expect(mockRepository.create).not.toHaveBeenCalled();
      expect(mockRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array of users ordered by createdAt DESC', async () => {
      const users = [
        mockUser,
        {
          ...mockUser,
          id: '223e4567-e89b-12d3-a456-426614174001',
          email: 'test2@example.com',
        },
      ];

      mockRepository.find.mockResolvedValue(users);

      const result = await service.findAll();

      expect(result).toEqual(users);
      expect(mockRepository.find).toHaveBeenCalledWith({
        order: { createdAt: 'DESC' },
      });
    });

    it('should return an empty array when no users exist', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(mockRepository.find).toHaveBeenCalledWith({
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('findById', () => {
    it('should return a user when found', async () => {
      const payload = { id: '123e4567-e89b-12d3-a456-426614174000' };

      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findById(payload);

      expect(result).toEqual(mockUser);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: payload.id },
      });
    });

    it('should throw NotFoundException when user not found', async () => {
      const payload = { id: '123e4567-e89b-12d3-a456-426614174999' };

      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findById(payload)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findById(payload)).rejects.toThrow(
        'Usuário não encontrado',
      );
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: payload.id },
      });
    });
  });

  describe('update', () => {
    it('should update a user successfully', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const updatePayload = { name: 'Updated Name' };
      const updatedUser = { ...mockUser, name: 'Updated Name' };

      mockRepository.findOne.mockResolvedValue(mockUser);
      mockRepository.save.mockResolvedValue(updatedUser);

      const result = await service.update(id, updatePayload);

      expect(result).toEqual(updatedUser);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id },
      });
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should update email when new email is not in use', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const updatePayload = { email: 'newemail@example.com' };
      const updatedUser = { ...mockUser, email: 'newemail@example.com' };

      // Primeira chamada: findById (user existe)
      // Segunda chamada: verificar se o novo email já existe (não existe)
      mockRepository.findOne
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(null);
      mockRepository.save.mockResolvedValue(updatedUser);

      const result = await service.update(id, updatePayload);

      expect(result).toEqual(updatedUser);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(2);
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should throw ConflictException when updating to an existing email', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const updatePayload = { email: 'existing@example.com' };
      const existingUser = {
        ...mockUser,
        id: 'different-id',
        email: 'existing@example.com',
      };

      // Primeira chamada: findById (user existe)
      // Segunda chamada: verificar se o novo email já existe (existe)
      mockRepository.findOne
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(existingUser);

      await expect(service.update(id, updatePayload)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.update(id, updatePayload)).rejects.toThrow(
        'Email já cadastrado',
      );
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should not check for email conflict when email is not being changed', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const updatePayload = { name: 'New Name' };
      const updatedUser = { ...mockUser, name: 'New Name' };

      mockRepository.findOne.mockResolvedValue(mockUser);
      mockRepository.save.mockResolvedValue(updatedUser);

      const result = await service.update(id, updatePayload);

      expect(result).toEqual(updatedUser);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when user to update does not exist', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174999';
      const updatePayload = { name: 'Updated Name' };

      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update(id, updatePayload)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.update(id, updatePayload)).rejects.toThrow(
        'Usuário não encontrado',
      );
      expect(mockRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a user successfully', async () => {
      const payload = { id: '123e4567-e89b-12d3-a456-426614174000' };

      mockRepository.findOne.mockResolvedValue(mockUser);
      mockRepository.remove.mockResolvedValue(mockUser);

      await service.delete(payload);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: payload.id },
      });
      expect(mockRepository.remove).toHaveBeenCalledWith(mockUser);
    });

    it('should throw NotFoundException when user to delete does not exist', async () => {
      const payload = { id: '123e4567-e89b-12d3-a456-426614174999' };

      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.delete(payload)).rejects.toThrow(NotFoundException);
      await expect(service.delete(payload)).rejects.toThrow(
        'Usuário não encontrado',
      );
      expect(mockRepository.remove).not.toHaveBeenCalled();
    });
  });
});
