'use client';

import { useForm, Controller } from 'react-hook-form'; // ✅ Import Controller
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
import { createHardware, updateHardware, type HardwareInput } from '@/actions/adminHardware'; // ✅ Import HardwareInput type
import { toast } from 'sonner';
import { UsesHardware } from '@/types/uses';

const hardwareSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(200),
  category: z.string().min(2, 'Category is required'),
  description: z.string().max(1000).optional().or(z.literal('')),
  imageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  purchaseUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  price: z.string().max(50).optional().or(z.literal('')),
  isFavorite: z.boolean(),
});

type FormData = z.infer<typeof hardwareSchema>;

interface HardwareFormProps {
  hardware?: UsesHardware | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const categories = [
  'Computer',
  'Display',
  'Keyboard',
  'Mouse',
  'Audio',
  'Peripherals',
  'Other',
];

export function HardwareForm({ hardware, onSuccess, onCancel }: HardwareFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(hardwareSchema),
    defaultValues: {
      name: hardware?.name ?? '',
      category: hardware?.category ?? '',
      description: hardware?.description ?? '',
      imageUrl: hardware?.imageUrl ?? '',
      purchaseUrl: hardware?.purchaseUrl ?? '',
      price: hardware?.price ?? '',
      isFavorite: hardware?.isFavorite === true,
    },
  });

  const onSubmit = async ( data: FormData) => {
    try {
      const apiData: HardwareInput = {
        ...data,
        isFavorite: data.isFavorite === true,
        
      };

      let result;
      if (hardware) {
        result = await updateHardware(hardware.id, apiData);
      } else {
        result = await createHardware(apiData);
      }

      if (result?.success) {
        toast.success(hardware ? 'Hardware updated!' : 'Hardware created!');
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
      <div className="space-y-2">
        <Label className="text-gray-300">Name *</Label>
        <Input
          {...register('name')}
          className="bg-white/5 border-white/10 text-white"
          placeholder="MacBook Pro 16"
        />
        {errors.name && <p className="text-sm text-red-400">{errors.name.message}</p>}
      </div>

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

      <div className="space-y-2">
        <Label className="text-gray-300">Description</Label>
        <Textarea
          {...register('description')}
          rows={3}
          className="bg-white/5 border-white/10 text-white resize-none"
          placeholder="Brief description..."
        />
        {errors.description && <p className="text-sm text-red-400">{errors.description.message}</p>}
      </div>

      <div className="space-y-2">
        <Label className="text-gray-300">Image URL</Label>
        <Input
          {...register('imageUrl')}
          className="bg-white/5 border-white/10 text-white"
          placeholder="https://..."
        />
        {errors.imageUrl && <p className="text-sm text-red-400">{errors.imageUrl.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-gray-300">Purchase URL</Label>
          <Input
            {...register('purchaseUrl')}
            className="bg-white/5 border-white/10 text-white"
            placeholder="https://..."
          />
          {errors.purchaseUrl && <p className="text-sm text-red-400">{errors.purchaseUrl.message}</p>}
        </div>
        <div className="space-y-2">
          <Label className="text-gray-300">Price</Label>
          <Input
            {...register('price')}
            className="bg-white/5 border-white/10 text-white"
            placeholder="$1,299"
          />
          {errors.price && <p className="text-sm text-red-400">{errors.price.message}</p>}
        </div>
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

      <div className="flex gap-2 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? 'Saving...' : hardware ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
}