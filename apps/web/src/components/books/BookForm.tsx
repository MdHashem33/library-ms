'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { booksApi } from '@/lib/api/books';
import { Book } from '@/types';
import { Loader2 } from 'lucide-react';

const schema = z.object({
  title: z.string().min(1, 'Title is required').max(500),
  author: z.string().min(1, 'Author is required').max(200),
  isbn: z.string().optional(),
  description: z.string().optional(),
  genre: z.string().optional(),
  publisher: z.string().optional(),
  pages: z.coerce.number().min(1).optional().or(z.literal('')),
  copies: z.coerce.number().min(1).default(1),
  location: z.string().optional(),
  language: z.string().default('English'),
  coverImage: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  tags: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface BookFormProps {
  book?: Book;
  accessToken: string;
}

export function BookForm({ book, accessToken }: BookFormProps) {
  const router = useRouter();
  const isEditing = !!book;

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: book
      ? {
          title: book.title,
          author: book.author,
          isbn: book.isbn ?? '',
          description: book.description ?? '',
          genre: book.genre?.join(', ') ?? '',
          publisher: book.publisher ?? '',
          pages: book.pages ?? '',
          copies: book.copies,
          location: book.location ?? '',
          language: book.language,
          coverImage: book.coverImage ?? '',
          tags: book.tags?.join(', ') ?? '',
        }
      : { copies: 1, language: 'English' },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        ...data,
        genre: data.genre ? data.genre.split(',').map((g) => g.trim()).filter(Boolean) : [],
        tags: data.tags ? data.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
        pages: data.pages ? Number(data.pages) : undefined,
        coverImage: data.coverImage || undefined,
        isbn: data.isbn || undefined,
      };

      if (isEditing) {
        await booksApi.update(book.id, payload, accessToken);
        toast.success('Book updated successfully');
      } else {
        const newBook = await booksApi.create(payload, accessToken);
        toast.success('Book added successfully');
        router.push(`/books/${newBook.id}`);
      }
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save book');
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" placeholder="Book title" {...register('title')} />
              {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">Author *</Label>
              <Input id="author" placeholder="Author name" {...register('author')} />
              {errors.author && <p className="text-sm text-destructive">{errors.author.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="isbn">ISBN</Label>
              <Input id="isbn" placeholder="978-..." {...register('isbn')} />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Book description..."
                rows={3}
                {...register('description')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="genre">Genres (comma-separated)</Label>
              <Input id="genre" placeholder="Fiction, Classic Literature" {...register('genre')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="publisher">Publisher</Label>
              <Input id="publisher" placeholder="Publisher name" {...register('publisher')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pages">Pages</Label>
              <Input id="pages" type="number" placeholder="350" {...register('pages')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="copies">Copies *</Label>
              <Input id="copies" type="number" min="1" {...register('copies')} />
              {errors.copies && <p className="text-sm text-destructive">{errors.copies.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Shelf Location</Label>
              <Input id="location" placeholder="A-12" {...register('location')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Input id="language" placeholder="English" {...register('language')} />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="coverImage">Cover Image URL</Label>
              <Input id="coverImage" type="url" placeholder="https://..." {...register('coverImage')} />
              {errors.coverImage && <p className="text-sm text-destructive">{errors.coverImage.message}</p>}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input id="tags" placeholder="classic, bestseller" {...register('tags')} />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Update Book' : 'Add Book'}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
