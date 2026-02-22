import { apiRequest } from './client';
import { Book } from '@/types';

export interface SummaryResponse {
  book: Book;
  summary: string;
  tokensUsed?: number;
}

export const aiApi = {
  generateSummary: (bookId: string, token: string) =>
    apiRequest<SummaryResponse>('/ai/summary', {
      method: 'POST',
      body: { bookId },
      token,
    }),
};
