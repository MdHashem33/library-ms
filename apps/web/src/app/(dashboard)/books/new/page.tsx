import { Metadata } from 'next';
import { getServerSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { BookForm } from '@/components/books/BookForm';

export const metadata: Metadata = { title: 'Add Book | Library MS' };

export default async function NewBookPage() {
  const session = await getServerSession();
  if (!session) return null;

  if (session.user.role === 'MEMBER') {
    redirect('/books');
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Book</h1>
        <p className="text-muted-foreground">Add a new book to the library catalog</p>
      </div>
      <BookForm accessToken={session.accessToken} />
    </div>
  );
}
