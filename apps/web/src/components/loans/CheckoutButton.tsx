'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { loansApi } from '@/lib/api/loans';
import { BookMarked, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CheckoutButtonProps {
  bookId: string;
  available: number;
  accessToken: string;
}

export function CheckoutButton({ bookId, available, accessToken }: CheckoutButtonProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: checkout, isPending } = useMutation({
    mutationFn: () => loansApi.checkout({ bookId }, accessToken),
    onSuccess: (loan) => {
      toast.success(`Book checked out! Due: ${new Date(loan.dueDate).toLocaleDateString()}`);
      queryClient.invalidateQueries({ queryKey: ['loans'] });
      router.refresh();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to checkout book');
    },
  });

  if (available <= 0) {
    return (
      <Button className="w-full" disabled variant="outline">
        Not Available
      </Button>
    );
  }

  return (
    <Button className="w-full" onClick={() => checkout()} disabled={isPending}>
      {isPending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <BookMarked className="mr-2 h-4 w-4" />
      )}
      Checkout
    </Button>
  );
}
