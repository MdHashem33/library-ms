import { Metadata } from 'next';
import { Suspense } from 'react';
import { getServerSession } from '@/lib/auth/session';
import { booksApi } from '@/lib/api/books';
import { BookGrid } from '@/components/books/BookGrid';
import { BookFilters } from '@/components/books/BookFilters';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Books | Library MS' };

interface PageProps {
  searchParams: { page?: string; search?: string; genre?: string };
}

export default async function BooksPage({ searchParams }: PageProps) {
  const session = await getServerSession();
  if (!session) return null;

  const page = parseInt(searchParams.page ?? '1', 10);
  const filters = {
    page,
    limit: 12,
    search: searchParams.search,
    genre: searchParams.genre,
  };

  const data = await booksApi.list(filters, session.accessToken).catch(() => ({
    books: [],
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 0,
  }));

  const canManageBooks = session.user.role === 'ADMIN' || session.user.role === 'LIBRARIAN';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Books</h1>
          <p className="text-muted-foreground">{data.total} books in the library</p>
        </div>
        {canManageBooks && (
          <Button asChild>
            <Link href="/books/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Book
            </Link>
          </Button>
        )}
      </div>

      <BookFilters />

      <Suspense fallback={<div className="text-center py-8">Loading books...</div>}>
        <BookGrid
          books={data.books}
          totalPages={data.totalPages}
          currentPage={page}
          userRole={session.user.role}
        />
      </Suspense>
    </div>
  );
}
