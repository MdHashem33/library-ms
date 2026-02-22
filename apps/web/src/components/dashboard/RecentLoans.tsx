import { Loan } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { formatDateShort } from '@/lib/utils';
import Link from 'next/link';

interface RecentLoansProps {
  loans: Loan[];
}

export function RecentLoans({ loans }: RecentLoansProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="divide-y">
          {loans.map((loan) => (
            <div key={loan.id} className="flex items-center gap-4 p-4">
              <div className="flex-1 min-w-0">
                <Link
                  href={`/books/${loan.bookId}`}
                  className="font-medium text-sm hover:text-primary hover:underline line-clamp-1"
                >
                  {loan.book?.title ?? 'Unknown'}
                </Link>
                <p className="text-xs text-muted-foreground">{loan.book?.author}</p>
              </div>
              <div className="text-right text-xs text-muted-foreground">
                <p>Due: {formatDateShort(loan.dueDate)}</p>
              </div>
              <Badge
                variant={
                  loan.status === 'RETURNED'
                    ? 'secondary'
                    : loan.status === 'OVERDUE'
                    ? 'destructive'
                    : 'success'
                }
                className="text-xs"
              >
                {loan.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
