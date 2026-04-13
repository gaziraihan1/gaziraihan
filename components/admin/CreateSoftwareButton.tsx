// components/admin/CreateHardwareButton.tsx
'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { SoftwareForm } from './SoftwareForm';
import { toast } from 'sonner';

export function CreateSoftwareButton() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Software
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#0a0a0a] border-white/10 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">Add Software</DialogTitle>
          <DialogDescription className="text-gray-400">
            Add new equipment to your uses page
          </DialogDescription>
        </DialogHeader>
        <SoftwareForm
          onSuccess={() => {
            setOpen(false);
            toast.success('Hardware created!');
          }}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}