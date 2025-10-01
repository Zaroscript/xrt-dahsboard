import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, X } from 'lucide-react';
import type { Plan } from '@/store/slices/plansSlice';

const planFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  price: z.coerce.number().min(0, { message: 'Price must be a positive number.' }),
  duration: z.enum(['monthly', 'yearly']),
  features: z.array(z.string().min(1, { message: 'Feature cannot be empty.' })).min(1, { message: 'At least one feature is required.' }),
  isCustom: z.boolean().optional(),
  discount: z.object({
    percentage: z.coerce.number().min(0).max(100).optional(),
    validUntil: z.string().optional(),
  }).optional(),
  badge: z.object({
    text: z.string().min(1, 'Badge text is required'),
    variant: z.enum(['default', 'secondary', 'destructive', 'outline', 'success', 'warning', 'gold']).optional(),
  }).optional(),
  isActive: z.boolean().optional(),
});

type PlanFormValues = z.infer<typeof planFormSchema>;

interface PlanFormProps {
  plan?: Plan;
  onSubmit: (data: PlanFormValues) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const PlanForm = ({ plan, onSubmit, onCancel, isLoading = false }: PlanFormProps) => {
  const [features, setFeatures] = useState<string[]>(plan?.features || ['']);
  const [featureInput, setFeatureInput] = useState('');
  const [showBadgeFields, setShowBadgeFields] = useState(!!plan?.badge);

  const defaultValues: Partial<PlanFormValues> = {
    name: plan?.name || '',
    description: plan?.description || '',
    price: plan?.price || 0,
    duration: plan?.duration || 'monthly',
    features: plan?.features || [''],
    isCustom: plan?.isCustom || false,
    discount: plan?.discount || undefined,
    badge: plan?.badge || { text: '', variant: 'default' },
    isActive: plan?.isActive ?? true,
  };

  const form = useForm<PlanFormValues>({
    resolver: zodResolver(planFormSchema),
    defaultValues,
  });

  const { register, handleSubmit, formState: { errors }, setValue, watch } = form;

  useEffect(() => {
    setValue('features', features.filter(f => f.trim() !== ''));
  }, [features, setValue]);

  const addFeature = () => {
    if (featureInput.trim()) {
      setFeatures([...features, featureInput.trim()]);
      setFeatureInput('');
    }
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleFormSubmit = async (data: PlanFormValues) => {
    await onSubmit({
      ...data,
      features: features.filter(f => f.trim() !== ''),
    });
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{plan ? 'Edit Plan' : 'Create New Plan'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Plan Name *</Label>
              <div className="space-y-1">
                <Input
                  id="name"
                  placeholder="e.g., Premium"
                  {...register('name')}
                />
                {errors.name?.message && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <div className="space-y-1">
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register('price')}
                />
                {errors.price?.message && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.price.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Billing Cycle *</Label>
              <Select
                onValueChange={(value: 'monthly' | 'yearly') => setValue('duration', value)}
                defaultValue={watch('duration')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select billing cycle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
              {errors.duration && (
                <p className="text-sm font-medium text-destructive">
                  {errors.duration.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-primary"
                    checked={watch('isActive')}
                    onChange={(e) => setValue('isActive', e.target.checked)}
                  />
                  <span className="text-sm">Active</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-primary"
                    checked={watch('isCustom')}
                    onChange={(e) => setValue('isCustom', e.target.checked)}
                  />
                  <span className="text-sm">Custom Plan</span>
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe the plan features and benefits..."
              className="min-h-[100px]"
              {...register('description')}
            />
            {errors.description && (
              <p className="text-sm font-medium text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Discount Section */}
          <div className="space-y-4 p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Discount</h3>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  const currentDiscount = watch('discount');
                  setValue('discount', currentDiscount ? undefined : { percentage: 0, validUntil: '' });
                }}
              >
                {watch('discount') ? 'Remove Discount' : 'Add Discount'}
              </Button>
            </div>
            
            {watch('discount') && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="discount.percentage">Discount Percentage</Label>
                  <div className="relative">
                    <Input
                      id="discount.percentage"
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      placeholder="0"
                      {...register('discount.percentage', { valueAsNumber: true })}
                      className="pr-12"
                    />
                    <span className="absolute right-3 top-2.5 text-sm text-muted-foreground">%</span>
                  </div>
                  {errors.discount?.percentage?.message && (
                    <p className="text-sm font-medium text-destructive">
                      {errors.discount.percentage.message}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="discount.validUntil">Valid Until</Label>
                  <Input
                    id="discount.validUntil"
                    type="date"
                    {...register('discount.validUntil')}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  {errors.discount?.validUntil?.message && (
                    <p className="text-sm font-medium text-destructive">
                      {errors.discount.validUntil.message}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Badge Section */}
          <div className="space-y-4 p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Badge</h3>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowBadgeFields(!showBadgeFields)}
              >
                {showBadgeFields ? 'Remove Badge' : 'Add Badge'}
              </Button>
            </div>
            
            {showBadgeFields && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="badge.text">Badge Text *</Label>
                  <Input
                    id="badge.text"
                    placeholder="e.g., Popular, Limited, New"
                    {...register('badge.text')}
                  />
                  {errors.badge?.text?.message && (
                    <p className="text-sm font-medium text-destructive">
                      {errors.badge.text.message}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="badge.variant">Badge Style</Label>
                  <select
                    id="badge.variant"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...register('badge.variant')}
                  >
                    <option value="default">Default</option>
                    <option value="secondary">Secondary</option>
                    <option value="destructive">Destructive</option>
                    <option value="outline">Outline</option>
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
                    <option value="gold">Gold</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Features *</Label>
            <div className="space-y-2">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={feature}
                    onChange={(e) => {
                      const newFeatures = [...features];
                      newFeatures[index] = e.target.value;
                      setFeatures(newFeatures);
                    }}
                    placeholder="Enter a feature"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFeature(index)}
                    className="text-destructive hover:text-destructive/80"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="flex space-x-2">
                <Input
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addFeature();
                    }
                  }}
                  placeholder="Add a feature and press Enter"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addFeature}
                >
                  Add
                </Button>
              </div>
              {errors.features && (
                <p className="text-sm font-medium text-destructive">
                  {errors.features.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base">Discount (Optional)</Label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
              <div className="space-y-2">
                <Label htmlFor="discount-percentage">Discount Percentage</Label>
                <div className="space-y-1">
                <Input
                  id="discount-percentage"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="0"
                  {...register('discount.percentage')}
                />
                {errors.discount?.percentage?.message && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.discount.percentage.message}
                  </p>
                )}
              </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="discount-valid-until">Valid Until</Label>
                <div className="space-y-1">
                <Input
                  id="discount-valid-until"
                  type="date"
                  {...register('discount.validUntil')}
                />
                {errors.discount?.validUntil?.message && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.discount.validUntil.message}
                  </p>
                )}
              </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {plan ? 'Updating...' : 'Creating...'}
                </>
              ) : plan ? (
                'Update Plan'
              ) : (
                'Create Plan'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PlanForm;
