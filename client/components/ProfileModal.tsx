'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { createClient } from '../utils/supabase/client';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, userId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    phone_number: '',
    facebook_name: '',
    bio: ''
  });

  const supabase = createClient();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!isOpen || !userId) return;

      const { data, error } = await supabase
        .from('profile_information')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (data) {
        setFormData({
          phone_number: data.phone_number || '',
          facebook_name: data.facebook_name || '',
          bio: data.bio || ''
        });
      }
    };

    fetchProfile();
  }, [isOpen, userId, supabase]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('profile_information')
        .upsert({
          user_id: userId,
          phone_number: formData.phone_number,
          facebook_name: formData.facebook_name,
          bio: formData.bio,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

      if (error) throw error;
      onClose();
    } catch (error: any) {
      alert(error.message || 'Error saving profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <Card className="w-full max-w-md shadow-2xl animate-in zoom-in duration-300">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-primary/10">
          <div>
            <CardTitle className="text-2xl font-black text-primary">My Profile</CardTitle>
            <p className="text-sm text-muted-foreground">Manage your contact information.</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full w-8 h-8 p-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
          </Button>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5 pt-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Phone Number</label>
              <Input
                placeholder="e.g. 0912 345 6789"
                value={formData.phone_number}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Facebook Name / Profile Link</label>
              <Input
                placeholder="e.g. Juan Dela Cruz"
                value={formData.facebook_name}
                onChange={(e) => setFormData({ ...formData, facebook_name: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">About Me (Bio)</label>
              <textarea
                className="flex min-h-[100px] w-full rounded-md border border-primary/20 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all"
                placeholder="Tell tenants a bit about yourself as a landlord..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              />
            </div>
          </CardContent>
          <CardFooter className="pt-6 gap-3">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 rounded-xl">Cancel</Button>
            <Button type="submit" disabled={isLoading} className="flex-1 rounded-xl bg-primary shadow-lg shadow-primary/20">
              {isLoading ? 'Saving...' : 'Save Profile'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

