// components/admin/HardwareTable.tsx
'use client';

import { useState } from 'react';
import { Edit, Trash2, Plus, Minus, Monitor, Keyboard, Mouse, Headphones, Cpu } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { HardwareForm } from './HardwareForm';
import { deleteHardware, reorderHardware } from '@/actions/adminHardware';
import { toast } from 'sonner';
import Image from 'next/image';

interface Hardware {
  id: string;
  name: string;
  category: string;
  description?: string | null;
  imageUrl?: string | null;
  purchaseUrl?: string | null;
  price?: string | null;
  isFavorite: boolean;
  order: number;
}

interface HardwareTableProps {
  hardwareByCategory: Record<string, Hardware[]>;
}

const categoryIcons: Record<string, React.ReactNode> = {
  Computer: <Cpu className="w-4 h-4" />,
  Display: <Monitor className="w-4 h-4" />,
  Keyboard: <Keyboard className="w-4 h-4" />,
  Mouse: <Mouse className="w-4 h-4" />,
  Audio: <Headphones className="w-4 h-4" />,
  Other: <Cpu className="w-4 h-4" />,
};

export function HardwareTable({ hardwareByCategory }: HardwareTableProps) {
  const [editingItem, setEditingItem] = useState<Hardware | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleReorder = async (id: string, newOrder: number) => {
    try {
      await reorderHardware(id, newOrder);
      toast.success('Order updated');
    } catch {
      toast.error('Failed to update order');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteHardware(id);
      toast.success('Hardware deleted');
      setDeleteDialog(null);
    } catch {
      toast.error('Failed to delete hardware');
    }
  };

  return (
    <>
      <div className="space-y-6">
        {Object.entries(hardwareByCategory).map(([category, items]) => (
          <div key={category} className="rounded-lg border border-white/10 overflow-hidden">
            <div className="bg-white/5 px-4 py-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                {categoryIcons[category] || categoryIcons.Other}
                <h3 className="text-lg font-semibold text-white">{category}</h3>
                <Badge variant="secondary" className="text-xs">{items.length}</Badge>
              </div>
            </div>
            
            <div className="divide-y divide-white/10">
              {items.map((hardware, index) => (
                <div
                  key={hardware.id}
                  className="p-4 hover:bg-white/5 transition-colors flex items-center gap-4"
                >
                  {/* Image */}
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-white/5">
                    {hardware.imageUrl ? (
                      <Image
                        src={hardware.imageUrl}
                        alt={hardware.name}
                        fill
                        className="object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        <Cpu className="w-6 h-6" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-white truncate">{hardware.name}</p>
                      {hardware.isFavorite && (
                        <span className="text-amber-400" title="Favorite">★</span>
                      )}
                    </div>
                    {hardware.description && (
                      <p className="text-sm text-gray-400 truncate">{hardware.description}</p>
                    )}
                    {hardware.price && (
                      <p className="text-xs text-gray-500">{hardware.price}</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleReorder(hardware.id, hardware.order - 1)}
                      disabled={index === 0}
                      title="Move up"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleReorder(hardware.id, hardware.order + 1)}
                      disabled={index === items.length - 1}
                      title="Move down"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setEditingItem(hardware)}
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-400 hover:text-red-300"
                      onClick={() => setDeleteDialog(hardware.id)}
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent className="bg-[#0a0a0a] border-white/10 max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Hardware</DialogTitle>
            <DialogDescription className="text-gray-400">
              Update hardware details
            </DialogDescription>
          </DialogHeader>
          {editingItem && (
            <HardwareForm
              hardware={editingItem}
              onSuccess={() => {
                setEditingItem(null);
                toast.success('Hardware updated');
              }}
              onCancel={() => setEditingItem(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <DialogContent className="bg-[#0a0a0a] border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">Delete Hardware</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to delete this item? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => deleteDialog && handleDelete(deleteDialog)}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}