import { Book } from '@prisma/client';

export interface IBookRepository {
  findAll(params: {
    page: number;
    limit: number;
    search?: string;
    genre?: string;
  }): Promise<{ books: Book[]; total: number }>;
  findById(id: string): Promise<Book | null>;
  create(data: Partial<Book>): Promise<Book>;
  update(id: string, data: Partial<Book>): Promise<Book>;
  delete(id: string): Promise<void>;
  search(query: string): Promise<Book[]>;
}

export const BOOK_REPOSITORY = Symbol('IBookRepository');
