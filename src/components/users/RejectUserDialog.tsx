import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useAppDispatch } from '@/store/store';
import { updateUser } from '@/store/slices/usersSlice';
import type { User } from '@/store/slices/usersSlice';

interface RejectUserDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const RejectUserDialog = ({
  user,
  open,
  onOpenChange,
  onSuccess,
}: RejectUserDialogProps) => {
  const dispatch = useAppDispatch();
  const [reason, setReason] = useState(user.rejectionReason || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    setIsSubmitting(true);
    try {
      const result = dispatch(updateUser({
        ...user,
        status: 'rejected',
        rejectionReason: reason.trim(),
      }));
      
      // If the update is successful, the parent component will handle the state update
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to reject user:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Reject User
          </DialogTitle>
          <DialogDescription>
            Please provide a reason for rejecting this user. This will be visible to them.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Textarea
              id="reason"
              placeholder="Enter the reason for rejection..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              rows={4}
              className="min-h-[100px]"
            />
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={!reason.trim() || isSubmitting}
              className="gap-2"
            >
              {isSubmitting ? 'Saving...' : 'Reject User'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RejectUserDialog;
