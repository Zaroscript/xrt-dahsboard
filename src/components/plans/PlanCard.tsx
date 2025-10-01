import { motion } from "framer-motion";
import {
  Edit,
  Trash2,
  Percent,
  Crown,
  Zap,
  Star,
  Users,
  MoreHorizontal,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Plan } from "@/store/slices/plansSlice";

export const PlanCard: React.FC<{
  plan: Plan;
  onEdit: (plan: Plan) => void;
  onDelete: (id: string) => void;
}> = ({ plan, onEdit, onDelete }) => {
  const getPlanIcon = () => {
    switch (plan.name.toLowerCase()) {
      case "basic":
        return Users;
      case "professional":
      case "premium":
        return Star;
      case "enterprise":
        return Crown;
      default:
        return Zap;
    }
  };
  const PlanIcon = getPlanIcon();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card
        className={`glass-card-hover h-full relative overflow-hidden ${
          plan.name.toLowerCase() === "premium" ? "ring-2 ring-primary/50" : ""
        }`}
      >
        {plan.name.toLowerCase() === "premium" && (
          <div className="absolute top-0 left-0 w-full h-2 bg-gold-gradient" />
        )}
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-between mb-4">
            <div
              className={`p-3 rounded-full ${
                plan.name.toLowerCase() === "premium"
                  ? "bg-gold-gradient"
                  : "bg-primary/10"
              }`}
            >
              <PlanIcon
                className={`w-6 h-6 ${
                  plan.name.toLowerCase() === "premium"
                    ? "text-primary-foreground"
                    : "text-primary"
                }`}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass-card">
                <DropdownMenuItem onClick={() => onEdit(plan)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Plan
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => onDelete(plan.id)}
                  className="text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Plan
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <CardTitle className="text-2xl font-bold">
            <div className="flex items-center">
              {plan.name}
              {plan.badge && (
                <Badge 
                  variant={plan.badge.variant as any} 
                  className={`ml-2 ${plan.badge.variant === 'gold' ? 'bg-gold-gradient text-primary-foreground' : ''}`}
                >
                  {plan.badge.text}
                </Badge>
              )}
              {!plan.badge && plan.name.toLowerCase() === "premium" && (
                <Badge className="ml-2 bg-gold-gradient text-primary-foreground">
                  Most Popular
                </Badge>
              )}
            </div>
          </CardTitle>
          <div className="space-y-2">
            <div className="text-4xl font-bold text-primary">
              ${plan.price}
              <span className="text-lg text-muted-foreground font-normal">
                /{plan.duration === "monthly" ? "mo" : "yr"}
              </span>
            </div>
            {plan.discount && (
              <div className="flex items-center justify-center space-x-2">
                <Percent className="w-4 h-4 text-success" />
                <span className="text-success font-medium">
                  {plan.discount.percentage}% off until{" "}
                  {new Date(plan.discount.validUntil).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
          <CardDescription className="text-center">
            {plan.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {plan.features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-3"
              >
                <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                  <span className="w-3 h-3 rounded-full bg-success inline-block" />
                </div>
                <span className="text-sm text-foreground">{feature}</span>
              </motion.div>
            ))}
          </div>
          <div className="text-center text-xs text-muted-foreground">
            Active since {new Date(plan.createdAt).toLocaleDateString()}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PlanCard;
