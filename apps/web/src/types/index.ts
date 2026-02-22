export type Role = 'ADMIN' | 'LIBRARIAN' | 'MEMBER';
export type LoanStatus = 'ACTIVE' | 'RETURNED' | 'OVERDUE';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn?: string;
  description?: string;
  genre: string[];
  coverImage?: string;
  publisher?: string;
  publishedAt?: string;
  pages?: number;
  language: string;
  copies: number;
  available: number;
  location?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Loan {
  id: string;
  bookId: string;
  userId: string;
  borrowedAt: string;
  dueDate: string;
  returnedAt?: string;
  status: LoanStatus;
  notes?: string;
  book?: Pick<Book, 'id' | 'title' | 'author' | 'coverImage'>;
  user?: Pick<User, 'id' | 'name' | 'email'>;
}

export interface PaginatedResponse<T> {
  data: {
    items?: T[];
    books?: T[];
    loans?: T[];
    users?: T[];
    total: number;
    page: number;
    limit: number;
    totalPages?: number;
  };
  statusCode: number;
  timestamp: string;
}

export interface ApiResponse<T> {
  data: T;
  statusCode: number;
  timestamp: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface Session {
  user: User;
  accessToken: string;
}
