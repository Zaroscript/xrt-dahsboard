import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

export type UserStatus = 'pending' | 'active' | 'blocked' | 'rejected';

export interface User {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  phoneNumber?: string;
  company?: string;
  title?: string;
  status?: UserStatus;
  revenue?: number;
  notes?: string;
  avatar?: string;
  joinDate?: string;
  businessLocation?: string;
  websites?: string[];
  role?: 'admin' | 'moderator' | 'user';
  subscription?: {
    plan: string;
    status: 'active' | 'cancelled' | 'expired';
    expiresAt: string;
    amount: number;
  };
  createdAt: string;
  lastActive: string;
  isClient: boolean;
  isPremium?: boolean;
  rejectionReason?: string;
}

interface UsersState {
  users: User[];
  clients: User[];
  prospects: User[];
  selectedUser: User | null;
  loading: boolean;
  filter: 'all' | UserStatus;
  error: string | null;
}

// Mock data for demonstration
const mockClients: User[] = [
  {
    id: '1',
    email: 'john@example.com',
    name: 'John Doe',
    firstName: 'John',
    lastName: 'Doe',
    phoneNumber: '+1234567890',
    businessLocation: 'New York, USA',
    status: 'active',
    subscription: {
      plan: 'Pro',
      status: 'active',
      expiresAt: '2024-12-31T00:00:00Z',
      amount: 99
    },
    createdAt: '2023-01-01T00:00:00Z',
    lastActive: new Date().toISOString(),
    isClient: true,
    isPremium: true
  },
  {
    id: '2',
    email: 'jane@example.com',
    name: 'Jane Smith',
    firstName: 'Jane',
    lastName: 'Smith',
    phoneNumber: '+1987654321',
    businessLocation: 'San Francisco, CA',
    status: 'active',
    subscription: {
      plan: 'Enterprise',
      status: 'active',
      expiresAt: '2024-11-30T00:00:00Z',
      amount: 199
    },
    createdAt: '2023-02-15T00:00:00Z',
    lastActive: new Date().toISOString(),
    isClient: true,
    isPremium: true
  },
  {
    id: '096d41f1-9e4e-49cd-85f2-6ae62e63cc40',
    email: 'alex@techcorp.com',
    name: 'Alex Thompson',
    firstName: 'Alex',
    lastName: 'Thompson',
    phoneNumber: '+1555123456',
    businessLocation: 'San Francisco, CA',
    status: 'active',
    subscription: {
      plan: 'Enterprise',
      status: 'active',
      expiresAt: '2024-12-31T00:00:00Z',
      amount: 299
    },
    createdAt: '2023-06-15T00:00:00Z',
    lastActive: new Date().toISOString(),
    isClient: true,
    isPremium: true
  }
];

// Async thunk for fetching clients
export const fetchClients = createAsyncThunk(
  'users/fetchClients',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockClients;
    } catch (error) {
      return rejectWithValue('Failed to fetch clients');
    }
  }
);

// Async thunk for updating a user
export const updateUserAsync = createAsyncThunk(
  'users/updateUser',
  async (user: User, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return user;
    } catch (error) {
      return rejectWithValue('Failed to update user');
    }
  }
);

const initialState: UsersState = {
  users: [],
  clients: [],
  prospects: [],
  selectedUser: null,
  loading: false,
  filter: 'all',
  error: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    },
    addUser: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload);
      if (action.payload.isClient) {
        state.clients.push(action.payload);
      } else {
        state.prospects.push(action.payload);
      }
    },
    addClient: (state, action: PayloadAction<Omit<User, 'id' | 'isClient' | 'createdAt' | 'lastActive'>>) => {
      const newClient: User = {
        ...action.payload,
        id: uuidv4(),
        isClient: true,
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
      };
      state.clients.push(newClient);
      state.users.push(newClient);
    },
    updateUser: (state, action: PayloadAction<User>) => {
      const index = state.users.findIndex(user => user.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
      const clientIndex = state.clients.findIndex(client => client.id === action.payload.id);
      if (clientIndex !== -1) {
        state.clients[clientIndex] = action.payload;
      }
    },
    setSelectedUser: (state, action: PayloadAction<User | null>) => {
      state.selectedUser = action.payload;
    },
    setFilter: (state, action: PayloadAction<UsersState['filter']>) => {
      state.filter = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Clients
      .addCase(fetchClients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.loading = false;
        state.clients = action.payload;
        // Also update users array with clients
        state.users = [...state.users.filter(u => !u.isClient), ...action.payload];
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch clients';
      })
      
      // Update User
      .addCase(updateUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        const updatedUser = action.payload;
        
        // Update in users array
        const userIndex = state.users.findIndex(u => u.id === updatedUser.id);
        if (userIndex !== -1) {
          state.users[userIndex] = updatedUser;
        }
        
        // Update in clients array if it's a client
        if (updatedUser.isClient) {
          const clientIndex = state.clients.findIndex(c => c.id === updatedUser.id);
          if (clientIndex !== -1) {
            state.clients[clientIndex] = updatedUser;
          } else {
            state.clients.push(updatedUser);
          }
        }
        
        // Update selected user if it's the one being edited
        if (state.selectedUser?.id === updatedUser.id) {
          state.selectedUser = updatedUser;
        }
      })
      .addCase(updateUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update user';
      });
  },
});

export const {
  setUsers,
  addUser,
  addClient,
  updateUser,
  setSelectedUser,
  setFilter,
  setLoading
} = usersSlice.actions;

export default usersSlice.reducer;
