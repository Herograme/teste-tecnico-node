import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserPayload } from './types/service/payload/create-user-payload.type';
import { CreateUserReturn } from './types/service/return/create-user-return.type';
import { FindAllUsersReturn } from './types/service/return/find-all-users-return.type';
import { FindUserByIdPayload } from './types/service/payload/find-user-by-id-payload.type';
import { FindUserByIdReturn } from './types/service/return/find-user-by-id-return.type';
import { UpdateUserPayload } from './types/service/payload/update-user-payload.type';
import { UpdateUserReturn } from './types/service/return/update-user-return.type';
import { DeleteUserPayload } from './types/service/payload/delete-user-payload.type';
import { DeleteUserReturn } from './types/service/return/delete-user-return.type';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(payload: CreateUserPayload): Promise<CreateUserReturn> {
    // Verifica se o email já existe
    const existingUser = await this.usersRepository.findOne({
      where: { email: payload.email },
    });

    if (existingUser) {
      throw new ConflictException('Email já cadastrado');
    }

    const user = this.usersRepository.create(payload);
    return await this.usersRepository.save(user);
  }

  async findAll(): Promise<FindAllUsersReturn> {
    return await this.usersRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findById(payload: FindUserByIdPayload): Promise<FindUserByIdReturn> {
    const user = await this.usersRepository.findOne({
      where: { id: payload.id },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async update(
    id: string,
    payload: UpdateUserPayload,
  ): Promise<UpdateUserReturn> {
    const user = await this.findById({ id });

    // Se está tentando alterar o email, verifica se já existe
    if (payload.email && payload.email !== user.email) {
      const existingUser = await this.usersRepository.findOne({
        where: { email: payload.email },
      });

      if (existingUser) {
        throw new ConflictException('Email já cadastrado');
      }
    }

    Object.assign(user, payload);
    return await this.usersRepository.save(user);
  }

  async delete(payload: DeleteUserPayload): Promise<DeleteUserReturn> {
    const user = await this.findById({ id: payload.id });
    await this.usersRepository.remove(user);
  }
}
