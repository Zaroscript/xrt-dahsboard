import { Badge } from '@/components/ui/badge';
import type { User } from '@/store/slices/usersSlice';

export const StatusBadge = ({ status }: { status: User['status'] }) => {
  const variants: Record<User['status'], string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    blocked: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    rejected: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
  };

  return (
    <Badge className={variants[status]}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

export default StatusBadge;

