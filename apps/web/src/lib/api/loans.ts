import { apiRequest } from './client';
import { Loan, LoanStatus } from '@/types';

export interface LoansListResponse {
  loans: Loan[];
  total: number;
  page: number;
  limit: number;
}

export const loansApi = {
  checkout: (data: { bookId: string; dueDate?: string; notes?: string }, token: string) =>
    apiRequest<Loan>('/loans/checkout', { method: 'POST', body: data, token }),

  return: (loanId: string, token: string) =>
    apiRequest<Loan>(`/loans/${loanId}/return`, { method: 'PATCH', token }),

  myLoans: (params: { page?: number; limit?: number } = {}, token: string) => {
    const query = new URLSearchParams();
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));
    return apiRequest<LoansListResponse>(`/loans/my?${query.toString()}`, { token });
  },

  all: (params: { page?: number; limit?: number; status?: LoanStatus } = {}, token: string) => {
    const query = new URLSearchParams();
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));
    if (params.status) query.set('status', params.status);
    return apiRequest<LoansListResponse>(`/loans?${query.toString()}`, { token });
  },
};
