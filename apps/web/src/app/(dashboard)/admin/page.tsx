import { Metadata } from 'next';
import { getServerSession } from '@/lib/auth/session.server';
import { redirect } from 'next/navigation';
import { usersApi } from '@/lib/api/users';
import { loansApi } from '@/lib/api/loans';
import { UsersTable } from '@/components/admin/UsersTable';
import { DashboardStats } from '@/components/dashboard/DashboardStats';

export const metadata: Metadata = { title: 'Admin | Library MS' };

interface PageProps {
  searchParams: { page?: string };
}

export default async function AdminPage({ searchParams }: PageProps) {
  const session = await getServerSession();
  if (!session || session.user.role !== 'ADMIN') redirect('/dashboard');

  const page = parseInt(searchParams.page ?? '1', 10);

  const [usersData, stats] = await Promise.allSettled([
    usersApi.list({ page, limit: 20 }, session.accessToken),
    usersApi.stats(session.accessToken),
  ]);

  const users = usersData.status === 'fulfilled' ? usersData.value : { users: [], total: 0, page: 1, limit: 20 };
  const statsData = stats.status === 'fulfilled' ? stats.value : null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage users and monitor system activity</p>
      </div>

      {statsData && <DashboardStats stats={statsData} />}

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">User Management</h2>
        <UsersTable
          users={users.users}
          total={users.total}
          currentPage={page}
          accessToken={session.accessToken}
        />
      </div>
    </div>
  );
}
