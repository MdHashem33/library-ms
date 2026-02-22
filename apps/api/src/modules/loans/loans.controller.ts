import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Role, LoanStatus } from '@prisma/client';
import { LoansService } from './loans.service';
import { CheckoutDto } from './dto/checkout.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Loans')
@ApiBearerAuth()
@Controller('loans')
export class LoansController {
  constructor(private loansService: LoansService) {}

  @Post('checkout')
  @ApiOperation({ summary: 'Checkout a book' })
  checkout(@CurrentUser('id') userId: string, @Body() dto: CheckoutDto) {
    return this.loansService.checkout(userId, dto);
  }

  @Patch(':id/return')
  @ApiOperation({ summary: 'Return a book' })
  returnBook(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') userRole: Role,
  ) {
    return this.loansService.returnBook(id, userId, userRole);
  }

  @Get('my')
  @ApiOperation({ summary: 'Get my loans' })
  getMyLoans(
    @CurrentUser('id') userId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.loansService.getMyLoans(userId, page, limit);
  }

  @Get()
  @Roles(Role.ADMIN, Role.LIBRARIAN)
  @ApiOperation({ summary: 'Get all loans (ADMIN/LIBRARIAN)' })
  @ApiQuery({ name: 'status', enum: LoanStatus, required: false })
  getAllLoans(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('status') status?: LoanStatus,
  ) {
    return this.loansService.getAllLoans(page, limit, status);
  }

  @Post('check-overdue')
  @Roles(Role.ADMIN, Role.LIBRARIAN)
  @ApiOperation({ summary: 'Check and mark overdue loans (ADMIN/LIBRARIAN)' })
  checkOverdue() {
    return this.loansService.checkOverdueLoans();
  }
}
