import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'Nome completo do usuário',
    example: 'João Silva',
    maxLength: 255,
  })
  @IsOptional()
  @IsString({ message: 'O nome deve ser uma string' })
  @MaxLength(255, { message: 'O nome deve ter no máximo 255 caracteres' })
  name?: string;

  @ApiPropertyOptional({
    description: 'Email único do usuário',
    example: 'joao.silva@example.com',
    maxLength: 255,
    format: 'email',
  })
  @IsOptional()
  @IsEmail({}, { message: 'O email deve ser válido' })
  @MaxLength(255, { message: 'O email deve ter no máximo 255 caracteres' })
  email?: string;
}
