'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Book, Role } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckoutButton } from '@/components/loans/CheckoutButton';
import { AiSummaryButton } from '@/components/ai/AiSummaryButton';
import { BookOpen, MapPin, Pencil, Trash2, ArrowLeft, Calendar, Globe, Hash } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { booksApi } from '@/lib/api/books';
import { toast } from 'sonner';

interface BookDetailProps {
  book: Book;
  userRole: Role;
  accessToken: string;
}

export function BookDetail({ book, userRole, accessToken }: BookDetailProps) {
  const router = useRouter();
  const canManage = userRole === 'ADMIN' || userRole === 'LIBRARIAN';

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this book?')) return;
    try {
      await booksApi.delete(book.id, accessToken);
      toast.success('Book deleted');
      router.push('/books');
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete book');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/books">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Books
          </Link>
        </Button>
        {canManage && (
          <div className="ml-auto flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/books/${book.id}/edit`}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cover */}
        <div className="md:col-span-1">
          <div className="relative w-full aspect-[2/3] bg-muted rounded-lg overflow-hidden">
            {book.coverImage ? (
              <Image src={book.coverImage} alt={book.title} fill className="object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full">
                <BookOpen className="h-16 w-16 text-muted-foreground/30" />
              </div>
            )}
          </div>

          <div className="mt-4 space-y-2">
            <CheckoutButton
              bookId={book.id}
              available={book.available}
              accessToken={accessToken}
            />
            {canManage && (
              <AiSummaryButton bookId={book.id} accessToken={accessToken} />
            )}
          </div>
        </div>

        {/* Details */}
        <div className="md:col-span-2 space-y-4">
          <div>
            <Badge variant={book.available > 0 ? 'success' : 'destructive'} className="mb-2">
              {book.available > 0 ? `${book.available} of ${book.copies} available` : 'All copies checked out'}
            </Badge>
            <h1 className="text-3xl font-bold">{book.title}</h1>
            <p className="text-xl text-muted-foreground mt-1">{book.author}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {book.genre.map((g) => (
              <Badge key={g} variant="secondary">{g}</Badge>
            ))}
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4 text-sm">
            {book.isbn && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Hash className="h-4 w-4" />
                <span>ISBN: {book.isbn}</span>
              </div>
            )}
            {book.publisher && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>Publisher: {book.publisher}</span>
              </div>
            )}
            {book.publishedAt && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(book.publishedAt)}</span>
              </div>
            )}
            {book.pages && (
              <div className="text-muted-foreground">
                <span>{book.pages} pages</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-muted-foreground">
              <Globe className="h-4 w-4" />
              <span>{book.language}</span>
            </div>
            {book.location && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Shelf: {book.location}</span>
              </div>
            )}
          </div>

          {book.description && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {book.description}
                </p>
              </div>
            </>
          )}

          {book.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {book.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
