import { getServerSession } from '@/lib/auth/session.server';
import { redirect } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();
  if (!session) redirect('/login');

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar user={session.user} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar user={session.user} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
