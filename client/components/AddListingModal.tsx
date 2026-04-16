'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { ImageUpload } from './ImageUpload';
import { createClient } from '../utils/supabase/client';
import { useAuth } from '../context/AuthContext';

interface AddListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddListingModal: React.FC<AddListingModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    image_url: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    const supabase = createClient();

    try {
      const { error } = await supabase
        .from('boarding_houses')
        .insert([
          {
            landlord_id: user.id,
            title: formData.title,
            description: formData.description,
            price: parseFloat(formData.price),
            location: formData.location,
            image_url: formData.image_url,
          }
        ]);

      if (error) throw error;

      onSuccess();
      onClose();
      setFormData({ title: '', description: '', price: '', location: '', image_url: '' });
    } catch (error: any) {
      alert(error.message || 'Error creating listing');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <Card className="w-full max-w-xl shadow-2xl animate-in zoom-in duration-300">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle className="text-2xl font-black text-primary">Add New Listing</CardTitle>
            <p className="text-sm text-muted-foreground">Fill in the details for your boarding house.</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full w-8 h-8 p-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
          </Button>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Property Title</label>
              <Input
                placeholder="e.g. Modern Studio with WiFi"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Price per Month (₱)</label>
                <Input
                  type="number"
                  placeholder="5000"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Location</label>
                <Input
                  placeholder="e.g. Sampaloc, Manila"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Description</label>
              <textarea
                className="flex min-h-[80px] w-full rounded-md border border-primary/20 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all"
                placeholder="Tell tenants about the amenities, rules, and vibes..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Property Photo</label>
              <ImageUpload
                value={formData.image_url}
                onUpload={(url) => setFormData({ ...formData, image_url: url })}
              />
            </div>
          </CardContent>
          <CardFooter className="pt-6 gap-3">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 rounded-xl">Cancel</Button>
            <Button type="submit" disabled={isLoading} className="flex-1 rounded-xl bg-primary shadow-lg shadow-primary/20">
              {isLoading ? 'Saving...' : 'Publish Listing'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

