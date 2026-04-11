'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Briefcase, X, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { createExperience, updateExperience, deleteExperience, type CreateExperienceInput } from '@/actions/adminExperience';

interface Experience {
  id: string;
  company: string;
  role: string;
  location?: string | null;
  startDate: Date;
  endDate?: Date | null;
  isCurrent: boolean;
  description?: string | null;
  highlights: string[];
  technologies: string[];
  order: number;
}

export function ExperienceManager({ experience }: { experience: Experience[] }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Experience | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    location: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    description: '',
    highlights: [''],
    technologies: [''],
    order: 0,
  });

  const resetForm = () => {
    setFormData({
      company: '',
      role: '',
      location: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      description: '',
      highlights: [''],
      technologies: [''],
      order: 0,
    });
    setEditingItem(null);
  };

  const openEditDialog = (item: Experience) => {
    setEditingItem(item);
    setFormData({
      company: item.company,
      role: item.role,
      location: item.location || '',
      startDate: new Date(item.startDate).toISOString().split('T')[0],
      endDate: item.endDate ? new Date(item.endDate).toISOString().split('T')[0] : '',
      isCurrent: item.isCurrent,
      description: item.description || '',
      highlights: item.highlights.length > 0 ? item.highlights : [''],
      technologies: item.technologies.length > 0 ? item.technologies : [''],
      order: item.order,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const submitData: CreateExperienceInput = {
        company: formData.company,
        role: formData.role,
        location: formData.location || null,
        startDate: formData.startDate,  // String - Zod will transform to Date
        endDate: formData.isCurrent ? null : (formData.endDate || null),
        isCurrent: formData.isCurrent,
        description: formData.description || null,
        highlights: formData.highlights.filter(h => h.trim()),
        technologies: formData.technologies.filter(t => t.trim()),
        order: formData.order,
      };

      let result;
      if (editingItem) {
        result = await updateExperience(editingItem.id, submitData);
      } else {
        result = await createExperience(submitData);
      }
      
      if (result?.success) {
        toast.success(editingItem ? 'Experience updated successfully' : 'Experience created successfully');
        setIsDialogOpen(false);
        resetForm();
      } else {
        toast.error(result?.error || 'Failed to save experience');
      }
    } catch (error: any) {
      console.error('Error saving experience:', error);
      
      if (error instanceof Error && 'issues' in error) {
        const zodError = error as { issues: Array<{ path?: (string | number)[]; message: string }> };
        toast.error(`Validation error: ${zodError.issues.map(issue => 
          `${issue.path?.join('.') || 'field'}: ${issue.message}`
        ).join(', ')}`);
      } else {
        toast.error(error.message || 'Failed to save experience');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const addHighlight = () => {
    setFormData({ ...formData, highlights: [...formData.highlights, ''] });
  };

  const removeHighlight = (index: number) => {
    setFormData({
      ...formData,
      highlights: formData.highlights.filter((_, i) => i !== index),
    });
  };

  const updateHighlight = (index: number, value: string) => {
    const updated = [...formData.highlights];
    updated[index] = value;
    setFormData({ ...formData, highlights: updated });
  };

  const addTechnology = () => {
    setFormData({ ...formData, technologies: [...formData.technologies, ''] });
  };

  const removeTechnology = (index: number) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter((_, i) => i !== index),
    });
  };

  const updateTechnology = (index: number, value: string) => {
    const updated = [...formData.technologies];
    updated[index] = value;
    setFormData({ ...formData, technologies: updated });
  };

  const sortedExperience = [...experience].sort((a, b) => {
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Experience</h2>
          <p className="text-gray-400">Manage your work history</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Experience
        </Button>
      </div>

      <div className="space-y-4">
        {sortedExperience.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No experience entries yet</p>
        ) : (
          sortedExperience.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-indigo-500/10">
                          <Briefcase className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">{item.role}</h3>
                          <p className="text-indigo-400">{item.company}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                        <span>{item.location || 'Remote'}</span>
                        <span>•</span>
                        <span>
                          {new Date(item.startDate).toLocaleDateString()} - 
                          {item.isCurrent ? ' Present' : item.endDate ? new Date(item.endDate).toLocaleDateString() : ''}
                        </span>
                        {item.isCurrent && (
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                            Current
                          </Badge>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-gray-300 text-sm mb-3">{item.description}</p>
                      )}
                      {item.highlights.length > 0 && (
                        <ul className="space-y-1 mb-3">
                          {item.highlights.slice(0, 3).map((highlight, i) => (
                            <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                              <span className="text-indigo-400 mt-1">•</span>
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      {item.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {item.technologies.map((tech, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 ml-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(item)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-400"
                        onClick={() => deleteExperience(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="bg-[#0a0a0a] border-white/10 max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingItem ? 'Edit Experience' : 'Add New Experience'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className='space-y-2'>
                <Label className="text-gray-300">Company *</Label>
                <Input
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                  placeholder="e.g., Google"
                />
              </div>
              <div className='space-y-2'>
                <Label className="text-gray-300">Role *</Label>
                <Input
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                  placeholder="e.g., Senior Developer"
                />
              </div>
            </div>
            <div className='space-y-2'>
              <Label className="text-gray-300">Location</Label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="bg-white/5 border-white/10 text-white"
                placeholder="e.g., San Francisco, CA or Remote"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className='space-y-2'>
                <Label className="text-gray-300">Start Date *</Label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className='space-y-2'>
                <Label className="text-gray-300">End Date</Label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                  disabled={formData.isCurrent}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isCurrent"
                checked={formData.isCurrent}
                onCheckedChange={(checked) => {
                  setFormData({ 
                    ...formData, 
                    isCurrent: checked as boolean,
                    endDate: checked ? '' : formData.endDate
                  });
                }}
              />
              <Label htmlFor="isCurrent" className="text-gray-300 cursor-pointer">
                I currently work here
              </Label>
            </div>
            
            <div className='space-y-2'>
              <Label className="text-gray-300">Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="bg-white/5 border-white/10 text-white resize-none"
                placeholder="Brief description of your role and responsibilities"
              />
            </div>
            <div>
              <Label className="text-gray-300">Key Highlights</Label>
              <div className="space-y-2 mt-2">
                {formData.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={highlight}
                      onChange={(e) => updateHighlight(index, e.target.value)}
                      className="bg-white/5 border-white/10 text-white"
                      placeholder="e.g., Led team of 5 developers"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeHighlight(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addHighlight}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Highlight
                </Button>
              </div>
            </div>
            <div>
              <Label className="text-gray-300">Technologies Used</Label>
              <div className="space-y-2 mt-2">
                {formData.technologies.map((tech, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={tech}
                      onChange={(e) => updateTechnology(index, e.target.value)}
                      className="bg-white/5 border-white/10 text-white"
                      placeholder="e.g., React"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeTechnology(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addTechnology}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Technology
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {editingItem ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  {editingItem ? 'Update' : 'Create'}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}