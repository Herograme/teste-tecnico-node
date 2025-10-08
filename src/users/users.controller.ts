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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserResponse } from './types/controller/response/create-user-response.type';
import { FindAllUsersResponse } from './types/controller/response/find-all-users-response.type';
import { FindUserByIdResponse } from './types/controller/response/find-user-by-id-response.type';
import { UpdateUserResponse } from './types/controller/response/update-user-response.type';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Criar novo usuário',
    description:
      'Cria um novo usuário no sistema com nome e email únicos. O email será validado e não pode ser duplicado.',
  })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'João Silva',
        email: 'joao.silva@example.com',
        createdAt: '2025-10-08T10:30:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
    schema: {
      example: {
        statusCode: 400,
        message: ['O email deve ser válido', 'O nome é obrigatório'],
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Email já cadastrado',
    schema: {
      example: {
        statusCode: 409,
        message: 'Email já está em uso',
        error: 'Conflict',
      },
    },
  })
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<CreateUserResponse> {
    const user = await this.usersService.create(createUserDto);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Listar todos os usuários',
    description:
      'Retorna uma lista com todos os usuários cadastrados no sistema',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuários retornada com sucesso',
    schema: {
      example: [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'João Silva',
          email: 'joao.silva@example.com',
          createdAt: '2025-10-08T10:30:00.000Z',
        },
        {
          id: '223e4567-e89b-12d3-a456-426614174001',
          name: 'Maria Santos',
          email: 'maria.santos@example.com',
          createdAt: '2025-10-08T11:00:00.000Z',
        },
      ],
    },
  })
  async findAll(): Promise<FindAllUsersResponse> {
    const users = await this.usersService.findAll();
    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    }));
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Buscar usuário por ID',
    description: 'Retorna os dados de um usuário específico pelo seu UUID',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID do usuário',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário encontrado com sucesso',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'João Silva',
        email: 'joao.silva@example.com',
        createdAt: '2025-10-08T10:30:00.000Z',
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
  async findById(@Param('id') id: string): Promise<FindUserByIdResponse> {
    const user = await this.usersService.findById({ id });
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Atualizar usuário',
    description:
      'Atualiza os dados de um usuário existente. Todos os campos são opcionais.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID do usuário',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'Usuário atualizado com sucesso',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'João Silva Santos',
        email: 'joao.santos@example.com',
        createdAt: '2025-10-08T10:30:00.000Z',
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
  @ApiResponse({
    status: 409,
    description: 'Email já cadastrado para outro usuário',
    schema: {
      example: {
        statusCode: 409,
        message: 'Email já está em uso',
        error: 'Conflict',
      },
    },
  })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UpdateUserResponse> {
    const user = await this.usersService.update(id, updateUserDto);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Deletar usuário',
    description:
      'Remove um usuário do sistema. Todas as tarefas associadas serão deletadas em cascata.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID do usuário',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 204,
    description: 'Usuário deletado com sucesso',
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
  async delete(@Param('id') id: string): Promise<void> {
    await this.usersService.delete({ id });
  }
}
