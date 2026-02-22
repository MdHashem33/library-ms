import { PartialType } from '@nestjs/swagger';
import { CreateBookDto } from './create-book.dto';
import { IsOptional, IsInt, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateBookDto extends PartialType(CreateBookDto) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  available?: number;

  @ApiPropertyOptional()
  @IsOptional()
  description?: string;
}
