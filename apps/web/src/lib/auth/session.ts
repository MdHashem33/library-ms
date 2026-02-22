import { User } from '@/types';

const ACCESS_TOKEN_KEY = 'access_token';
const USER_KEY = 'user_session';

// Client-side token management
export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${ACCESS_TOKEN_KEY}=`))
    ?.split('=')[1] ?? null;
}

export function setClientSession(user: User, accessToken: string) {
  const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 min
  document.cookie = `${ACCESS_TOKEN_KEY}=${accessToken}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
  document.cookie = `${USER_KEY}=${encodeURIComponent(JSON.stringify(user))}; expires=${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString()}; path=/; SameSite=Lax`;
}

export function clearClientSession() {
  document.cookie = `${ACCESS_TOKEN_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  document.cookie = `${USER_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export function getClientUser(): User | null {
  if (typeof window === 'undefined') return null;
  const userCookie = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${USER_KEY}=`))
    ?.split('=')
    .slice(1)
    .join('=');
  if (!userCookie) return null;
  try {
    return JSON.parse(decodeURIComponent(userCookie)) as User;
  } catch {
    return null;
  }
}
