import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { setUsers, updateUser } from '@/store/slices/usersSlice';
import type { User } from '@/store/slices/usersSlice';

export const useClientsData = () => {
  const dispatch = useAppDispatch();
  const { users, clients } = useAppSelector(state => state.users);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'revenue' | 'date'>('name');

  useEffect(() => {
    const timer = setTimeout(() => {
      const mockClients: User[] = [
        {
          id: '2',
          email: 'mike@bistro.com',
          name: 'Mike Johnson',
          firstName: 'Mike',
          lastName: 'Johnson',
          phoneNumber: '+1987654321',
          businessLocation: 'Los Angeles, CA',
          status: 'active',
          subscription: {
            plan: 'Premium',
            status: 'active',
            expiresAt: '2024-12-15T00:00:00Z',
            amount: 99
          },
          createdAt: '2023-11-10T09:15:00Z',
          lastActive: '2024-01-20T16:45:00Z',
          isClient: true
        },
        {
          id: '5',
          email: 'alex@italianbistro.com',
          name: 'Alex Rodriguez',
          firstName: 'Alex',
          lastName: 'Rodriguez',
          phoneNumber: '+1555888999',
          businessLocation: 'Miami, FL',
          status: 'active',
          subscription: {
            plan: 'Enterprise',
            status: 'active',
            expiresAt: '2024-11-20T00:00:00Z',
            amount: 199
          },
          createdAt: '2023-10-05T14:20:00Z',
          lastActive: '2024-01-19T11:30:00Z',
          isClient: true
        }
      ];
      const existingIds = new Set(users.map(u => u.id));
      const newClients = mockClients.filter(c => !existingIds.has(c.id));
      if (newClients.length > 0) {
        dispatch(setUsers([...users, ...newClients]));
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [dispatch, users]);

  const filteredClients = useMemo(() => {
    // Ensure we only work with clients (isClient: true)
    const clientList = clients.filter(c => c.isClient === true);
    
    return clientList
      .filter(c => {
        const searchLower = searchTerm.toLowerCase();
        return (
          c.name.toLowerCase().includes(searchLower) || 
          c.email.toLowerCase().includes(searchLower) ||
          (c.phoneNumber && c.phoneNumber.includes(searchTerm)) ||
          (c.businessLocation && c.businessLocation.toLowerCase().includes(searchLower))
        );
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return a.name.localeCompare(b.name);
          case 'revenue':
            return (b.subscription?.amount || 0) - (a.subscription?.amount || 0);
          case 'date':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          default:
            return 0;
        }
      });
  }, [clients, searchTerm, sortBy]);

  const totalRevenue = useMemo(() => 
    clients
      .filter(c => c.isClient === true)
      .reduce((sum, c) => sum + (c.subscription?.amount || 0), 0), 
    [clients]
  );

  const avgClientValue = useMemo(() => {
    const activeClients = clients.filter(c => c.isClient === true);
    return activeClients.length > 0 ? totalRevenue / activeClients.length : 0;
  }, [totalRevenue, clients]);
  const handleClientUpdate = (updated: User) => dispatch(updateUser(updated));

  return { clients, searchTerm, setSearchTerm, sortBy, setSortBy, filteredClients, totalRevenue, avgClientValue, handleClientUpdate };
};

export default useClientsData;

