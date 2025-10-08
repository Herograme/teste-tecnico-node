import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskPayload } from './types/service/payload/create-task-payload.type';
import { CreateTaskReturn } from './types/service/return/create-task-return.type';
import { FindAllTasksReturn } from './types/service/return/find-all-tasks-return.type';
import { FindTaskByIdPayload } from './types/service/payload/find-task-by-id-payload.type';
import { FindTaskByIdReturn } from './types/service/return/find-task-by-id-return.type';
import { UpdateTaskPayload } from './types/service/payload/update-task-payload.type';
import { UpdateTaskReturn } from './types/service/return/update-task-return.type';
import { DeleteTaskPayload } from './types/service/payload/delete-task-payload.type';
import { DeleteTaskReturn } from './types/service/return/delete-task-return.type';
import { UsersService } from '../users/users.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
    private readonly usersService: UsersService,
  ) {}

  async create(payload: CreateTaskPayload): Promise<CreateTaskReturn> {
    // Valida se o usuário existe
    await this.usersService.findById({ id: payload.userId });

    const task = this.tasksRepository.create(payload);
    return await this.tasksRepository.save(task);
  }

  async findAll(): Promise<FindAllTasksReturn> {
    return await this.tasksRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findById(payload: FindTaskByIdPayload): Promise<FindTaskByIdReturn> {
    const task = await this.tasksRepository.findOne({
      where: { id: payload.id },
      relations: ['user'],
    });

    if (!task) {
      throw new NotFoundException('Tarefa não encontrada');
    }

    return task;
  }

  async update(
    id: string,
    payload: UpdateTaskPayload,
  ): Promise<UpdateTaskReturn> {
    const task = await this.findById({ id });

    Object.assign(task, payload);
    return await this.tasksRepository.save(task);
  }

  async delete(payload: DeleteTaskPayload): Promise<DeleteTaskReturn> {
    const task = await this.findById({ id: payload.id });
    await this.tasksRepository.remove(task);
  }
}
