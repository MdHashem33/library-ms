import { Metadata } from 'next';
import { getServerSession } from '@/lib/auth/session';
import { booksApi } from '@/lib/api/books';
import { loansApi } from '@/lib/api/loans';
import { usersApi } from '@/lib/api/users';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { RecentLoans } from '@/components/dashboard/RecentLoans';
import { BookCard } from '@/components/books/BookCard';

export const metadata: Metadata = { title: 'Dashboard | Library MS' };

export default async function DashboardPage() {
  const session = await getServerSession();
  if (!session) return null;

  const [booksData, loansData] = await Promise.allSettled([
    booksApi.list({ limit: 6 }, session.accessToken),
    loansApi.myLoans({ limit: 5 }, session.accessToken),
  ]);

  const books = booksData.status === 'fulfilled' ? booksData.value?.books ?? [] : [];
  const loans = loansData.status === 'fulfilled' ? loansData.value?.loans ?? [] : [];

  // Admin/Librarian can see stats
  let stats = null;
  if (session.user.role !== 'MEMBER') {
    const statsResult = await usersApi.stats(session.accessToken).catch(() => null);
    stats = statsResult;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {session.user.name.split(' ')[0]}!
        </h1>
        <p className="text-muted-foreground mt-1">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {stats && <DashboardStats stats={stats} />}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Books</h2>
          <a href="/books" className="text-sm text-primary hover:underline">
            View all
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </div>

      {loans.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">My Active Loans</h2>
            <a href="/loans" className="text-sm text-primary hover:underline">
              View all
            </a>
          </div>
          <RecentLoans loans={loans} />
        </div>
      )}
    </div>
  );
}
