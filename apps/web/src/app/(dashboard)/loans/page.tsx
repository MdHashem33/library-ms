import { Metadata } from 'next';
import { getServerSession } from '@/lib/auth/session';
import { loansApi } from '@/lib/api/loans';
import { LoanTable } from '@/components/loans/LoanTable';

export const metadata: Metadata = { title: 'My Loans | Library MS' };

interface PageProps {
  searchParams: { page?: string };
}

export default async function LoansPage({ searchParams }: PageProps) {
  const session = await getServerSession();
  if (!session) return null;

  const page = parseInt(searchParams.page ?? '1', 10);

  const isStaff = session.user.role === 'ADMIN' || session.user.role === 'LIBRARIAN';

  const data = isStaff
    ? await loansApi.all({ page, limit: 20 }, session.accessToken).catch(() => ({
        loans: [],
        total: 0,
        page: 1,
        limit: 20,
      }))
    : await loansApi.myLoans({ page, limit: 20 }, session.accessToken).catch(() => ({
        loans: [],
        total: 0,
        page: 1,
        limit: 20,
      }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {isStaff ? 'All Loans' : 'My Loans'}
        </h1>
        <p className="text-muted-foreground">{data.total} total loans</p>
      </div>

      <LoanTable
        loans={data.loans}
        total={data.total}
        currentPage={page}
        userRole={session.user.role}
        accessToken={session.accessToken}
      />
    </div>
  );
}
