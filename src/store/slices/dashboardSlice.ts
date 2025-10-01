import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalRevenue: number;
  activeSubscriptions: number;
  pendingTickets: number;
  portfolioProjects: number;
}

interface DashboardState {
  stats: DashboardStats;
  recentActivities: Array<{
    id: string;
    type: 'user_signup' | 'payment' | 'support_ticket' | 'project_created';
    message: string;
    timestamp: string;
    user?: string;
  }>;
  loading: boolean;
  theme: 'light' | 'dark';
}

const initialState: DashboardState = {
  stats: {
    totalUsers: 0,
    activeUsers: 0,
    totalRevenue: 0,
    activeSubscriptions: 0,
    pendingTickets: 0,
    portfolioProjects: 0,
  },
  recentActivities: [],
  loading: false,
  theme: 'dark',
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setStats: (state, action: PayloadAction<DashboardStats>) => {
      state.stats = action.payload;
    },
    setRecentActivities: (state, action: PayloadAction<DashboardState['recentActivities']>) => {
      state.recentActivities = action.payload;
    },
    addActivity: (state, action: PayloadAction<DashboardState['recentActivities'][0]>) => {
      state.recentActivities.unshift(action.payload);
      if (state.recentActivities.length > 10) {
        state.recentActivities.pop();
      }
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setStats, setRecentActivities, addActivity, toggleTheme, setLoading } = dashboardSlice.actions;
export default dashboardSlice.reducer;