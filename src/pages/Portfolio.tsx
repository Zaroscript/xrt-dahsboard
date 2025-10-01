import { motion } from 'framer-motion';
import { Folder, Plus, Eye, Edit } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Portfolio = () => {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center space-x-3">
            <Folder className="w-8 h-8 text-primary" />
            <span>Portfolio Management</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Showcase recipe sharing websites and design projects
          </p>
        </div>
        
        <div className="flex space-x-3">
          <Button variant="outline" className="glass-card">
            <Eye className="w-4 h-4 mr-2" />
            View Public
          </Button>
          <Button className="bg-gold-gradient text-primary-foreground shadow-gold">
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </Button>
        </div>
      </motion.div>

      <div className="text-center py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-4"
        >
          <Folder className="w-16 h-16 text-muted-foreground mx-auto" />
          <h3 className="text-xl font-medium text-foreground">Portfolio Coming Soon</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Manage your portfolio of recipe sharing websites, add new projects, and showcase your work to potential clients.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Portfolio;