import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateTaskResponse } from './types/controller/response/create-task-response.type';
import { FindAllTasksResponse } from './types/controller/response/find-all-tasks-response.type';
import { FindTaskByIdResponse } from './types/controller/response/find-task-by-id-response.type';
import { UpdateTaskResponse } from './types/controller/response/update-task-response.type';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Criar nova tarefa',
    description:
      'Cria uma nova tarefa associada a um usuário existente. O status padrão é "pending".',
  })
  @ApiBody({ type: CreateTaskDto })
  @ApiResponse({
    status: 201,
    description: 'Tarefa criada com sucesso',
    schema: {
      example: {
        id: '323e4567-e89b-12d3-a456-426614174002',
        title: 'Estudar NestJS',
        description:
          'Estudar os conceitos fundamentais do NestJS incluindo módulos, controllers, services e providers',
        status: 'pending',
        userId: '123e4567-e89b-12d3-a456-426614174000',
        createdAt: '2025-10-08T12:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
    schema: {
      example: {
        statusCode: 400,
        message: ['O título é obrigatório', 'O userId deve ser um UUID válido'],
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
    schema: {
      example: {
        statusCode: 404,
        message: 'Usuário não encontrado',
        error: 'Not Found',
      },
    },
  })
  async create(
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<CreateTaskResponse> {
    const task = await this.tasksService.create(createTaskDto);
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      userId: task.userId,
      createdAt: task.createdAt,
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Listar todas as tarefas',
    description:
      'Retorna uma lista com todas as tarefas cadastradas, incluindo o nome do usuário responsável',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de tarefas retornada com sucesso',
    schema: {
      example: [
        {
          id: '323e4567-e89b-12d3-a456-426614174002',
          title: 'Estudar NestJS',
          description: 'Estudar os conceitos fundamentais do NestJS',
          status: 'pending',
          userId: '123e4567-e89b-12d3-a456-426614174000',
          userName: 'João Silva',
          createdAt: '2025-10-08T12:00:00.000Z',
        },
        {
          id: '423e4567-e89b-12d3-a456-426614174003',
          title: 'Implementar API',
          description: 'Criar endpoints RESTful com NestJS',
          status: 'done',
          userId: '223e4567-e89b-12d3-a456-426614174001',
          userName: 'Maria Santos',
          createdAt: '2025-10-08T13:00:00.000Z',
        },
      ],
    },
  })
  async findAll(): Promise<FindAllTasksResponse> {
    const tasks = await this.tasksService.findAll();
    return tasks.map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      userId: task.userId,
      userName: task.user.name,
      createdAt: task.createdAt,
    }));
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Buscar tarefa por ID',
    description:
      'Retorna os dados de uma tarefa específica pelo seu UUID, incluindo o nome do usuário',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID da tarefa',
    example: '323e4567-e89b-12d3-a456-426614174002',
  })
  @ApiResponse({
    status: 200,
    description: 'Tarefa encontrada com sucesso',
    schema: {
      example: {
        id: '323e4567-e89b-12d3-a456-426614174002',
        title: 'Estudar NestJS',
        description: 'Estudar os conceitos fundamentais do NestJS',
        status: 'pending',
        userId: '123e4567-e89b-12d3-a456-426614174000',
        userName: 'João Silva',
        createdAt: '2025-10-08T12:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Tarefa não encontrada',
    schema: {
      example: {
        statusCode: 404,
        message: 'Tarefa não encontrada',
        error: 'Not Found',
      },
    },
  })
  async findById(@Param('id') id: string): Promise<FindTaskByIdResponse> {
    const task = await this.tasksService.findById({ id });
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      userId: task.userId,
      userName: task.user.name,
      createdAt: task.createdAt,
    };
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Atualizar tarefa',
    description:
      'Atualiza os dados de uma tarefa existente. Todos os campos são opcionais.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID da tarefa',
    example: '323e4567-e89b-12d3-a456-426614174002',
  })
  @ApiBody({ type: UpdateTaskDto })
  @ApiResponse({
    status: 200,
    description: 'Tarefa atualizada com sucesso',
    schema: {
      example: {
        id: '323e4567-e89b-12d3-a456-426614174002',
        title: 'Estudar NestJS Avançado',
        description: 'Aprofundar nos conceitos avançados do NestJS',
        status: 'done',
        userId: '123e4567-e89b-12d3-a456-426614174000',
        userName: 'João Silva',
        createdAt: '2025-10-08T12:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Tarefa não encontrada',
    schema: {
      example: {
        statusCode: 404,
        message: 'Tarefa não encontrada',
        error: 'Not Found',
      },
    },
  })
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<UpdateTaskResponse> {
    const task = await this.tasksService.update(id, updateTaskDto);
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      userId: task.userId,
      userName: task.user.name,
      createdAt: task.createdAt,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Deletar tarefa',
    description: 'Remove uma tarefa do sistema',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID da tarefa',
    example: '323e4567-e89b-12d3-a456-426614174002',
  })
  @ApiResponse({
    status: 204,
    description: 'Tarefa deletada com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Tarefa não encontrada',
    schema: {
      example: {
        statusCode: 404,
        message: 'Tarefa não encontrada',
        error: 'Not Found',
      },
    },
  })
  async delete(@Param('id') id: string): Promise<void> {
    await this.tasksService.delete({ id });
  }
}
