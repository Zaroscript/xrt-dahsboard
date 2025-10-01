import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: 'monthly' | 'yearly';
  features: string[];
  isCustom: boolean;
  discount?: {
    percentage: number;
    validUntil: string;
  };
  badge?: {
    text: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'gold';
  };
  isActive: boolean;
  createdAt: string;
}

export interface CustomPlanRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  requirements: string;
  budget: number;
  timeline: string;
  status: 'pending' | 'approved' | 'rejected';
  response?: string;
  createdAt: string;
}

interface PlansState {
  plans: Plan[];
  customRequests: CustomPlanRequest[];
  selectedPlan: Plan | null;
  loading: boolean;
}

const initialState: PlansState = {
  plans: [],
  customRequests: [],
  selectedPlan: null,
  loading: false,
};

const plansSlice = createSlice({
  name: 'plans',
  initialState,
  reducers: {
    setPlans: (state, action: PayloadAction<Plan[]>) => {
      state.plans = action.payload;
    },
    addPlan: (state, action: PayloadAction<Plan>) => {
      state.plans.push(action.payload);
    },
    updatePlan: (state, action: PayloadAction<Plan>) => {
      const index = state.plans.findIndex(plan => plan.id === action.payload.id);
      if (index !== -1) {
        state.plans[index] = action.payload;
      }
    },
    setCustomRequests: (state, action: PayloadAction<CustomPlanRequest[]>) => {
      state.customRequests = action.payload;
    },
    addCustomRequest: (state, action: PayloadAction<CustomPlanRequest>) => {
      state.customRequests.push(action.payload);
    },
    updateCustomRequest: (state, action: PayloadAction<{id: string, status: 'approved' | 'rejected', response?: string}>) => {
      const { id, status, response } = action.payload;
      const index = state.customRequests.findIndex(req => req.id === id);
      if (index !== -1) {
        state.customRequests[index] = {
          ...state.customRequests[index],
          status,
          response: response || state.customRequests[index].response
        };
      }
    },
    setSelectedPlan: (state, action: PayloadAction<Plan | null>) => {
      state.selectedPlan = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    deletePlan: (state, action: PayloadAction<string>) => {
      state.plans = state.plans.filter(plan => plan.id !== action.payload);
    },
  },
});

export const { 
  setPlans, 
  addPlan, 
  updatePlan, 
  deletePlan,
  setCustomRequests, 
  addCustomRequest, 
  updateCustomRequest, 
  setSelectedPlan,
  setLoading, 
} = plansSlice.actions;
export default plansSlice.reducer;