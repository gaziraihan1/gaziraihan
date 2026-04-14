// components/admin/SoftwareTable.tsx
'use client';

import { useState } from 'react';
import { Edit, Trash2, Plus, Minus, Code, Globe, Terminal, Palette, FileText } from 'lucide-react';
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
import { SoftwareForm } from './SoftwareForm';
import { deleteSoftware, reorderSoftware } from '@/actions/adminSoftware';
import { toast } from 'sonner';
import { UsesSoftware } from '@/types/uses';


interface SoftwareTableProps {
  softwareByCategory: Record<string, UsesSoftware[]>;
}

const categoryIcons: Record<string, React.ReactNode> = {
  IDE: <Code className="w-4 h-4" />,
  Browser: <Globe className="w-4 h-4" />,
  Terminal: <Terminal className="w-4 h-4" />,
  Design: <Palette className="w-4 h-4" />,
  Productivity: <FileText className="w-4 h-4" />,
  Other: <Code className="w-4 h-4" />,
};

export function SoftwareTable({ softwareByCategory }: SoftwareTableProps) {
  const [editingItem, setEditingItem] = useState<UsesSoftware | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null);

  const handleReorder = async (id: string, newOrder: number) => {
    try {
      await reorderSoftware(id, newOrder);
      toast.success('Order updated');
    } catch {
      toast.error('Failed to update order');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSoftware(id);
      toast.success('Software deleted');
      setDeleteDialog(null);
    } catch {
      toast.error('Failed to delete software');
    }
  };

  return (
    <>
      <div className="space-y-6">
        {Object.entries(softwareByCategory).map(([category, items]) => (
          <div key={category} className="rounded-lg border border-white/10 overflow-hidden">
            <div className="bg-white/5 px-4 py-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                {categoryIcons[category] || categoryIcons.Other}
                <h3 className="text-lg font-semibold text-white">{category}</h3>
                <Badge variant="secondary" className="text-xs">{items.length}</Badge>
              </div>
            </div>
            
            <div className="divide-y divide-white/10">
              {items.map((software, index) => (
                <div
                  key={software.id}
                  className="p-4 hover:bg-white/5 transition-colors flex items-center gap-4"
                >
                  {/* Icon/Image */}
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-white/5 flex items-center justify-center text-gray-500">
                        {categoryIcons[category] || categoryIcons.Other}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-white truncate">{software.name}</p>
                      {software.isFavorite && (
                        <span className="text-amber-400" title="Favorite">★</span>
                      )}
                      {software.isPaid && (
                        <Badge variant="outline" className="text-[10px]">Paid</Badge>
                      )}
                    </div>
                    {software.description && (
                      <p className="text-sm text-gray-400 truncate">{software.description}</p>
                    )}
                    {software.websiteUrl && (
                      <a
                        href={software.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-indigo-400 hover:underline"
                      >
                        Website →
                      </a>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleReorder(software.id, software.order - 1)}
                      disabled={index === 0}
                      title="Move up"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleReorder(software.id, software.order + 1)}
                      disabled={index === items.length - 1}
                      title="Move down"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setEditingItem(software)}
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-400 hover:text-red-300"
                      onClick={() => setDeleteDialog(software.id)}
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
            <DialogTitle className="text-white">Edit Software</DialogTitle>
            <DialogDescription className="text-gray-400">
              Update software details
            </DialogDescription>
          </DialogHeader>
          {editingItem && (
            <SoftwareForm
              software={editingItem}
              onSuccess={() => {
                setEditingItem(null);
                toast.success('Software updated');
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
            <DialogTitle className="text-white">Delete Software</DialogTitle>
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