/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  DollarSign, 
  CreditCard, 
  MessageSquare,
  TrendingUp,
  Activity,
  Clock,
  Star
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useAppDispatch } from '@/store/store';
import { RevenueUsersChart, TicketsBarChart, UsersClientsChart } from '@/components/dashboard/Charts';
import StatCard from '@/components/dashboard/StatCard';
import { RecentActivityCard } from '@/components/dashboard/RecentActivity';
import { useDashboardData } from '@/hooks/useDashboardData';
import { revenueData, ticketsData, userClientData } from '@/utils/dashboardData';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

// components extracted to components/dashboard and data logic to hooks/utils

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { stats, recentActivities, loading } = useDashboardData();
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [exportDelimiter, setExportDelimiter] = useState<"," | ";">(",");
  const [exportIncludeHeaders, setExportIncludeHeaders] = useState(true);
  const [exportFileName, setExportFileName] = useState(`xrt-tech-report-${new Date().toISOString().slice(0,10)}`);

  const downloadFile = (filename: string, content: string, type = 'text/csv') => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const toCSV = (rows: Array<Record<string, string | number | undefined>>): string => {
    if (!rows.length) return '';
    const headers = Object.keys(rows[0]);
    const escape = (val: string | number | undefined) => {
      const s = String(val ?? '');
      if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
      return s;
    };
    const joiner = exportDelimiter;
    const lines: string[] = [];
    if (exportIncludeHeaders) lines.push(headers.join(joiner));
    lines.push(
      ...rows.map((r: Record<string, string | number | undefined>) => headers.map(h => escape(r[h])).join(joiner))
    );
    return lines.join('\n');
  };

  const handleExportCSV = () => {
    const summary = [{
      totalUsers: stats.totalUsers,
      activeUsers: stats.activeUsers,
      totalRevenue: stats.totalRevenue,
      activeSubscriptions: stats.activeSubscriptions,
      pendingTickets: stats.pendingTickets,
      portfolioProjects: stats.portfolioProjects,
    }];
    const activities = recentActivities.map(a => ({ id: a.id, type: a.type, message: a.message, timestamp: a.timestamp, user: a.user ?? '' }));
    const csv = `Summary\n${toCSV(summary)}\n\nRecentActivities\n${toCSV(activities)}\n`;
    downloadFile(`${exportFileName}.csv`, csv);
    setExportOpen(false);
  };

  // data loading handled in useDashboardData

  const stats_config = [
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      description: "Registered users",
      icon: Users,
      trend: "+12%",
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Active Users",
      value: stats.activeUsers.toLocaleString(),
      description: "Users this month",
      icon: Activity,
      trend: "+8%",
      color: "from-green-500 to-green-600"
    },
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      description: "This month",
      icon: DollarSign,
      trend: "+23%",
      color: "from-yellow-500 to-yellow-600"
    },
    {
      title: "Subscriptions",
      value: stats.activeSubscriptions,
      description: "Active plans",
      icon: CreditCard,
      trend: "+5%",
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Support Tickets",
      value: stats.pendingTickets,
      description: "Pending response",
      icon: MessageSquare,
      color: "from-red-500 to-red-600"
    },
    {
      title: "Portfolio Projects",
      value: stats.portfolioProjects,
      description: "Total projects",
      icon: Star,
      color: "from-indigo-500 to-indigo-600"
    }
  ];

  // chart datasets imported from utils

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your recipe sharing services.
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="glass-card" onClick={() => setExportOpen(true)}>
            <Clock className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button className="bg-gold-gradient text-primary-foreground shadow-gold" onClick={() => setAnalyticsOpen(true)}>
            <Star className="w-4 h-4 mr-2" />
            View Analytics
          </Button>
        </div>
      </motion.div>

      {/* Analytics Modal */}
      <Dialog open={analyticsOpen} onOpenChange={setAnalyticsOpen}>
        <DialogContent className="max-w-4xl glass-card">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span>Analytics Overview</span>
            </DialogTitle>
            <DialogDescription>
              Key performance indicators and recent trends
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="glass-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Revenue (MoM)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Active Subs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeSubscriptions}</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-sm">Revenue & Active Users</CardTitle>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', color: 'hsl(var(--foreground))' }} />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} name="Revenue" />
                    <Line type="monotone" dataKey="users" stroke="hsl(210 60% 50%)" strokeWidth={2} dot={false} name="Active Users" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-sm">Users vs Clients</CardTitle>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={userClientData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', color: 'hsl(var(--foreground))' }} />
                    <Legend />
                    <Line type="monotone" dataKey="users" stroke="hsl(210 60% 50%)" strokeWidth={2} dot={false} name="Users" />
                    <Line type="monotone" dataKey="clients" stroke="hsl(41 61% 64%)" strokeWidth={2} dot={false} name="Clients" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      {/* Export Report Modal */}
      <Dialog open={exportOpen} onOpenChange={setExportOpen}>
        <DialogContent className="max-w-2xl glass-card">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-primary" />
              <span>Export Report</span>
            </DialogTitle>
            <DialogDescription>
              Export a CSV summary including KPIs and recent activities
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Settings */}
            <div>
              <div className="mb-3">
                <h4 className="text-sm font-medium text-foreground">Settings</h4>
                <p className="text-xs text-muted-foreground">Choose format and what to include</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="export-fname">File name</Label>
                  <Input id="export-fname" value={exportFileName} onChange={(e) => setExportFileName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Delimiter</Label>
                  <Select value={exportDelimiter} onValueChange={(v) => setExportDelimiter(v as ',' | ';')}>
                    <SelectTrigger className="glass-card">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value=",">Comma (,)</SelectItem>
                      <SelectItem value=";">Semicolon (;)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-3 md:col-span-2">
                  <Switch id="include-headers" checked={exportIncludeHeaders} onCheckedChange={setExportIncludeHeaders} />
                  <Label htmlFor="include-headers" className="text-sm">Include headers</Label>
                </div>
              </div>
            </div>

            <Separator />

            {/* Preview */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-foreground">Preview</h4>
                  <p className="text-xs text-muted-foreground">A snapshot of what will be exported</p>
                </div>
                <div className="text-xs text-muted-foreground">
                  <span className="mr-2">Rows: {1 + Math.min(5, recentActivities.length)}</span>
                  <span>
                    Size ~{
                      (() => {
                        const sample = `Summary\n${toCSV([{a:1}])}\n\nRecentActivities\n${toCSV([{a:1}])}`;
                        return new Blob([sample]).size;
                      })()
                    } bytes
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-xs font-medium text-muted-foreground mb-1">Summary</div>
                  <div className="overflow-x-auto rounded-md border border-border">
                    <table className="min-w-full text-xs">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="px-3 py-2 text-left">totalUsers</th>
                          <th className="px-3 py-2 text-left">activeUsers</th>
                          <th className="px-3 py-2 text-left">totalRevenue</th>
                          <th className="px-3 py-2 text-left">activeSubscriptions</th>
                          <th className="px-3 py-2 text-left">pendingTickets</th>
                          <th className="px-3 py-2 text-left">portfolioProjects</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="px-3 py-2">{stats.totalUsers}</td>
                          <td className="px-3 py-2">{stats.activeUsers}</td>
                          <td className="px-3 py-2">{stats.totalRevenue}</td>
                          <td className="px-3 py-2">{stats.activeSubscriptions}</td>
                          <td className="px-3 py-2">{stats.pendingTickets}</td>
                          <td className="px-3 py-2">{stats.portfolioProjects}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div>
                  <div className="text-xs font-medium text-muted-foreground mb-1">Recent Activities</div>
                  <div className="overflow-x-auto rounded-md border border-border max-h-40">
                    <table className="min-w-full text-xs">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="px-3 py-2 text-left">id</th>
                          <th className="px-3 py-2 text-left">type</th>
                          <th className="px-3 py-2 text-left">message</th>
                          <th className="px-3 py-2 text-left">timestamp</th>
                          <th className="px-3 py-2 text-left">user</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentActivities.slice(0, 5).map(a => (
                          <tr key={a.id} className="border-t border-border">
                            <td className="px-3 py-2">{a.id}</td>
                            <td className="px-3 py-2">{a.type}</td>
                            <td className="px-3 py-2">{a.message}</td>
                            <td className="px-3 py-2">{a.timestamp}</td>
                            <td className="px-3 py-2">{a.user ?? ''}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setExportOpen(false)}>Cancel</Button>
              <Button className="bg-gold-gradient text-primary-foreground" onClick={handleExportCSV}>Export CSV</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats_config.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueUsersChart data={revenueData} />

        <TicketsBarChart data={ticketsData} />
      </div>

      {/* Users vs Clients */}
      <div className="grid grid-cols-1">
        <UsersClientsChart data={userClientData} />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2">
          <RecentActivityCard activities={recentActivities as any} />
        </motion.div>

        
      </div>
    </div>
  );
};

export default Dashboard;