import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getServerSession } from '@/lib/auth/session.server';
import { booksApi } from '@/lib/api/books';
import { BookForm } from '@/components/books/BookForm';

export const metadata: Metadata = { title: 'Edit Book | Library MS' };

interface PageProps {
  params: { id: string };
}

export default async function EditBookPage({ params }: PageProps) {
  const session = await getServerSession();
  if (!session) return null;

  if (session.user.role === 'MEMBER') redirect('/books');

  const book = await booksApi.get(params.id, session.accessToken).catch(() => null);
  if (!book) notFound();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Book</h1>
        <p className="text-muted-foreground">Update book information</p>
      </div>
      <BookForm book={book} accessToken={session.accessToken} />
    </div>
  );
}
