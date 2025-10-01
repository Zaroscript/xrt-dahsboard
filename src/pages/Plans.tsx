import { useState } from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  Plus,
  Zap,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  addPlan,
  updatePlan,
  setPlans,
  deletePlan,
} from "@/store/slices/plansSlice";
import type { Plan, CustomPlanRequest } from "@/store/slices/plansSlice";
import PlanCard from "@/components/plans/PlanCard";
import PlanDialog from "@/components/plans/PlanDialog";
import { toast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";
import { useAppDispatch } from "@/store/store";
import { usePlansData } from "@/hooks/usePlansData";
import { CustomRequestCard } from "@/components/plans/CustomRequestCard";

const Plans = () => {
  const dispatch = useAppDispatch();
  const { plans, customRequests } = usePlansData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEditPlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (planId: string) => {
    setPlanToDelete(planId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeletePlan = async () => {
    if (!planToDelete) return;

    try {
      setIsDeleting(true);
      // In a real app, you would make an API call here
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Dispatch the deletePlan action
      dispatch(deletePlan(planToDelete));

      toast({
        title: "Success",
        description: "Plan deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting plan:", error);
      toast({
        title: "Error",
        description: "Failed to delete plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setPlanToDelete(null);
    }
  };

  const handleSubmitPlan = async (data: any) => {
    try {
      setIsSubmitting(true);

      if (selectedPlan) {
        // Update existing plan
        const updatedPlan = {
          ...selectedPlan,
          ...data,
          updatedAt: new Date().toISOString(),
        };

        // In a real app, you would make an API call here
        await new Promise((resolve) => setTimeout(resolve, 500));
        dispatch(updatePlan(updatedPlan));

        toast({
          title: "Success",
          description: "Plan updated successfully",
        });
      } else {
        // Create new plan
        const newPlan: Plan = {
          id: uuidv4(),
          ...data,
          isActive: data.isActive ?? true,
          isCustom: data.isCustom ?? false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        // In a real app, you would make an API call here
        await new Promise((resolve) => setTimeout(resolve, 500));
        dispatch(addPlan(newPlan));

        toast({
          title: "Success",
          description: "Plan created successfully",
        });
      }

      setIsDialogOpen(false);
      setSelectedPlan(null);
    } catch (error) {
      console.error("Error saving plan:", error);
      toast({
        title: "Error",
        description: "Failed to save plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreatePlan = () => {
    setSelectedPlan(null);
    setIsDialogOpen(true);
  };

  const handleAddDiscount = () => {
    if (plans.length === 0) {
      toast({
        title: "No plans available",
        description: "Please create a plan first",
        variant: "destructive",
      });
      return;
    }

    setSelectedPlan({
      ...plans[0],
      discount: {
        percentage: 10,
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
      },
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center space-x-3">
            <CreditCard className="w-8 h-8 text-primary" />
            <span>Plans & Pricing</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage subscription plans, pricing, and custom plan requests
          </p>
        </div>

        <div className="flex space-x-3">
          <Button
            className="bg-gold-gradient text-primary-foreground shadow-gold"
            onClick={handleCreatePlan}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Plan
          </Button>
        </div>
      </motion.div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <PlanCard
              plan={plan}
              onEdit={handleEditPlan}
              onDelete={handleDeleteClick}
            />
          </motion.div>
        ))}
      </div>

      {/* Custom Plan Requests */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-primary" />
              <span>Custom Plan Requests</span>
              <Badge variant="secondary">{customRequests.length}</Badge>
            </CardTitle>
            <CardDescription>
              Review and respond to custom plan requests from potential clients
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {customRequests.length === 0 ? (
              <div className="text-center py-8">
                <Zap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No custom plan requests yet
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {customRequests.map((request, index) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <CustomRequestCard request={request} />
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Plan Dialog */}
      <PlanDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedPlan(null);
          }
          setIsDialogOpen(open);
        }}
        plan={selectedPlan}
        onSubmit={handleSubmitPlan}
        isLoading={isSubmitting}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <AlertDialogTitle>Delete Plan</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="pt-4">
              Are you sure you want to delete this plan? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.stopPropagation();
                handleDeletePlan();
              }}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Plan"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Plans;
