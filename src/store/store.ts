import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authSlice from './slices/authSlice';
import dashboardSlice from './slices/dashboardSlice';
import usersSlice from './slices/usersSlice';
import plansSlice from './slices/plansSlice';
import supportSlice from './slices/supportSlice';
import portfolioSlice from './slices/portfolioSlice';
import notificationsSlice from './slices/notificationsSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    dashboard: dashboardSlice,
    users: usersSlice,
    plans: plansSlice,
    support: supportSlice,
    portfolio: portfolioSlice,
    notifications: notificationsSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;