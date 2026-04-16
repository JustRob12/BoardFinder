'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { createClient } from '../utils/supabase/client';
import { useAuth } from '../context/AuthContext';
import { AddListingModal } from './AddListingModal';

export const DashboardLandlord = () => {
  const { user } = useAuth();
  const [myHouses, setMyHouses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const supabase = createClient();

  const fetchMyHouses = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    const { data, error } = await supabase
      .from('boarding_houses')
      .select('*')
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
  }, [fetchMyHouses]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-primary">Property Management</h2>
          <p className="text-muted-foreground">Manage your listings and view potential tenants.</p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="rounded-xl shadow-lg shadow-primary/20 flex gap-2 items-center"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            Add New Listing
        </Button>
      </div>

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
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h18v18H3z"/><path d="M9 12h6"/><path d="M12 9v6"/></svg>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground max-w-xs mx-auto">You haven't added any listings yet. Start by clicking "Add New Listing" above.</p>
                 </div>
              </div>
            ) : (
              <div className="space-y-4">
                {myHouses.map((house) => (
                  <div key={house.id} className="flex items-center gap-4 p-4 border border-border/50 rounded-xl hover:bg-secondary/30 transition-all group">
                    <div className="w-16 h-16 bg-secondary rounded-lg overflow-hidden shrink-0 shadow-sm border border-border/50">
                      {house.image_url ? (
                        <img src={house.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="listing" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-primary/20">
                           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold truncate text-foreground group-hover:text-primary transition-colors">{house.title}</h4>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                        {house.location || 'N/A'} • <span className="font-bold text-primary">₱{Number(house.price).toLocaleString()}/mo</span>
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="h-8 rounded-lg">Edit</Button>
                      <Button variant="ghost" size="sm" className="h-8 rounded-lg text-destructive hover:bg-destructive/10">Delete</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-background/50">
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
            
            <div className="pt-4">
               <h5 className="text-[10px] font-black uppercase tracking-widest text-primary mb-4 p-1 bg-primary/10 rounded inline-block">Pro Tips</h5>
               <ul className="text-xs space-y-3 text-muted-foreground">
                 <li className="flex gap-2">
                    <span className="text-primary font-bold">01.</span>
                    <span>Complete your profile to gain tenant trust.</span>
                 </li>
                 <li className="flex gap-2">
                    <span className="text-primary font-bold">02.</span>
                    <span>Add clear photos of the bathroom and common area.</span>
                 </li>
                 <li className="flex gap-2">
                    <span className="text-primary font-bold">03.</span>
                    <span>List all amenities (WiFi, Laundry, etc.)</span>
                 </li>
               </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <AddListingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchMyHouses} 
      />
    </div>
  );
};
