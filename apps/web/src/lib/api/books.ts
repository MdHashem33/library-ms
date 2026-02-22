import { apiRequest } from './client';
import { Book } from '@/types';

export interface BooksListResponse {
  books: Book[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BookFilters {
  page?: number;
  limit?: number;
  search?: string;
  genre?: string;
}

export const booksApi = {
  list: (filters: BookFilters = {}, token?: string) => {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));
    if (filters.search) params.set('search', filters.search);
    if (filters.genre) params.set('genre', filters.genre);
    return apiRequest<BooksListResponse>(`/books?${params.toString()}`, { token });
  },

  get: (id: string, token?: string) =>
    apiRequest<Book>(`/books/${id}`, { token }),

  search: (q: string, token?: string) =>
    apiRequest<Book[]>(`/books/search?q=${encodeURIComponent(q)}`, { token }),

  create: (data: Partial<Book>, token: string) =>
    apiRequest<Book>('/books', { method: 'POST', body: data, token }),

  update: (id: string, data: Partial<Book>, token: string) =>
    apiRequest<Book>(`/books/${id}`, { method: 'PATCH', body: data, token }),

  delete: (id: string, token: string) =>
    apiRequest<{ message: string }>(`/books/${id}`, { method: 'DELETE', token }),
};
