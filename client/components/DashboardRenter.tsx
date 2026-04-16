'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { createClient } from '../utils/supabase/client';

export const DashboardRenter = () => {
  const [houses, setHouses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchHouses = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('boarding_houses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching boarding houses:', error);
      } else {
        setHouses(data || []);
      }
      setIsLoading(false);
    };

    fetchHouses();
  }, [supabase]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-[320px] rounded-xl bg-secondary/50" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-primary">Find Your Next Home</h2>
          <p className="text-muted-foreground">Discover affordable and safe boarding houses near you.</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-full">All Locations</Button>
            <Button variant="outline" size="sm" className="rounded-full">Price Range</Button>
        </div>
      </div>
      
      {houses.length === 0 ? (
        <Card className="p-16 text-center bg-secondary/10 border-dashed border-2 border-primary/20">
          <div className="max-w-xs mx-auto space-y-4">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto text-primary/40">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </div>
            <p className="text-muted-foreground font-medium">No boarding houses currently listed in the database. Please check back soon!</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {houses.map((house) => (
            <Card key={house.id} className="group cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-border/50 bg-background">
              <div className="aspect-[4/3] relative overflow-hidden rounded-t-xl bg-secondary">
                {house.image_url ? (
                  <img 
                    src={house.image_url} 
                    alt={house.title} 
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-primary/20">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm text-primary">
                  Available
                </div>
              </div>
              <CardHeader className="p-5 pb-2">
                <CardTitle className="text-base font-bold line-clamp-1 group-hover:text-primary transition-colors">{house.title}</CardTitle>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  {house.location || 'Location not specified'}
                </div>
              </CardHeader>
              <CardContent className="p-5 pt-0">
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black text-primary">₱{Number(house.price).toLocaleString()}</span>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">/ month</span>
                </div>
              </CardContent>
              <div className="px-5 pb-5">
                 <Button className="w-full h-9 text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  View Details
                 </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
