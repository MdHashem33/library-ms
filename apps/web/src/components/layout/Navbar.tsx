'use client';

import { Menu, LogOut, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { User } from '@/types';
import { useUiStore } from '@/stores/ui.store';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/auth';
import { clearClientSession, getAccessToken } from '@/lib/auth/session';
import { toast } from 'sonner';

interface NavbarProps {
  user: User;
}

export function Navbar({ user }: NavbarProps) {
  const { toggleSidebar } = useUiStore();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const token = getAccessToken();
      if (token) await authApi.logout(token);
    } catch {}
    clearClientSession();
    router.push('/login');
    toast.success('Logged out successfully');
  };

  return (
    <header className="h-16 border-b bg-background flex items-center justify-between px-6">
      <Button variant="ghost" size="icon" onClick={toggleSidebar} className="lg:hidden">
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex-1 lg:flex-none" />

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 text-sm">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium leading-none">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
