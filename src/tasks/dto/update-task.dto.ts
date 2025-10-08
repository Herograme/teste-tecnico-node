import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus } from '../entities/task.entity';

export class UpdateTaskDto {
  @ApiPropertyOptional({
    description: 'Título da tarefa',
    example: 'Estudar NestJS Avançado',
    maxLength: 255,
  })
  @IsOptional()
  @IsString({ message: 'O título deve ser uma string' })
  @MaxLength(255, { message: 'O título deve ter no máximo 255 caracteres' })
  title?: string;

  @ApiPropertyOptional({
    description: 'Descrição detalhada da tarefa',
    example:
      'Aprofundar nos conceitos avançados do NestJS como Guards, Interceptors e Pipes customizados',
  })
  @IsOptional()
  @IsString({ message: 'A descrição deve ser uma string' })
  description?: string;

  @ApiPropertyOptional({
    description: 'Status da tarefa',
    enum: TaskStatus,
    example: TaskStatus.DONE,
  })
  @IsOptional()
  @IsEnum(TaskStatus, { message: 'Status deve ser pending ou done' })
  status?: TaskStatus;
}
