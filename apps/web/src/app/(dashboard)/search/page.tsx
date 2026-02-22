import { Metadata } from 'next';
import { getServerSession } from '@/lib/auth/session';
import { booksApi } from '@/lib/api/books';
import { BookCard } from '@/components/books/BookCard';
import { SearchInput } from '@/components/search/SearchInput';

export const metadata: Metadata = { title: 'Search | Library MS' };

interface PageProps {
  searchParams: { q?: string };
}

export default async function SearchPage({ searchParams }: PageProps) {
  const session = await getServerSession();
  if (!session) return null;

  const query = searchParams.q ?? '';
  const books = query
    ? await booksApi.search(query, session.accessToken).catch(() => [])
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Search</h1>
        <p className="text-muted-foreground">Find books in our catalog</p>
      </div>

      <SearchInput defaultValue={query} />

      {query && (
        <div>
          <p className="text-sm text-muted-foreground mb-4">
            {books.length} results for &quot;{query}&quot;
          </p>
          {books.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No books found. Try a different search term.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </div>
      )}

      {!query && (
        <div className="text-center py-12 text-muted-foreground">
          Enter a search term to find books
        </div>
      )}
    </div>
  );
}
