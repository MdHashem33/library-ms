import { apiRequest } from './client';
import { AuthResponse, User } from '@/types';

export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    apiRequest<AuthResponse>('/auth/register', { method: 'POST', body: data }),

  login: (data: { email: string; password: string }) =>
    apiRequest<AuthResponse>('/auth/login', { method: 'POST', body: data }),

  refresh: () =>
    apiRequest<{ accessToken: string }>('/auth/refresh', { method: 'POST' }),

  logout: (token: string) =>
    apiRequest<{ message: string }>('/auth/logout', { method: 'POST', token }),
};
