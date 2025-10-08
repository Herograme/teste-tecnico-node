import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus } from '../entities/task.entity';

export class CreateTaskDto {
  @ApiProperty({
    description: 'Título da tarefa',
    example: 'Estudar NestJS',
    maxLength: 255,
  })
  @IsNotEmpty({ message: 'O título é obrigatório' })
  @IsString({ message: 'O título deve ser uma string' })
  @MaxLength(255, { message: 'O título deve ter no máximo 255 caracteres' })
  title: string;

  @ApiProperty({
    description: 'Descrição detalhada da tarefa',
    example:
      'Estudar os conceitos fundamentais do NestJS incluindo módulos, controllers, services e providers',
  })
  @IsNotEmpty({ message: 'A descrição é obrigatória' })
  @IsString({ message: 'A descrição deve ser uma string' })
  description: string;

  @ApiProperty({
    description: 'UUID do usuário responsável pela tarefa',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsNotEmpty({ message: 'O userId é obrigatório' })
  @IsUUID('4', { message: 'O userId deve ser um UUID válido' })
  userId: string;

  @ApiPropertyOptional({
    description: 'Status da tarefa',
    enum: TaskStatus,
    example: TaskStatus.PENDING,
    default: TaskStatus.PENDING,
  })
  @IsEnum(TaskStatus, { message: 'Status deve ser pending ou done' })
  status?: TaskStatus;
}
