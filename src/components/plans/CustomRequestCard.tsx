import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { usePlansData } from '@/hooks/usePlansData';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import type { CustomPlanRequest } from '@/store/slices/plansSlice';

export const CustomRequestCard: React.FC<{ request: CustomPlanRequest }> = ({ request }) => {
  const { updateCustomRequest } = usePlansData();
  const [isLoading, setIsLoading] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isApproving, setIsApproving] = useState(false);

  const handleApprove = async () => {
    try {
      setIsApproving(true);
      await updateCustomRequest({
        id: request.id,
        status: 'approved',
        response: 'Your custom plan request has been approved. We will contact you shortly with more details.'
      });
    } catch (error) {
      console.error('Failed to approve request:', error);
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) return;
    
    try {
      setIsLoading(true);
      await updateCustomRequest({
        id: request.id,
        status: 'rejected',
        response: `Request rejected: ${rejectionReason}`
      });
      
      setIsRejectDialogOpen(false);
      setRejectionReason('');
    } catch (error) {
      console.error('Failed to reject request:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ scale: 1.01 }}>
      <Card className="glass-card-hover">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold text-foreground">{request.userName}</h3>
              <p className="text-sm text-muted-foreground">{request.userEmail}</p>
            </div>
            <Badge className={getStatusColor(request.status)}>
              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
            </Badge>
          </div>

          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium text-foreground mb-1">Requirements</h4>
              <p className="text-sm text-muted-foreground">{request.requirements}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-muted-foreground">Budget:</span><span className="ml-2 font-medium text-foreground">${request.budget}</span></div>
              <div><span className="text-muted-foreground">Timeline:</span><span className="ml-2 font-medium text-foreground">{request.timeline}</span></div>
            </div>
            {request.response && (
              <div>
                <h4 className="text-sm font-medium text-foreground mb-1">Response</h4>
                <p className="text-sm text-muted-foreground">{request.response}</p>
              </div>
            )}
          </div>

          {request.status === 'pending' && (
            <div className="flex space-x-2 mt-4">
              <Button 
                size="sm" 
                className="bg-success text-success-foreground"
                onClick={handleApprove}
                disabled={isApproving || isLoading}
              >
                {isApproving ? 'Approving...' : 'Approve'}
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setIsRejectDialogOpen(true)}
                disabled={isApproving || isLoading}
              >
                Reject
              </Button>
            </div>
          )}

          <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reject Request</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="rejectionReason">Reason for rejection</Label>
                  <Textarea
                    id="rejectionReason"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Please provide a reason for rejecting this request"
                    className="min-h-[100px]"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsRejectDialogOpen(false);
                    setRejectionReason('');
                  }}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleReject}
                  disabled={!rejectionReason.trim() || isLoading}
                >
                  {isLoading ? 'Rejecting...' : 'Confirm Rejection'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <div className="text-xs text-muted-foreground mt-4">Submitted {new Date(request.createdAt).toLocaleDateString()}</div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CustomRequestCard;

