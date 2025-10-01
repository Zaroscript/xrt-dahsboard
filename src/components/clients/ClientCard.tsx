import { motion } from "framer-motion";
import { MoreHorizontal, Phone, Mail, Star, User as UserIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { User as UserType } from "@/store/slices/usersSlice";

interface ClientCardProps {
  client: UserType;
  onUpdate: (user: UserType) => void;
}

export const ClientCard: React.FC<ClientCardProps> = ({ client, onUpdate }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={() => navigate(`/dashboard/clients/${client.id}`)}
      className="cursor-pointer"
    >
      <Card className="glass-card-hover overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gold-gradient" />
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16 ring-2 ring-primary/20">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${client.email}`}
                />
                <AvatarFallback className="bg-gold-gradient text-primary-foreground text-lg font-bold">
                  {client.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <h3 className="text-xl font-bold text-foreground">
                    {client.name}
                  </h3>
                  
                </div>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Mail className="w-4 h-4" />
                    <span>{client.email}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Phone className="w-4 h-4" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                </div>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="glass-card">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass-card">
                <DropdownMenuItem 
                  className="flex items-center"
                  onSelect={(e) => {
                    e.preventDefault();
                    navigate(`dashboard/clients/${client.id}`);
                  }}
                >
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>View Profile</span>
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Client Stats */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 bg-muted/20 rounded-lg">
              <div className="text-lg font-bold text-primary">
                ${client.subscription?.amount || 0}
              </div>
              <div className="text-xs text-muted-foreground">Monthly Plan</div>
            </div>
            <div className="text-center p-3 bg-muted/20 rounded-lg">
              <div className="text-lg font-bold text-success">18 months</div>
              <div className="text-xs text-muted-foreground">Client Since</div>
            </div>
            <div className="text-center p-3 bg-muted/20 rounded-lg">
              <div className="flex items-center justify-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-lg font-bold">4.9</span>
              </div>
              <div className="text-xs text-muted-foreground">Rating</div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="space-y-2">
            <h4 className="font-medium text-foreground">Recent Activity</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Payment</span>
                <span className="text-success">3 days ago</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Support Ticket</span>
                <span className="text-foreground">1 week ago</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Project Delivery</span>
                <span className="text-foreground">2 weeks ago</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ClientCard;
