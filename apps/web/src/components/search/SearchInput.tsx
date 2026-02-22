'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface SearchInputProps {
  defaultValue?: string;
}

export function SearchInput({ defaultValue = '' }: SearchInputProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useCallback(() => {
    const q = inputRef.current?.value.trim() ?? '';
    if (q) {
      router.push(`/search?q=${encodeURIComponent(q)}`);
    } else {
      router.push('/search');
    }
  }, [router]);

  return (
    <div className="flex gap-2 max-w-xl">
      <Input
        ref={inputRef}
        placeholder="Search books by title, author, or ISBN..."
        defaultValue={defaultValue}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        className="flex-1"
        autoFocus
      />
      <Button onClick={handleSearch}>
        <Search className="h-4 w-4 mr-2" />
        Search
      </Button>
    </div>
  );
}
