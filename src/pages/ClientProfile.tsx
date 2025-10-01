import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Briefcase, 
  Calendar, 
  Clock, 
  DollarSign, 
  Loader2, 
  RefreshCw 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import { setLoading, fetchClients, updateUserAsync, User } from '@/store/slices/usersSlice';
import { toast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

// Form schema for client data
const clientFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  phoneNumber: z.string().optional(),
  company: z.string().optional(),
  title: z.string().optional(),
  businessLocation: z.string().optional(),
  status: z.enum(['active', 'pending', 'blocked', 'rejected'] as const),
  notes: z.string().optional(),
  revenue: z.number().optional(),
  subscription: z.object({
    plan: z.string().min(1, 'Plan is required'),
    status: z.enum(['active', 'cancelled', 'expired'] as const),
    expiresAt: z.string().min(1, 'Expiration date is required'),
    amount: z.number().min(0, 'Amount must be a positive number')
  }).optional()
});

type ClientFormValues = z.infer<typeof clientFormSchema>;

export default function ClientProfile() {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [client, setClient] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPlan, setIsChangingPlan] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Available subscription plans
  const subscriptionPlans = [
    { id: 'basic', name: 'Basic', price: 29, features: ['Feature 1', 'Feature 2'] },
    { id: 'pro', name: 'Pro', price: 99, features: ['All Basic features', 'Advanced Feature 1', 'Advanced Feature 2'] },
    { id: 'enterprise', name: 'Enterprise', price: 299, features: ['All Pro features', 'Priority Support', 'Custom Solutions'] },
    { id: 'custom', name: 'Custom', price: 0, features: ['Custom Features', 'Dedicated Support'] },
  ];

  // Initialize form with default values
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
      company: '',
      title: '',
      businessLocation: '',
      status: 'active',
      notes: '',
      revenue: 0,
      subscription: {
        plan: 'Basic',
        status: 'active',
        expiresAt: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
        amount: 0
      }
    },
  });

  // Reset form when client data changes
  useEffect(() => {
    if (client) {
      form.reset({
        name: client.name || '',
        email: client.email || '',
        phoneNumber: client.phoneNumber || '',
        company: client.company || '',
        title: client.title || '',
        businessLocation: client.businessLocation || '',
        status: client.status || 'active',
        notes: client.notes || '',
        revenue: client.revenue || 0,
        subscription: client.subscription ? {
          plan: client.subscription.plan || 'Basic',
          status: client.subscription.status || 'active',
          expiresAt: client.subscription.expiresAt ? new Date(client.subscription.expiresAt).toISOString().split('T')[0] : '',
          amount: client.subscription.amount || 0
        } : undefined
      });
    }
  }, [client, form]);
  
  // Get client data from Redux store
  const { clients } = useAppSelector(state => ({
    clients: state.users.clients,
  }));

  // Handle form submission
  const handlePlanChange = async (planId: string) => {
    if (!client) return;
    
    try {
      setIsSaving(true);
      const selectedPlan = subscriptionPlans.find(p => p.id === planId);
      if (!selectedPlan) return;
      
      const updatedClient: User = {
        ...client,
        subscription: {
          plan: selectedPlan.name,
          status: 'active',
          expiresAt: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
          amount: selectedPlan.price
        },
        lastActive: new Date().toISOString(),
      };
      
      await dispatch(updateUserAsync(updatedClient)).unwrap();
      
      toast({
        title: 'Success',
        description: `Plan changed to ${selectedPlan.name} successfully`,
      });
      
      setClient(updatedClient);
      setIsChangingPlan(false);
      setSelectedPlan('');
    } catch (error) {
      console.error('Error changing plan:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to change plan. Please try again.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const onSubmit = async (data: ClientFormValues) => {
    if (!client) return;
    
    try {
      setIsSaving(true);
      
      // Create a properly typed subscription object if it exists in the form data
      const subscription = data.subscription ? {
        plan: data.subscription.plan,
        status: data.subscription.status,
        expiresAt: data.subscription.expiresAt,
        amount: data.subscription.amount
      } : undefined;
      
      const updatedClient: User = {
        ...client,
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        company: data.company,
        title: data.title,
        businessLocation: data.businessLocation,
        status: data.status,
        notes: data.notes,
        revenue: data.revenue,
        subscription: subscription,
        lastActive: new Date().toISOString(),
      };
      
      await dispatch(updateUserAsync(updatedClient)).unwrap();
      
      toast({
        title: 'Success',
        description: 'Client updated successfully',
      });
      
      setClient(updatedClient);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating client:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update client. Please try again.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const loadClientData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // If no clients are loaded, fetch them
        if (clients.length === 0) {
          await dispatch(fetchClients()).unwrap();
        }
        
        // Find the client in the store
        const foundClient = clients.find(c => c.id === clientId);
        
        if (!foundClient && clients.length > 0) {
          setError('Client not found');
        } else if (foundClient) {
          setClient(foundClient);
        }
      } catch (err) {
        console.error('Error loading client data:', err);
        setError('Failed to load client data');
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load client data. Please try again.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadClientData();
  }, [clientId, dispatch, clients]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <h2 className="text-2xl font-bold mb-4 text-destructive">Error loading client data</h2>
        <p className="mb-4 text-muted-foreground">{error}</p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          <Button onClick={() => navigate("/dashboard/clients")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <h2 className="text-2xl font-bold mb-4">
          {error || 'Client not found'}
        </h2>
        <p className="mb-4 text-muted-foreground">
          The requested client could not be found or loaded.
        </p>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
            className="flex items-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          <Button 
            onClick={() => navigate('/dashboard/clients')} 
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Clients
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <h2 className="text-2xl font-bold mb-4">
          {error || 'Client not found'}
        </h2>
        <p className="mb-4 text-muted-foreground">
          The requested client could not be found or loaded.
        </p>
        <div className="flex space-x-4">
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
            className="flex items-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          <Button onClick={() => navigate("/dashboard/clients")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Clients
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/dashboard/clients")}
          className="flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Clients
        </Button>
        
        {!isEditing && (
          <Button 
            onClick={() => setIsEditing(true)}
            variant="outline"
            className="ml-auto"
          >
            Edit Profile
          </Button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Edit Client Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" {...form.register('name')} />
                  {form.formState.errors.name && (
                    <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" {...form.register('email')} />
                  {form.formState.errors.email && (
                    <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input id="phoneNumber" {...form.register('phoneNumber')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" {...form.register('company')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title</Label>
                  <Input id="title" {...form.register('title')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessLocation">Location</Label>
                  <Input id="businessLocation" {...form.register('businessLocation')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...form.register('status')}
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="blocked">Blocked</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="revenue">Revenue</Label>
                  <Input 
                    id="revenue" 
                    type="number" 
                    {...form.register('revenue', { valueAsNumber: true })} 
                  />
                </div>
                
                {/* Subscription Plan */}
                <div className="space-y-2">
                  <Label htmlFor="subscription.plan">Subscription Plan</Label>
                  <select
                    id="subscription.plan"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...form.register('subscription.plan')}
                  >
                    <option value="Basic">Basic</option>
                    <option value="Pro">Pro</option>
                    <option value="Enterprise">Enterprise</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>
                
                {/* Subscription Status */}
                <div className="space-y-2">
                  <Label htmlFor="subscription.status">Subscription Status</Label>
                  <select
                    id="subscription.status"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...form.register('subscription.status')}
                  >
                    <option value="active">Active</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>
                
                {/* Subscription Expiry */}
                <div className="space-y-2">
                  <Label htmlFor="subscription.expiresAt">Expiry Date</Label>
                  <Input 
                    id="subscription.expiresAt" 
                    type="date" 
                    {...form.register('subscription.expiresAt')} 
                  />
                </div>
                
                {/* Subscription Amount */}
                <div className="space-y-2">
                  <Label htmlFor="subscription.amount">Amount ($)</Label>
                  <Input 
                    id="subscription.amount" 
                    type="number" 
                    step="0.01"
                    {...form.register('subscription.amount', { valueAsNumber: true })} 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea 
                  id="notes" 
                  {...form.register('notes')} 
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="flex justify-end space-x-4 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {/* Left Column - Profile Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-2xl font-bold">
                    {client.name?.charAt(0) || 'C'}
                  </div>
                  <div>
                    <CardTitle className="text-xl">{client.name}</CardTitle>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <Badge variant={client.status === 'active' ? 'default' : 'secondary'} className="mr-2">
                      {client.status || 'N/A'}
                    </Badge>
                    {client.isPremium && (
                      <Badge variant="secondary" className="ml-1 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                        Premium
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Contact Information</h3>
                <div className="space-y-1 text-sm">
                  {client.email && (
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                      <a href={`mailto:${client.email}`} className="hover:underline">
                        {client.email}
                      </a>
                    </div>
                  )}
                  {client.phoneNumber && (
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                      <a href={`tel:${client.phoneNumber}`} className="hover:underline">
                        {client.phoneNumber}
                      </a>
                    </div>
                  )}
                  {client.businessLocation && (
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span>{client.businessLocation}</span>
                    </div>
                  )}
                  {client.websites && client.websites.length > 0 && (
                    <div className="flex items-center">
                      <Globe className="w-4 h-4 mr-2 text-muted-foreground" />
                      <a 
                        href={client.websites[0].startsWith('http') ? client.websites[0] : `https://${client.websites[0]}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {client.websites[0]}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Company Information</h3>
                <div className="space-y-1 text-sm">
                  {client.company && (
                    <div className="flex items-center">
                      <Briefcase className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span>{client.company}</span>
                    </div>
                  )}
                  {client.title && (
                    <p className="text-muted-foreground">{client.title}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {client.notes && (
            <Card>
              <CardHeader className="pb-2">
                <h3 className="text-sm font-medium">Notes</h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{client.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
        {/* Right Column - Stats and Activity */}
        <div className="md:col-span-2 space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">Subscription</h3>
                  <Dialog open={isChangingPlan} onOpenChange={setIsChangingPlan}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedPlan('')}>
                        Change Plan
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Change Subscription Plan</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label>Select a Plan</Label>
                          <Select 
                            value={selectedPlan} 
                            onValueChange={(value) => setSelectedPlan(value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a plan" />
                            </SelectTrigger>
                            <SelectContent>
                              {subscriptionPlans.map((plan) => (
                                <SelectItem key={plan.id} value={plan.id}>
                                  {plan.name} (${plan.price}/month)
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {selectedPlan && (
                          <div className="space-y-2 p-4 border rounded-lg">
                            <h4 className="font-medium">
                              {subscriptionPlans.find(p => p.id === selectedPlan)?.name} Plan
                            </h4>
                            <p className="text-2xl font-bold">
                              ${subscriptionPlans.find(p => p.id === selectedPlan)?.price}
                              <span className="text-sm font-normal text-muted-foreground">/month</span>
                            </p>
                            <Separator className="my-2" />
                            <ul className="space-y-1 text-sm">
                              {subscriptionPlans.find(p => p.id === selectedPlan)?.features.map((feature, i) => (
                                <li key={i} className="flex items-center">
                                  <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  {feature}
                                </li>
                              ))}
                            </ul>
                            <div className="pt-4">
                              <Button 
                                className="w-full" 
                                onClick={() => handlePlanChange(selectedPlan)}
                                disabled={isSaving}
                              >
                                {isSaving ? 'Updating...' : 'Confirm Plan Change'}
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {client.subscription ? (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Plan</span>
                      <div className="flex items-center">
                        <Badge variant="outline" className="mr-2">
                          {client.subscription.plan}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <Badge variant={client.subscription.status === 'active' ? 'default' : 'secondary'}>
                        {client.subscription.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Expires</span>
                      <span className="text-sm">{format(new Date(client.subscription.expiresAt), 'MMM d, yyyy')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Amount</span>
                      <span className="font-medium">${client.subscription.amount}/month</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground mb-3">No active subscription</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setIsChangingPlan(true)}
                    >
                      Subscribe to a Plan
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <h3 className="text-sm font-medium">Account Info</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Member Since</span>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1 text-muted-foreground" />
                      <span>{format(new Date(client.createdAt), 'MMM d, yyyy')}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Last Active</span>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1 text-muted-foreground" />
                      <span>{format(new Date(client.lastActive), 'MMM d, yyyy')}</span>
                    </div>
                  </div>
                  {client.revenue !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Revenue</span>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1 text-muted-foreground" />
                        <span>${client.revenue.toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Add more sections here for recent activity, projects, etc. */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">No recent activity to show.</p>
              {/* You can map through recent activities here */}
            </CardContent>
          </Card>
        </div>
      </div>
      )}
    </div>
  );
}
