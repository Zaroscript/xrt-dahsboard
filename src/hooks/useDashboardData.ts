import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { setStats, setRecentActivities } from '@/store/slices/dashboardSlice';

export const useDashboardData = () => {
  const dispatch = useAppDispatch();
  const dashboard = useAppSelector(state => state.dashboard);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setStats({
        totalUsers: 1247,
        activeUsers: 892,
        totalRevenue: 45680,
        activeSubscriptions: 156,
        pendingTickets: 23,
        portfolioProjects: 48,
      }));

      dispatch(setRecentActivities([
        { id: '1', type: 'user_signup', message: 'New user registered: sarah@restaurant.com', timestamp: '2 minutes ago', user: 'Sarah Wilson' },
        { id: '2', type: 'payment', message: 'Payment received for Premium Plan', timestamp: '15 minutes ago', user: 'Mike Johnson' },
        { id: '3', type: 'support_ticket', message: 'New support ticket: Recipe import issues', timestamp: '1 hour ago', user: 'Emily Davis' },
        { id: '4', type: 'project_created', message: 'New portfolio project added: Italian Bistro', timestamp: '3 hours ago' },
      ]));
    }, 1000);
    return () => clearTimeout(timer);
  }, [dispatch]);

  return dashboard;
};

export default useDashboardData;

