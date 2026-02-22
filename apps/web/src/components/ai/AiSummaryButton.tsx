'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { aiApi } from '@/lib/api/ai';
import { Sparkles, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AiSummaryButtonProps {
  bookId: string;
  accessToken: string;
}

export function AiSummaryButton({ bookId, accessToken }: AiSummaryButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const result = await aiApi.generateSummary(bookId, accessToken);
      toast.success('AI summary generated and saved!');
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate summary');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={handleGenerate}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Sparkles className="mr-2 h-4 w-4" />
      )}
      Generate AI Summary
    </Button>
  );
}
