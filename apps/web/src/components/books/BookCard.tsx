import Link from 'next/link';
import Image from 'next/image';
import { Book } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { BookOpen, MapPin } from 'lucide-react';
import { truncate } from '@/lib/utils';

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  const isAvailable = book.available > 0;

  return (
    <Link href={`/books/${book.id}`}>
      <Card className="h-full hover:shadow-md transition-shadow cursor-pointer group">
        <CardContent className="p-4">
          {/* Cover image */}
          <div className="relative w-full h-40 bg-muted rounded-md mb-3 overflow-hidden">
            {book.coverImage ? (
              <Image
                src={book.coverImage}
                alt={book.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <BookOpen className="h-12 w-12 text-muted-foreground/30" />
              </div>
            )}
            <div className="absolute top-2 right-2">
              <Badge variant={isAvailable ? 'success' : 'destructive'}>
                {isAvailable ? `${book.available} available` : 'Unavailable'}
              </Badge>
            </div>
          </div>

          {/* Book info */}
          <h3 className="font-semibold text-sm leading-tight group-hover:text-primary transition-colors line-clamp-2">
            {book.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">{book.author}</p>

          {book.description && (
            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
              {truncate(book.description, 100)}
            </p>
          )}
        </CardContent>

        <CardFooter className="px-4 pb-4 pt-0 flex flex-wrap gap-1">
          {book.genre.slice(0, 2).map((g) => (
            <Badge key={g} variant="secondary" className="text-xs">
              {g}
            </Badge>
          ))}
          {book.location && (
            <Badge variant="outline" className="text-xs ml-auto">
              <MapPin className="h-3 w-3 mr-1" />
              {book.location}
            </Badge>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
