'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loan, Role } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { loansApi } from '@/lib/api/loans';
import { formatDateShort, isOverdue } from '@/lib/utils';
import { RotateCcw, Loader2, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function StatusBadge({ status }: { status: string }) {
  const variants = {
    ACTIVE: 'success',
    RETURNED: 'secondary',
    OVERDUE: 'destructive',
  } as const;
  return <Badge variant={variants[status as keyof typeof variants] ?? 'outline'}>{status}</Badge>;
}

interface LoanTableProps {
  loans: Loan[];
  total: number;
  currentPage: number;
  userRole: Role;
  accessToken: string;
}

export function LoanTable({ loans, total, currentPage, userRole, accessToken }: LoanTableProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const limit = 20;
  const totalPages = Math.ceil(total / limit);

  const { mutate: returnBook, isPending, variables } = useMutation({
    mutationFn: (loanId: string) => loansApi.return(loanId, accessToken),
    onSuccess: () => {
      toast.success('Book returned successfully');
      queryClient.invalidateQueries({ queryKey: ['loans'] });
      router.refresh();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to return book');
    },
  });

  if (loans.length === 0) {
    return (
      <Card>
        <CardContent className="py-16 text-center text-muted-foreground">
          <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">No loans found</p>
          <p className="text-sm mt-1">
            <Link href="/books" className="text-primary hover:underline">
              Browse books
            </Link>{' '}
            to get started
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 font-medium">Book</th>
              {userRole !== 'MEMBER' && <th className="text-left p-4 font-medium">Member</th>}
              <th className="text-left p-4 font-medium">Borrowed</th>
              <th className="text-left p-4 font-medium">Due Date</th>
              <th className="text-left p-4 font-medium">Status</th>
              <th className="p-4" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {loans.map((loan) => (
              <tr key={loan.id} className="hover:bg-muted/30 transition-colors">
                <td className="p-4">
                  <div>
                    <Link
                      href={`/books/${loan.bookId}`}
                      className="font-medium hover:text-primary hover:underline line-clamp-1"
                    >
                      {loan.book?.title ?? 'Unknown'}
                    </Link>
                    <p className="text-xs text-muted-foreground">{loan.book?.author}</p>
                  </div>
                </td>
                {userRole !== 'MEMBER' && (
                  <td className="p-4 text-muted-foreground">{loan.user?.name}</td>
                )}
                <td className="p-4 text-muted-foreground">{formatDateShort(loan.borrowedAt)}</td>
                <td className="p-4">
                  <span className={loan.status === 'ACTIVE' && isOverdue(loan.dueDate) ? 'text-destructive font-medium' : ''}>
                    {formatDateShort(loan.dueDate)}
                  </span>
                </td>
                <td className="p-4">
                  <StatusBadge status={loan.status} />
                </td>
                <td className="p-4">
                  {loan.status !== 'RETURNED' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => returnBook(loan.id)}
                      disabled={isPending && variables === loan.id}
                    >
                      {isPending && variables === loan.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <RotateCcw className="h-3 w-3 mr-1" />
                      )}
                      Return
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" asChild disabled={currentPage <= 1}>
            <Link href={`?page=${currentPage - 1}`}>
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button variant="outline" size="sm" asChild disabled={currentPage >= totalPages}>
            <Link href={`?page=${currentPage + 1}`}>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
