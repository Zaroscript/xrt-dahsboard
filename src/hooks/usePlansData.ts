import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { setPlans, setCustomRequests, updateCustomRequest as updateCustomRequestAction } from '@/store/slices/plansSlice';
import type { Plan, CustomPlanRequest } from '@/store/slices/plansSlice';

// Mock data outside the component to persist between renders
const mockPlans: Plan[] = [
  { id: '1', name: 'Basic', description: 'Perfect for small recipe blogs and personal use', price: 49, duration: 'monthly', features: ['Recipe management system','Basic website template','Up to 100 recipes','Email support','Mobile responsive design'], isCustom: false, isActive: true, createdAt: '2024-01-15T10:30:00Z' },
  { id: '2', name: 'Premium', description: 'Most popular for growing recipe sharing businesses', price: 99, duration: 'monthly', features: ['Advanced recipe management','Premium website templates','Unlimited recipes','User authentication system','Comment & rating system','SEO optimization','Priority support','Custom branding'], isCustom: false, discount: { percentage: 15, validUntil: '2024-03-31T23:59:59Z' }, isActive: true, createdAt: '2024-01-15T10:30:00Z' },
  { id: '3', name: 'Enterprise', description: 'For large-scale recipe sharing platforms', price: 199, duration: 'monthly', features: ['Everything in Premium','Multi-user management','Advanced analytics','API access','White-label solution','Custom integrations','Dedicated support manager','On-premise hosting option'], isCustom: false, isActive: true, createdAt: '2024-01-15T10:30:00Z' },
];

const mockCustomRequests: CustomPlanRequest[] = [
  { id: '1', userId: '1', userName: 'Restaurant Chain LLC', userEmail: 'contact@restaurantchain.com', requirements: 'Need a multi-location recipe management system with inventory tracking and cost calculation features.', budget: 500, timeline: '3 months', status: 'pending', createdAt: '2024-01-18T14:30:00Z' },
  { id: '2', userId: '2', userName: 'Culinary School', userEmail: 'admin@culinaryschool.edu', requirements: 'Educational platform for students to share and learn recipes with instructor review system.', budget: 300, timeline: '2 months', status: 'approved', response: 'We can definitely create this educational platform. Our team will start working on the prototype next week.', createdAt: '2024-01-16T09:15:00Z' },
];

export const usePlansData = () => {
  const dispatch = useAppDispatch();
  const { plans, customRequests, loading } = useAppSelector(state => state.plans);

  // Initialize data on first render
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setPlans(mockPlans));
      dispatch(setCustomRequests(mockCustomRequests));
    }, 500);
    return () => clearTimeout(timer);
  }, [dispatch]);

  // Memoize the update function to prevent unnecessary re-renders
  const updateCustomRequest = useMemo(
    () => (request: { id: string; status: 'approved' | 'rejected'; response?: string }) => {
      return new Promise<void>((resolve) => {
        // In a real app, you would make an API call here
        setTimeout(() => {
          dispatch(updateCustomRequestAction(request));
          resolve();
        }, 1000);
      });
    },
    [dispatch]
  );

  return { 
    plans, 
    customRequests, 
    loading, 
    updateCustomRequest 
  };
};

export default usePlansData;

