import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getServerSession } from '@/lib/auth/session.server';
import { booksApi } from '@/lib/api/books';
import { BookDetail } from '@/components/books/BookDetail';

interface PageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return { title: `Book Details | Library MS` };
}

export default async function BookDetailPage({ params }: PageProps) {
  const session = await getServerSession();
  if (!session) return null;

  const book = await booksApi.get(params.id, session.accessToken).catch(() => null);
  if (!book) notFound();

  return (
    <BookDetail
      book={book}
      userRole={session.user.role}
      accessToken={session.accessToken}
    />
  );
}
