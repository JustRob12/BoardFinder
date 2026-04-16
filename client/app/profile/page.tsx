'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import { CldUploadWidget } from 'next-cloudinary';

export default function ProfilePage() {
  const { user, isLoading: authLoading, updateAvatar } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    phone_number: '',
    facebook_name: '',
    bio: ''
  });

  const supabase = createClient();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
      return;
    }

    const fetchProfile = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('profile_information')
        .select('*')
        .eq('user_id', user.id)
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
  }, [user, authLoading, router, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('profile_information')
        .upsert({
          user_id: user.id,
          phone_number: formData.phone_number,
          facebook_name: formData.facebook_name,
          bio: formData.bio,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

      if (error) throw error;
      alert('Profile updated successfully!');
    } catch (error: any) {
      alert(error.message || 'Error saving profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 pt-32 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => router.back()}
              className="rounded-full w-10 h-10 p-0 hover:bg-white shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </Button>
            <div>
              <h1 className="text-3xl font-black text-primary tracking-tight">Account Settings</h1>
              <p className="text-muted-foreground">Manage your public profile and contact details.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar / Profile Card */}
            <div className="space-y-6">
              <Card className="border-none shadow-xl shadow-primary/5 bg-white">
                <CardContent className="pt-8 flex flex-col items-center text-center">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-4xl font-black mb-4 border-4 border-white shadow-lg overflow-hidden">
                      {user?.user_metadata?.avatar_url ? (
                        <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        user?.user_metadata?.name?.charAt(0) || 'U'
                      )}
                    </div>
                    
                    <CldUploadWidget 
                      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                      onSuccess={async (result: any) => {
                        if (result.info && typeof result.info === 'object') {
                          try {
                            await updateAvatar(result.info.secure_url);
                          } catch (err) {
                            alert('Failed to update avatar in database');
                          }
                        }
                      }}
                      options={{
                        multiple: false,
                        maxFiles: 1,
                        cropping: true,
                        croppingAspectRatio: 1,
                        showSkipCropButton: true
                      }}
                    >
                      {({ open }) => (
                        <button 
                          onClick={() => open()}
                          className="absolute bottom-4 right-0 bg-primary text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center border-2 border-white"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
                        </button>
                      )}
                    </CldUploadWidget>
                  </div>
                  <h2 className="text-xl font-bold text-primary">{user?.user_metadata?.name}</h2>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{user?.user_metadata?.role}</p>
                  
                  <div className="w-full h-px bg-primary/5 my-6" />
                  
                  <div className="w-full space-y-4">
                     <div className="flex items-center gap-3 text-sm text-muted-foreground p-2 rounded-lg bg-secondary/20">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                        <span className="truncate">{user?.email}</span>
                     </div>
                  </div>
                </CardContent>
              </Card>

              <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Privacy Note</h4>
                 <p className="text-[11px] text-muted-foreground leading-relaxed">Your contact details will only be visible to renters who are viewing your active property listings.</p>
              </div>
            </div>

            {/* Main Form Area */}
            <Card className="lg:col-span-2 border-none shadow-xl shadow-primary/5 bg-white">
              <CardHeader>
                <CardTitle className="text-xl">Public Information</CardTitle>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Phone Number</label>
                    <Input 
                      placeholder="e.g. 0912 345 6789" 
                      value={formData.phone_number} 
                      onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                      className="bg-secondary/10 border-none h-12 rounded-xl focus:ring-primary"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Facebook Name / Profile Link</label>
                    <Input 
                      placeholder="e.g. Juan Dela Cruz" 
                      value={formData.facebook_name} 
                      onChange={(e) => setFormData({...formData, facebook_name: e.target.value})}
                      className="bg-secondary/10 border-none h-12 rounded-xl focus:ring-primary"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">About Me (Bio)</label>
                    <textarea 
                      className="flex min-h-[150px] w-full rounded-xl border-none bg-secondary/10 px-3 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all"
                      placeholder="Describe yourself to potential tenants..."
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    />
                  </div>
                </CardContent>
                <CardFooter className="pt-6 border-t border-primary/5 pb-8">
                  <Button 
                    type="submit" 
                    disabled={isLoading} 
                    className="w-full h-12 rounded-xl bg-primary shadow-lg shadow-primary/20 text-sm font-black uppercase tracking-widest hover:-translate-y-0.5 transition-all"
                  >
                    {isLoading ? 'Saving Changes...' : 'Update My Profile'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
