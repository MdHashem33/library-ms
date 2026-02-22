'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Home, BookMarked, Search, Users, LayoutDashboard, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { User } from '@/types';
import { useUiStore } from '@/stores/ui.store';
import { Button } from '@/components/ui/button';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  roles?: string[];
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
  { href: '/books', label: 'Books', icon: <BookOpen className="h-5 w-5" /> },
  { href: '/loans', label: 'My Loans', icon: <BookMarked className="h-5 w-5" />, roles: ['MEMBER'] },
  { href: '/loans', label: 'Loans', icon: <BookMarked className="h-5 w-5" />, roles: ['ADMIN', 'LIBRARIAN'] },
  { href: '/search', label: 'Search', icon: <Search className="h-5 w-5" /> },
  { href: '/admin', label: 'Admin', icon: <Users className="h-5 w-5" />, roles: ['ADMIN'] },
];

interface SidebarProps {
  user: User;
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useUiStore();

  const visibleItems = navItems.filter((item) => {
    if (!item.roles) return true;
    // Show only first matching role item for loans
    if (item.href === '/loans' && item.roles) {
      return item.roles.includes(user.role);
    }
    return item.roles.includes(user.role);
  });

  // Deduplicate (loans appears twice in the nav config)
  const deduped = visibleItems.filter(
    (item, idx, arr) => arr.findIndex((i) => i.href === item.href && i.label === item.label) === idx,
  );

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 flex flex-col w-64 bg-card border-r transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 h-16 px-6 border-b">
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">LibraryMS</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {deduped.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href + item.label}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User info at bottom */}
        <div className="p-4 border-t">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.role}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
