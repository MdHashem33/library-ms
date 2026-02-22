import { Injectable } from '@nestjs/common';
import { Book } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { IBookRepository } from './interfaces/book-repository.interface';

@Injectable()
export class BooksRepository implements IBookRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(params: { page: number; limit: number; search?: string; genre?: string }) {
    const { page, limit, search, genre } = params;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
        { isbn: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (genre) {
      where.genre = { has: genre };
    }

    const [books, total] = await Promise.all([
      this.prisma.book.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.book.count({ where }),
    ]);

    return { books, total };
  }

  async findById(id: string): Promise<Book | null> {
    return this.prisma.book.findUnique({ where: { id } });
  }

  async create(data: Partial<Book>): Promise<Book> {
    return this.prisma.book.create({ data: data as any });
  }

  async update(id: string, data: Partial<Book>): Promise<Book> {
    return this.prisma.book.update({ where: { id }, data: data as any });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.book.delete({ where: { id } });
  }

  async search(query: string): Promise<Book[]> {
    return this.prisma.book.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { author: { contains: query, mode: 'insensitive' } },
          { isbn: { contains: query, mode: 'insensitive' } },
          { tags: { has: query.toLowerCase() } },
        ],
      },
      take: 20,
    });
  }
}
