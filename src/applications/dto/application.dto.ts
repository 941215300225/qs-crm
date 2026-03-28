import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsMobilePhone, IsOptional, IsEnum } from 'class-validator';
import { ApplicationStatus } from '../entities/application.entity';

export class CreateApplicationDto {
  @ApiProperty({ example: 'Иван Иванов' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Нужна консультация' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '+77001234567' })
  @IsString()
  @IsNotEmpty()
  phone: string;
}

export class UpdateApplicationDto {
  @ApiPropertyOptional({ example: 'Иван Петров' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiPropertyOptional({ example: 'Обновлённое описание' })
  @IsOptional()
  @IsString()
  description?: string;
}

export class ChangeStatusDto {
  @ApiProperty({ enum: ApplicationStatus, example: ApplicationStatus.IN_PROGRESS })
  @IsEnum(ApplicationStatus)
  status: ApplicationStatus;
}

export class FindApplicationsDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({ enum: ApplicationStatus })
  @IsOptional()
  @IsEnum(ApplicationStatus)
  status?: ApplicationStatus;

  @ApiPropertyOptional({ example: 'Иван' })
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ example: 'createdAt' })
  @IsOptional()
  sortBy?: string;

  @ApiPropertyOptional({ example: 'DESC', enum: ['ASC', 'DESC'] })
  @IsOptional()
  order?: 'ASC' | 'DESC';
}
