import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Plus } from 'lucide-react';
import { PlanForm } from './PlanForm';
import type { Plan } from '@/store/slices/plansSlice';

interface PlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => Promise<void>;
  plan?: Plan;
  isLoading?: boolean;
}

export const PlanDialog = ({
  open,
  onOpenChange,
  onSubmit,
  plan,
  isLoading = false,
}: PlanDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{plan ? 'Edit Plan' : 'Create New Plan'}</DialogTitle>
        </DialogHeader>
        <PlanForm
          plan={plan}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isLoading={isLoading || isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};

export default PlanDialog;
