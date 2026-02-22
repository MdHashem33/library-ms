'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, X } from 'lucide-react';

const GENRES = [
  'Programming',
  'Software Engineering',
  'Software Architecture',
  'Science Fiction',
  'Fantasy',
  'Fiction',
  'Classic Literature',
  'Non-Fiction',
  'History',
  'Science',
];

export function BookFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get('search') ?? '';
  const genre = searchParams.get('genre') ?? '';

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete('page');
      router.push(`?${params.toString()}`);
    },
    [router, searchParams],
  );

  const clearFilters = () => {
    router.push('?');
  };

  const hasFilters = search || genre;

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by title, author, ISBN..."
          defaultValue={search}
          className="pl-9"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              updateParam('search', (e.target as HTMLInputElement).value);
            }
          }}
          onChange={(e) => {
            if (!e.target.value) updateParam('search', '');
          }}
        />
      </div>

      <Select value={genre || 'all'} onValueChange={(v) => updateParam('genre', v === 'all' ? '' : v)}>
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="All genres" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All genres</SelectItem>
          {GENRES.map((g) => (
            <SelectItem key={g} value={g}>
              {g}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button variant="ghost" size="icon" onClick={clearFilters} title="Clear filters">
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
