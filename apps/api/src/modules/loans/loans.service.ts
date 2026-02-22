import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { LoanStatus, Role } from '@prisma/client';
import { CheckoutDto } from './dto/checkout.dto';

@Injectable()
export class LoansService {
  constructor(private prisma: PrismaService) {}

  async checkout(userId: string, dto: CheckoutDto) {
    const book = await this.prisma.book.findUnique({ where: { id: dto.bookId } });
    if (!book) throw new NotFoundException('Book not found');
    if (book.available <= 0) throw new BadRequestException('No copies available');

    // Check if user already has this book checked out
    const existingLoan = await this.prisma.loan.findFirst({
      where: { userId, bookId: dto.bookId, status: { in: ['ACTIVE', 'OVERDUE'] } },
    });
    if (existingLoan) throw new BadRequestException('You already have this book checked out');

    const dueDate = dto.dueDate
      ? new Date(dto.dueDate)
      : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14 days default

    const [loan] = await this.prisma.$transaction([
      this.prisma.loan.create({
        data: {
          bookId: dto.bookId,
          userId,
          dueDate,
          notes: dto.notes,
        },
        include: {
          book: { select: { id: true, title: true, author: true, coverImage: true } },
          user: { select: { id: true, name: true, email: true } },
        },
      }),
      this.prisma.book.update({
        where: { id: dto.bookId },
        data: { available: { decrement: 1 } },
      }),
    ]);

    return loan;
  }

  async returnBook(loanId: string, userId: string, userRole: Role) {
    const loan = await this.prisma.loan.findUnique({
      where: { id: loanId },
      include: { book: true },
    });

    if (!loan) throw new NotFoundException('Loan not found');
    if (loan.status === 'RETURNED') throw new BadRequestException('Book already returned');

    // Members can only return their own loans
    if (userRole === Role.MEMBER && loan.userId !== userId) {
      throw new ForbiddenException('Cannot return another user\'s loan');
    }

    const [updatedLoan] = await this.prisma.$transaction([
      this.prisma.loan.update({
        where: { id: loanId },
        data: { status: 'RETURNED', returnedAt: new Date() },
        include: {
          book: { select: { id: true, title: true, author: true } },
          user: { select: { id: true, name: true, email: true } },
        },
      }),
      this.prisma.book.update({
        where: { id: loan.bookId },
        data: { available: { increment: 1 } },
      }),
    ]);

    return updatedLoan;
  }

  async getMyLoans(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [loans, total] = await Promise.all([
      this.prisma.loan.findMany({
        where: { userId },
        skip,
        take: limit,
        include: {
          book: { select: { id: true, title: true, author: true, coverImage: true } },
        },
        orderBy: { borrowedAt: 'desc' },
      }),
      this.prisma.loan.count({ where: { userId } }),
    ]);
    return { loans, total, page, limit };
  }

  async getAllLoans(page = 1, limit = 20, status?: LoanStatus) {
    const skip = (page - 1) * limit;
    const where = status ? { status } : {};
    const [loans, total] = await Promise.all([
      this.prisma.loan.findMany({
        where,
        skip,
        take: limit,
        include: {
          book: { select: { id: true, title: true, author: true } },
          user: { select: { id: true, name: true, email: true } },
        },
        orderBy: { borrowedAt: 'desc' },
      }),
      this.prisma.loan.count({ where }),
    ]);
    return { loans, total, page, limit };
  }

  async checkOverdueLoans() {
    const now = new Date();
    const updated = await this.prisma.loan.updateMany({
      where: { status: 'ACTIVE', dueDate: { lt: now } },
      data: { status: 'OVERDUE' },
    });
    return { updated: updated.count };
  }
}
