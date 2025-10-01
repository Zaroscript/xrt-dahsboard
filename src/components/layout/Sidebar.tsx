import { useState } from 'react';
import { motion } from 'framer-motion';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  MessageSquare, 
  FileText, 
  Folder, 
  Star,
  Settings,
  ChevronLeft,
  ChevronRight,
  Crown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useAppSelector } from '@/store/store';



import { navLogo } from '@/config/constants';
import { useIsMobile } from '@/hooks/use-mobile';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Users', href: '/dashboard/users', icon: Users },
  { name: 'Clients', href: '/dashboard/clients', icon: Crown },
  { name: 'Plans & Pricing', href: '/dashboard/plans', icon: CreditCard },
  { name: 'Support Tickets', href: '/dashboard/support', icon: MessageSquare },
  { name: 'Invoices', href: '/dashboard/invoices', icon: FileText },
  { name: 'Portfolio', href: '/dashboard/portfolio', icon: Folder },
  { name: 'Reviews', href: '/dashboard/reviews', icon: Star },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const location = useLocation();
  const { user } = useAppSelector(state => state.auth);
  const pendingTickets = useAppSelector(state => state.dashboard.stats.pendingTickets);
  const isMobile = useIsMobile();

  // Force collapsed state on mobile
  const effectiveCollapsed = isMobile || collapsed;

  return (
    <motion.div 
      className="h-full bg-sidebar border-r border-sidebar-border glass-card"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          {!effectiveCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center space-x-3"
            >
              <div className="p-1 bg-gradient-to-br from-primary/10 to-transparent rounded-lg shadow-[0_4px_20px_-5px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_25px_-5px_rgba(0,0,0,0.3)]">
                <img 
                  src={navLogo} 
                  alt="Xrt-tech" 
                  className="w-14 rounded-md object-contain shadow-sm"
                />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  {user?.role === 'admin' && (
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary">
                      Admin
                    </span>
                  )}
                  {user?.role === 'moderator' && (
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                      Moderator
                    </span>
                  )}
                </div>
                <p className="text-xs text-sidebar-foreground/60">IT Services Dashboard</p>
              </div>
            </motion.div>
          )}
          
          {/* Hide toggle button on mobile */}
          {!isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="text-sidebar-foreground hover:bg-sidebar-accent ml-auto"
            >
              {collapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Section label */}
      {!effectiveCollapsed && (
        <div className="px-4 pt-4 text-[10px] uppercase tracking-wider text-sidebar-foreground/50">Main</div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item, index) => {
          const isExact = location.pathname === item.href;
          const isNested = location.pathname.startsWith(item.href + '/');
          const isActive = isExact || (item.href !== '/dashboard' && isNested);
          
          const link = (
            <NavLink
              to={item.href}
              className={cn(
                "flex items-center space-x-3 rounded-lg transition-smooth group relative overflow-hidden",
                effectiveCollapsed ? "justify-center p-2" : "p-3",
                isActive 
                  ? "bg-gold-gradient text-primary-foreground shadow-gold ring-1 ring-primary/30" 
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              {/* Active background shimmer */}
              {isActive && (
                <motion.div
                  className="absolute inset-0 bg-gold-gradient rounded-lg"
                  layoutId="activeTab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}

              {/* Active left indicator bar */}
              {isActive && (
                <motion.div
                  className="absolute left-0 top-0 h-full w-1 bg-primary"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
              
              <div className="relative z-10 flex items-center space-x-3">
                <item.icon className={cn(
                  "w-5 h-5 transition-smooth",
                  isActive ? "text-primary-foreground" : "text-sidebar-foreground/70 group-hover:text-sidebar-accent-foreground",
                  "group-hover:scale-105"
                )} />
                {!effectiveCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={cn(
                      "font-medium transition-smooth",
                      isActive ? "text-primary-foreground" : "text-sidebar-foreground group-hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <span className="group-hover:translate-x-0.5 inline-block transition-transform">{item.name}</span>
                  </motion.span>
                )}

                {/* Optional counters */}
                {!effectiveCollapsed && item.name === 'Support Tickets' && pendingTickets > 0 && (
                  <Badge variant="secondary" className="ml-auto text-[10px]">
                    {pendingTickets}
                  </Badge>
                )}
              </div>

              {/* Hover effect */}
              <motion.div
                className="absolute inset-0 bg-sidebar-accent/60 rounded-lg opacity-0 group-hover:opacity-100 transition-smooth"
                whileHover={{ scale: 1.01 }}
              />
            </NavLink>
          );

          return (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {collapsed ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    {link}
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    {item.name}
                  </TooltipContent>
                </Tooltip>
              ) : (
                link
              )}
            </motion.div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        {!effectiveCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-sidebar-foreground/60 text-center"
          >
            <p>Xrt-tech</p>
            <p>Admin Dashboard</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};