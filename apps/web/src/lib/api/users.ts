import { apiRequest } from './client';
import { User } from '@/types';

export interface UsersListResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

export interface StatsResponse {
  totalUsers: number;
  totalBooks: number;
  activeLoans: number;
  overdueLoans: number;
}

export const usersApi = {
  list: (params: { page?: number; limit?: number } = {}, token: string) => {
    const query = new URLSearchParams();
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));
    return apiRequest<UsersListResponse>(`/users?${query.toString()}`, { token });
  },

  get: (id: string, token: string) =>
    apiRequest<User>(`/users/${id}`, { token }),

  update: (id: string, data: Partial<Pick<User, 'name' | 'role'>>, token: string) =>
    apiRequest<User>(`/users/${id}`, { method: 'PATCH', body: data, token }),

  delete: (id: string, token: string) =>
    apiRequest<{ message: string }>(`/users/${id}`, { method: 'DELETE', token }),

  stats: (token: string) =>
    apiRequest<StatsResponse>('/users/stats', { token }),
};
