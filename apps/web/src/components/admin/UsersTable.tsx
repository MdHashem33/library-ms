'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { User, Role } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { usersApi } from '@/lib/api/users';
import { formatDateShort } from '@/lib/utils';
import { Trash2, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function RoleBadge({ role }: { role: Role }) {
  const variants = {
    ADMIN: 'destructive',
    LIBRARIAN: 'default',
    MEMBER: 'secondary',
  } as const;
  return <Badge variant={variants[role]}>{role}</Badge>;
}

interface UsersTableProps {
  users: User[];
  total: number;
  currentPage: number;
  accessToken: string;
}

export function UsersTable({ users, total, currentPage, accessToken }: UsersTableProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const limit = 20;
  const totalPages = Math.ceil(total / limit);

  const { mutate: deleteUser, isPending, variables } = useMutation({
    mutationFn: (userId: string) => usersApi.delete(userId, accessToken),
    onSuccess: () => {
      toast.success('User deleted');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      router.refresh();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete user');
    },
  });

  if (users.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">No users found</CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 font-medium">Name</th>
              <th className="text-left p-4 font-medium">Email</th>
              <th className="text-left p-4 font-medium">Role</th>
              <th className="text-left p-4 font-medium">Joined</th>
              <th className="p-4" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-muted/30">
                <td className="p-4 font-medium">{user.name}</td>
                <td className="p-4 text-muted-foreground">{user.email}</td>
                <td className="p-4">
                  <RoleBadge role={user.role} />
                </td>
                <td className="p-4 text-muted-foreground">{formatDateShort(user.createdAt)}</td>
                <td className="p-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => {
                      if (confirm(`Delete user ${user.name}?`)) deleteUser(user.id);
                    }}
                    disabled={isPending && variables === user.id}
                  >
                    {isPending && variables === user.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
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
