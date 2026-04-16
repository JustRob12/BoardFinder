'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { createClient } from '../utils/supabase/client';
import { PropertyDetailModal } from './PropertyDetailModal';

export const DashboardRenter = () => {
  const [houses, setHouses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  
  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  
  const supabase = createClient();

  const fetchHouses = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('boarding_houses')
      .select(`
        *,
        landlord:landlord_id (
          name,
          avatar_url
        ),
        boarding_house_images (
          image_url
        )
      `)
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching boarding houses:', error);
    } else {
      setHouses(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchHouses();
  }, [supabase]);

  const handleOpenDetail = (house: any) => {
    setSelectedProperty(house);
    setIsDetailModalOpen(true);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setMinPrice('');
    setMaxPrice('');
  };

  const filteredHouses = houses.filter(house => {
    const matchesSearch = !searchQuery || 
      house.location?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      house.title?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const price = Number(house.price);
    const matchesMin = !minPrice || price >= Number(minPrice);
    const matchesMax = !maxPrice || price <= Number(maxPrice);
    
    return matchesSearch && matchesMin && matchesMax;
  });

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
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="space-y-4 flex-1">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-primary">Find Your Next Home</h2>
            <p className="text-muted-foreground text-sm">Discover affordable and safe boarding houses near you.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="relative group">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </div>
              <input 
                type="text"
                placeholder="Search location or title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              />
            </div>
            
            <div className="flex gap-2">
              <div className="relative flex-1 group">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                  <span className="text-xs font-bold font-mono">₱</span>
                </div>
                <input 
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                />
              </div>
              <div className="relative flex-1 group">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                  <span className="text-xs font-bold font-mono">₱</span>
                </div>
                <input 
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                />
              </div>
            </div>

            <div className="flex gap-2">
               {(searchQuery || minPrice || maxPrice) && (
                <Button 
                  variant="ghost" 
                  onClick={clearFilters}
                  className="px-4 text-xs font-bold text-slate-500 hover:text-red-500 hover:bg-red-50"
                >
                  Clear All
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {filteredHouses.length === 0 ? (
        <Card className="p-16 text-center bg-secondary/5 border-dashed border-2 border-slate-200 rounded-[2rem]">
          <div className="max-w-xs mx-auto space-y-4">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900">No results found</h3>
              <p className="text-muted-foreground text-sm font-medium">Try adjusting your filters or search terms to find what you're looking for.</p>
            </div>
            <Button variant="outline" onClick={clearFilters} className="rounded-xl border-slate-200">Reset Filters</Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredHouses.map((house) => (
            <Card 
              key={house.id} 
              onClick={() => handleOpenDetail(house)}
              className="group cursor-pointer hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border-none bg-white rounded-[1.5rem] overflow-hidden shadow-sm"
            >
              <div className="aspect-[4/3] relative overflow-hidden bg-slate-100">
                {house.boarding_house_images && house.boarding_house_images.length > 0 ? (
                  <img 
                    src={house.boarding_house_images[0].image_url} 
                    alt={house.title} 
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-1000" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-200">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                  </div>
                )}
                <div className="absolute top-4 right-4 flex gap-2">
                  {house.is_featured && (
                    <div className="bg-amber-400/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1.5 border border-white/20">
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                      Featured
                    </div>
                  )}
                  <div className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md text-primary border border-slate-100">
                    {house.boarding_house_images?.length > 1 ? `${house.boarding_house_images.length} Photos` : 'New'}
                  </div>
                </div>
              </div>
              <CardHeader className="p-6 pb-2">
                <CardTitle className="text-lg font-black line-clamp-1 group-hover:text-primary transition-colors tracking-tight">{house.title}</CardTitle>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary/60"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  {house.location || 'Location not specified'}
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-0 flex items-center justify-between">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-primary">₱{Number(house.price).toLocaleString()}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">/mo</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedProperty && (
        <PropertyDetailModal 
          isOpen={isDetailModalOpen} 
          onClose={() => setIsDetailModalOpen(false)} 
          property={selectedProperty} 
        />
      )}
    </div>
  );
};
