import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, BookMarked, AlertTriangle } from 'lucide-react';
import { StatsResponse } from '@/lib/api/users';

interface DashboardStatsProps {
  stats: StatsResponse;
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const items = [
    {
      label: 'Total Books',
      value: stats.totalBooks,
      icon: <BookOpen className="h-5 w-5 text-blue-500" />,
      bg: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      label: 'Total Members',
      value: stats.totalUsers,
      icon: <Users className="h-5 w-5 text-green-500" />,
      bg: 'bg-green-50 dark:bg-green-950',
    },
    {
      label: 'Active Loans',
      value: stats.activeLoans,
      icon: <BookMarked className="h-5 w-5 text-yellow-500" />,
      bg: 'bg-yellow-50 dark:bg-yellow-950',
    },
    {
      label: 'Overdue Loans',
      value: stats.overdueLoans,
      icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
      bg: 'bg-red-50 dark:bg-red-950',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <Card key={item.label}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {item.label}
            </CardTitle>
            <div className={`p-2 rounded-full ${item.bg}`}>{item.icon}</div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{item.value.toLocaleString()}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
