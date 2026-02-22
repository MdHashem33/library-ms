import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateSummaryDto {
  @ApiProperty({ example: 'clxxxxxx' })
  @IsString()
  bookId: string;
}
