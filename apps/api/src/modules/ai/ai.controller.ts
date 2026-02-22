import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { AiService } from './ai.service';
import { GenerateSummaryDto } from './dto/summary.dto';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('AI')
@ApiBearerAuth()
@Roles(Role.ADMIN, Role.LIBRARIAN)
@Controller('ai')
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('summary')
  @ApiOperation({ summary: 'Generate AI book summary (ADMIN/LIBRARIAN)' })
  generateSummary(@Body() dto: GenerateSummaryDto) {
    return this.aiService.generateBookSummary(dto);
  }
}
