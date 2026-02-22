import { cookies } from 'next/headers';
import { Session, User } from '@/types';

const ACCESS_TOKEN_KEY = 'access_token';
const USER_KEY = 'user_session';

export async function getServerSession(): Promise<Session | null> {
  const cookieStore = cookies();
  const tokenCookie = cookieStore.get(ACCESS_TOKEN_KEY);
  const userCookie = cookieStore.get(USER_KEY);

  if (!tokenCookie?.value || !userCookie?.value) {
    return null;
  }

  try {
    const user = JSON.parse(userCookie.value) as User;
    return { user, accessToken: tokenCookie.value };
  } catch {
    return null;
  }
}
