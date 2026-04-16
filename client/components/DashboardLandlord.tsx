'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { createClient } from '../utils/supabase/client';
import { useAuth } from '../context/AuthContext';
import { ListingModal } from './ListingModal';

export const DashboardLandlord = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [myHouses, setMyHouses] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<any>(null);
  const [hasProfile, setHasProfile] = useState(true);

  const supabase = createClient();

  const fetchSubscription = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    setSubscription(data);
  }, [user, supabase]);

  const checkProfile = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('profile_information')
      .select('id')
      .eq('user_id', user.id)
      .single();

    setHasProfile(!!data);
  }, [user, supabase]);

  const fetchMyHouses = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    const { data, error } = await supabase
      .from('boarding_houses')
      .select(`
        *,
        boarding_house_images (
          image_url
        )
      `)
      .eq('landlord_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching my houses:', error);
    } else {
      setMyHouses(data || []);
    }
    setIsLoading(false);
  }, [supabase, user]);

  useEffect(() => {
    fetchMyHouses();
    checkProfile();
    fetchSubscription();
  }, [fetchMyHouses, checkProfile, fetchSubscription]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('boarding_houses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchMyHouses();
    } catch (error: any) {
      alert(error.message || 'Error deleting listing');
    }
  };

  const handleEdit = (listing: any) => {
    setEditingListing(listing);
    setIsModalOpen(true);
  };

  const handleOpenAddModal = () => {
    // Check if user has posts remaining
    if (!subscription) {
      // No subscription yet, assume 0 limit for now or check if they have at least 1 post
      if (myHouses.length >= 1) {
         router.push('/subscription');
         return;
      }
    } else if (myHouses.length >= subscription.post_limit) {
      alert(`You have reached your post limit (${subscription.post_limit}). Please upgrade your plan to add more.`);
      router.push('/subscription');
      return;
    }
    
    setEditingListing(null);
    setIsModalOpen(true);
  };

  const remainingPosts = subscription ? Math.max(0, subscription.post_limit - myHouses.length) : (myHouses.length >= 1 ? 0 : 1);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-extrabold tracking-tight text-primary">Property Management</h2>
          <div className="flex items-center gap-2">
             <span className="text-xs font-black uppercase text-muted-foreground bg-secondary/50 px-2.5 py-1 rounded-full border border-primary/5 tracking-wider">
               Status: <span className={subscription ? "text-primary" : "text-slate-500"}>{subscription ? `Tier ${subscription.tier} (${subscription.status})` : 'No Subscription'}</span>
             </span>
             {subscription && (
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${remainingPosts === 0 ? 'bg-destructive/10 text-destructive' : 'bg-emerald-100 text-emerald-600'}`}>
                  {remainingPosts} Slots Left
                </span>
             )}
          </div>
        </div>
        <Button
          onClick={handleOpenAddModal}
          className={`rounded-xl shadow-lg flex gap-2 items-center transition-all ${remainingPosts === 0 ? 'bg-slate-800' : 'bg-primary shadow-primary/20'}`}
        >
          {remainingPosts === 0 ? (
             <>
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="m17 7-5-5-5 5"/><path d="M12 2v20"/></svg>
               Upgrade to Add
             </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
              Add New Listing
            </>
          )}
        </Button>
      </div>

      {!hasProfile && (
        <Card className="bg-amber-50 border-amber-200 shadow-sm overflow-hidden animate-in slide-in-from-top-4 duration-500">
          <div className="p-4 flex flex-col sm:flex-row items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <p className="text-amber-900 font-bold">Complete your Profile</p>
              <p className="text-amber-700 text-sm">Renters need to see your phone and Facebook name to contact you. Click your name in the top right to fix it!</p>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-border/50 bg-background/50">
          <CardHeader>
            <CardTitle className="text-xl">Your Active Listings</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="h-24 bg-secondary/50 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : myHouses.length === 0 ? (
              <div className="flex items-center gap-4 p-8 border border-dashed border-primary/20 rounded-xl bg-secondary/10">
                <div className="mx-auto text-center space-y-4">
                  <div className="w-12 h-12 bg-secondary/50 rounded-full flex items-center justify-center mx-auto text-primary/30">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h18v18H3z" /><path d="M9 12h6" /><path d="M12 9v6" /></svg>
                  </div>
                  <p className="text-sm font-medium text-muted-foreground max-w-xs mx-auto">You haven't added any listings yet. Start by clicking "Add New Listing" above.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {myHouses.map((house) => (
                  <div key={house.id} className="flex items-center gap-4 p-4 border border-border/50 rounded-xl hover:bg-secondary/30 transition-all group">
                    <div className="w-16 h-16 bg-secondary rounded-lg overflow-hidden shrink-0 shadow-sm border border-border/50">
                      {house.boarding_house_images && house.boarding_house_images.length > 0 ? (
                        <img src={house.boarding_house_images[0].image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="listing" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-primary/20">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold truncate text-foreground group-hover:text-primary transition-colors">{house.title}</h4>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                        {house.location || 'N/A'} • <span className="font-bold text-primary">₱{Number(house.price).toLocaleString()}/mo</span>
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEdit(house)}
                        variant="outline"
                        size="sm"
                        className="h-8 rounded-lg"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(house.id)}
                        variant="ghost"
                        size="sm"
                        className="h-8 rounded-lg text-destructive hover:bg-destructive/10"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* <Card className="border-border/50 bg-background/50">
          <CardHeader>
            <CardTitle className="text-xl">Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">My Listings</span>
                <span className="text-2xl font-black text-primary">{myHouses.length.toString().padStart(2, '0')}</span>
                </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
                <div className="flex justify-between items-center p-2 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Active Inquiries</span>
                <span className="text-lg font-bold">0</span>
                </div>
                <div className="flex justify-between items-center p-2 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Total Views</span>
                <span className="text-lg font-bold">0</span>
                </div>
            </div>
          </CardContent>
        </Card> */}
      </div>

      <ListingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchMyHouses}
        initialData={editingListing}
      />
    </div>
  );
};
