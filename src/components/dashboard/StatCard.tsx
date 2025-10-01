import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: string;
  color: string; // tailwind gradient classes: from-*-* to-*-*
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, description, icon: Icon, trend, color }) => (
  <motion.div whileHover={{ scale: 1.02, y: -5 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
    <Card className="glass-card-hover overflow-hidden relative">
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${color}`} />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={`p-2 rounded-lg bg-gradient-to-br ${color} bg-opacity-10`}>
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <span>{description}</span>
          {trend && <span className="px-2 py-0.5 rounded bg-muted/60">{trend}</span>}
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

export default StatCard;

