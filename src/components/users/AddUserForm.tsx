import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { User, UserStatus } from '@/store/slices/usersSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useAppDispatch } from '@/store/store';
import { addUser } from '@/store/slices/usersSlice';
import { useToast } from '@/components/ui/use-toast';
import { X, Plus, Trash2, Globe } from 'lucide-react';

const formSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters').max(50),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').max(50),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  status: z.enum(['active', 'inactive', 'pending']).default('active'),
  hasOldWebsite: z.boolean().default(false),
  websites: z.array(z.object({
    url: z.string().url('Please enter a valid URL').or(z.literal('')),
  })).default([{ url: '' }]),
  businessLocation: z.string().min(2, 'Please enter a valid location').max(100),
  phoneNumber: z.string().regex(/^\+?[0-9\s-]+$/, 'Please enter a valid phone number'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

interface AddUserFormProps {
  onSuccess?: () => void;
  onCancel: () => void;
}

export const AddUserForm = ({ onSuccess, onCancel }: AddUserFormProps) => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      hasOldWebsite: false,
      websites: [{ url: '' }],
      businessLocation: '',
      phoneNumber: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'websites',
  });

  const hasOldWebsite = form.watch('hasOldWebsite');

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      
      // Filter out empty website URLs
      const websites = values.websites
        .map(website => website.url.trim())
        .filter(url => url !== '');

      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: `${values.firstName} ${values.lastName}`,
        email: values.email,
        status: values.status as UserStatus,
        isClient: true,
        role: 'user', // Add default role
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        firstName: values.firstName,
        lastName: values.lastName,
        phoneNumber: values.phoneNumber,
        businessLocation: values.businessLocation,
        websites: websites.length > 0 ? websites : [],
        // Add any other required fields from User type
      };

      dispatch(addUser(newUser));
      
      toast({
        title: 'User created',
        description: `${values.firstName} ${values.lastName} has been added successfully.`,
      });

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: 'Error',
        description: 'Failed to create user. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.stopPropagation()}
    >
      <motion.div 
        className="bg-card rounded-lg shadow-lg w-full max-w-md relative"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-foreground">Add New User</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onCancel}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password *</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password *</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="hasOldWebsite"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Has Existing Website?</FormLabel>
                        <FormDescription>
                          Does this user have an existing website that needs to be migrated?
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {hasOldWebsite && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <FormLabel>Website URLs</FormLabel>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => append({ url: '' })}
                        className="gap-2"
                      >
                        <Plus className="h-4 w-4" /> Add URL
                      </Button>
                    </div>
                    
                    {fields.map((field, index) => (
                      <div key={field.id} className="flex items-center space-x-2">
                        <FormField
                          control={form.control}
                          name={`websites.${index}.url`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <div className="relative">
                                  <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                  <Input
                                    placeholder="https://example.com"
                                    className="pl-10"
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {index > 0 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => remove(index)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="businessLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Location *</FormLabel>
                      <FormControl>
                        <Input placeholder="City, Country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number *</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>


              <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Adding...' : 'Add User'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AddUserForm;
