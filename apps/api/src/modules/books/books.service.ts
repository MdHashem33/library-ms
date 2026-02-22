import { Injectable, NotFoundException } from '@nestjs/common';
import { BooksRepository } from './books.repository';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(private booksRepository: BooksRepository) {}

  async findAll(params: { page: number; limit: number; search?: string; genre?: string }) {
    const result = await this.booksRepository.findAll(params);
    return {
      ...result,
      page: params.page,
      limit: params.limit,
      totalPages: Math.ceil(result.total / params.limit),
    };
  }

  async findOne(id: string) {
    const book = await this.booksRepository.findById(id);
    if (!book) throw new NotFoundException('Book not found');
    return book;
  }

  async create(dto: CreateBookDto) {
    const data: any = {
      ...dto,
      available: dto.copies ?? 1,
      genre: dto.genre ?? [],
      tags: dto.tags ?? [],
      publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : undefined,
    };
    return this.booksRepository.create(data);
  }

  async update(id: string, dto: UpdateBookDto) {
    await this.findOne(id);
    const data: any = {
      ...dto,
      publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : undefined,
    };
    return this.booksRepository.update(id, data);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.booksRepository.delete(id);
    return { message: 'Book deleted' };
  }

  async search(query: string) {
    return this.booksRepository.search(query);
  }

  async updateDescription(id: string, description: string) {
    await this.findOne(id);
    return this.booksRepository.update(id, { description });
  }
}
