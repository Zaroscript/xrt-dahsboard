import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, TrendingUp, Users } from 'lucide-react';

export const RevenueUsersChart: React.FC<{ data: Array<any> }> = ({ data }) => (
  <Card className="glass-card">
    <CardHeader>
      <CardTitle className="flex items-center space-x-2">
        <TrendingUp className="w-5 h-5 text-primary" />
        <span>Revenue & Active Users</span>
      </CardTitle>
      <CardDescription>Monthly revenue and active user growth</CardDescription>
    </CardHeader>
    <CardContent className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
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
);

export const TicketsBarChart: React.FC<{ data: Array<any> }> = ({ data }) => (
  <Card className="glass-card">
    <CardHeader>
      <CardTitle className="flex items-center space-x-2">
        <Activity className="w-5 h-5 text-primary" />
        <span>Support Tickets</span>
      </CardTitle>
      <CardDescription>Weekly open vs resolved tickets</CardDescription>
    </CardHeader>
    <CardContent className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
          <YAxis stroke="hsl(var(--muted-foreground))" />
          <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', color: 'hsl(var(--foreground))' }} />
          <Legend />
          <Bar dataKey="open" fill="hsl(0 84% 60%)" name="Open" radius={[6,6,0,0]} />
          <Bar dataKey="resolved" fill="hsl(142 76% 36%)" name="Resolved" radius={[6,6,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

export const UsersClientsChart: React.FC<{ data: Array<any> }> = ({ data }) => (
  <Card className="glass-card">
    <CardHeader>
      <CardTitle className="flex items-center space-x-2">
        <Users className="w-5 h-5 text-primary" />
        <span>Users vs Clients</span>
      </CardTitle>
      <CardDescription>Monthly totals comparison</CardDescription>
    </CardHeader>
    <CardContent className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
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
);

export default null;

