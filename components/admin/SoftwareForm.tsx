// components/admin/SoftwareForm.tsx
'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createSoftware, updateSoftware, type SoftwareInput } from '@/actions/adminSoftware';
import { toast } from 'sonner';

// ✅ Schema matches API input type exactly (no 'order' field)
const softwareSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(200),
  category: z.string().min(2, 'Category is required'),
  description: z.string().max(1000).optional().or(z.literal('')),
  websiteUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  isPaid: z.boolean(),
  isFavorite: z.boolean(),
});

// ✅ FormData type matches schema
type FormData = z.infer<typeof softwareSchema>;

// ✅ Database model interface (includes 'order', can have nulls)
interface Software {
  id: string;
  name: string;
  category: string;
  description?: string | null;
  websiteUrl?: string | null;
  isPaid: boolean;
  isFavorite: boolean;
  order: number;
}

interface SoftwareFormProps {
  software?: Software | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const categories = [
  'IDE',
  'Browser',
  'Terminal',
  'Design',
  'Productivity',
  'Security',
  'Other',
];

export function SoftwareForm({ software, onSuccess, onCancel }: SoftwareFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(softwareSchema),
    defaultValues: {
      name: software?.name ?? '',
      category: software?.category ?? '',
      description: software?.description ?? '',
      websiteUrl: software?.websiteUrl ?? '',
      isPaid: software?.isPaid === true,
      isFavorite: software?.isFavorite === true,
    },
  });

  // ✅ FIXED: Parameter is 'data' of type 'FormData'
  const onSubmit = async (data: FormData) => {
    try {
      // ✅ Transform data for API (SoftwareInput type)
      const apiData: SoftwareInput = {
        ...data,
        isPaid: data.isPaid === true,
        isFavorite: data.isFavorite === true,
        order: software?.order ?? 0
      };

      let result;
      if (software) {
        result = await updateSoftware(software.id, apiData);
      } else {
        result = await createSoftware(apiData);
      }

      if (result?.success) {
        toast.success(software ? 'Software updated!' : 'Software created!');
        reset();
        onSuccess?.();
      } else {
        toast.error(result?.error || 'Failed to save');
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Name Field */}
      <div className="space-y-2">
        <Label className="text-gray-300">Name *</Label>
        <Input
          {...register('name')}
          className="bg-white/5 border-white/10 text-white"
          placeholder="VS Code"
        />
        {errors.name && <p className="text-sm text-red-400">{errors.name.message}</p>}
      </div>

      {/* Category Field */}
      <div className="space-y-2">
        <Label className="text-gray-300">Category *</Label>
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.category && <p className="text-sm text-red-400">{errors.category.message}</p>}
      </div>

      {/* Description Field */}
      <div className="space-y-2">
        <Label className="text-gray-300">Description</Label>
        <Textarea
          {...register('description')}
          rows={3}
          className="bg-white/5 border-white/10 text-white resize-none"
          placeholder="Brief description of this software..."
        />
        {errors.description && <p className="text-sm text-red-400">{errors.description.message}</p>}
      </div>

      {/* Website URL Field */}
      <div className="space-y-2">
        <Label className="text-gray-300">Website URL</Label>
        <Input
          {...register('websiteUrl')}
          className="bg-white/5 border-white/10 text-white"
          placeholder="https://example.com"
        />
        {errors.websiteUrl && <p className="text-sm text-red-400">{errors.websiteUrl.message}</p>}
      </div>

      {/* Switch Fields */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Controller
            name="isPaid"
            control={control}
            render={({ field }) => (
              <Switch
                id="isPaid"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <Label htmlFor="isPaid" className="text-gray-300 cursor-pointer">
            Paid software
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Controller
            name="isFavorite"
            control={control}
            render={({ field }) => (
              <Switch
                id="isFavorite"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <Label htmlFor="isFavorite" className="text-gray-300 cursor-pointer">
            Mark as favorite
          </Label>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? 'Saving...' : software ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
}