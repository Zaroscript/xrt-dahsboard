import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Notification {
  id: string;
  title: string;
  description: string;
  read: boolean;
  createdAt: string;
}

interface NotificationsState {
  notifications: Notification[];
}

const initialState: NotificationsState = {
  notifications: [
    {
      id: '1',
      title: 'New user registered',
      description: 'John Doe has registered on the platform.',
      read: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Subscription expiring soon',
      description: 'Your subscription will expire in 3 days.',
      read: false,
      createdAt: new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      title: 'New ticket raised',
      description: 'A new support ticket has been raised by a user.',
      read: true,
      createdAt: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'createdAt' | 'read'>>) => {
      const newNotification: Notification = {
        id: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        read: false,
        ...action.payload,
      };
      state.notifications.unshift(newNotification);
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach(n => n.read = true);
    },
  },
});

export const { addNotification, markAsRead, markAllAsRead } = notificationsSlice.actions;
export default notificationsSlice.reducer;
