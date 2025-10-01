import { useState } from 'react';
import { motion } from 'framer-motion';
import { Crown, Search, Filter, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppSelector } from '@/store/store';
import { useClientsData } from '@/hooks/useClientsData';
import ClientCard from '@/components/clients/ClientCard';
import { AddClientDialog } from '@/components/clients/AddClientDialog';
import { useExportClients } from '@/hooks/useExportClients';

const Clients = () => {
  const { clients } = useAppSelector(state => state.users);
  const { searchTerm, setSearchTerm, sortBy, setSortBy, filteredClients, totalRevenue, avgClientValue, handleClientUpdate } = useClientsData();
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const { isExporting, exportToCSV } = useExportClients();

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
            <Crown className="w-8 h-8 text-primary" />
            <span>Premium Clients</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your premium recipe sharing business clients
          </p>
        </div>
        
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            className="glass-card"
            onClick={() => exportToCSV(filteredClients)}
            disabled={isExporting || filteredClients.length === 0}
          >
            {isExporting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Exporting...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export Report
              </>
            )}
          </Button>
          <Button 
            className="bg-gold-gradient text-primary-foreground shadow-gold hover:shadow-gold/80"
            onClick={() => setIsAddClientOpen(true)}
            disabled={isExporting}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Client
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { 
            label: 'Total Clients', 
            value: clients.length, 
            icon: Crown,
            color: 'from-purple-500 to-purple-600',
            description: 'Active premium clients'
          },
          { 
            label: 'Monthly Revenue', 
            value: `$${totalRevenue.toLocaleString()}`, 
            icon: Crown,
            color: 'from-green-500 to-green-600',
            description: 'Recurring revenue'
          },
          { 
            label: 'Avg Client Value', 
            value: `$${Math.round(avgClientValue)}`, 
            icon: Crown,
            color: 'from-blue-500 to-blue-600',
            description: 'Per month'
          },
          { 
            label: 'Client Satisfaction', 
            value: '4.8/5', 
            icon: Crown,
            color: 'from-yellow-500 to-yellow-600',
            description: 'Average rating'
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <Card className="glass-card-hover overflow-hidden relative">
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${stat.color}`} />
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color} bg-opacity-10`}>
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.description}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search clients by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 glass-card"
          />
        </div>
        
        <Select 
          value={sortBy} 
          onValueChange={(value: 'name' | 'revenue' | 'date') => setSortBy(value)}
        >
          <SelectTrigger className="w-full sm:w-48 glass-card">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="glass-card">
            <SelectItem value="name">Sort by Name</SelectItem>
            <SelectItem value="revenue">Sort by Revenue</SelectItem>
            <SelectItem value="date">Sort by Join Date</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredClients.map((client, index) => (
          <motion.div
            key={client.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (index % 4) * 0.1 }}
          >
            <ClientCard client={client} onUpdate={handleClientUpdate} />
          </motion.div>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Crown className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No clients found</h3>
          <p className="text-muted-foreground">
            {searchTerm ? 'Try adjusting your search terms' : 'Start by adding your first premium client'}
          </p>
        </motion.div>
      )}

      {/* Add Client Dialog */}
      <AddClientDialog 
        open={isAddClientOpen} 
        onOpenChange={setIsAddClientOpen} 
      />
    </div>
  );
};

export default Clients;