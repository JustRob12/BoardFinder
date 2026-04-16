'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/Card';
import { Button } from './ui/Button';
import { createClient } from '../utils/supabase/client';

interface PropertyDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: any;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({ isOpen, onClose, property }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [landlordProfile, setLandlordProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    const fetchLandlordProfile = async () => {
      if (!isOpen || !property?.landlord_id) return;

      setIsLoading(true);
      const { data, error } = await supabase
        .from('profile_information')
        .select('*')
        .eq('user_id', property.landlord_id)
        .single();

      if (data) {
        setLandlordProfile(data);
      }
      setIsLoading(false);
    };

    fetchLandlordProfile();
    setCurrentImageIndex(0); // Reset slider on open
  }, [isOpen, property, supabase]);

  if (!isOpen || !property) return null;

  const images = property.boarding_house_images || [];

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
      <Card className="w-full h-full md:h-auto md:max-w-5xl md:max-h-[90vh] overflow-hidden shadow-2xl animate-in zoom-in duration-500 flex flex-col md:flex-row border-none bg-background rounded-none md:rounded-3xl">

        {/* Left Side: Image Slider */}
        <div className="relative w-full md:w-3/5 aspect-[4/3] md:aspect-square lg:aspect-auto bg-slate-900 overflow-hidden group">
          {images.length > 0 ? (
            <>
              <img
                src={images[currentImageIndex].image_url}
                alt={property.title}
                className="w-full h-full object-cover transition-all duration-700 ease-in-out hover:scale-105"
              />

              {images.length > 1 && (
                <>
                  {/* Image Navigation Buttons */}
                  <div className="absolute inset-0 flex items-center justify-between p-4 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={prevImage}
                      className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-xl flex items-center justify-center text-white hover:bg-primary transition-all shadow-xl active:scale-95 z-10"
                      aria-label="Previous image"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                    </button>
                    <button
                      onClick={nextImage}
                      className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-xl flex items-center justify-center text-white hover:bg-primary transition-all shadow-xl active:scale-95 z-10"
                      aria-label="Next image"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                    </button>
                  </div>

                  {/* Image Counter Badge */}
                  <div className="absolute bottom-6 right-6 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full text-white text-[10px] font-black tracking-widest uppercase border border-white/10">
                    {currentImageIndex + 1} / {images.length}
                  </div>

                  {/* Dot Indicators */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_: any, i: number) => (
                      <div
                        key={i}
                        className={`transition-all duration-300 rounded-full h-1.5 ${i === currentImageIndex ? 'bg-primary w-6' : 'bg-white/40 w-1.5'}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-primary/20 bg-slate-100">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
            </div>
          )}

          {/* Mobile Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 left-6 md:hidden w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-md border border-white/20 active:scale-90 transition-transform"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
          </button>
        </div>

        {/* Right Side: Info & Landlord */}
        <div className="flex-1 flex flex-col bg-white h-full overflow-hidden">
          <CardHeader className="pb-4 flex flex-row justify-between items-start bg-white sticky top-0 z-10 border-b border-secondary pt-8 md:pt-6">
            <div className="space-y-2">
              <CardTitle className="text-2xl md:text-3xl font-black text-primary leading-tight tracking-tight">{property.title}</CardTitle>
              <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-[0.1em]">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                </div>
                {property.location}
              </div>
            </div>
            <button
              onClick={onClose}
              className="hidden md:flex w-10 h-10 rounded-full bg-secondary text-primary items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm active:scale-90"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
            </button>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto space-y-8 p-6 md:p-8">
            <div className="flex flex-col gap-1 p-4 bg-primary/5 rounded-2xl border border-primary/10">
              <span className="text-[10px] font-black text-primary/60 uppercase tracking-widest">Pricing</span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-primary">₱{Number(property.price).toLocaleString()}</span>
                <span className="text-sm font-bold text-primary/60">/ month</span>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[11px] font-black uppercase tracking-[0.25em] text-primary/40 flex items-center gap-2">
                About this property
                <div className="h-px flex-1 bg-primary/10" />
              </h4>
              <p className="text-sm md:text-base text-foreground/80 leading-relaxed font-medium">
                {property.description || "No description provided for this listing."}
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-[11px] font-black uppercase tracking-[0.25em] text-primary/40 flex items-center gap-2">
                Property Owner
                <div className="h-px flex-1 bg-primary/10" />
              </h4>

              {isLoading ? (
                <div className="h-24 w-full animate-pulse bg-secondary/50 rounded-2xl" />
              ) : landlordProfile ? (
                <div className="bg-slate-50 p-5 rounded-3xl space-y-5 border border-slate-100 shadow-inner">
                  <div className="flex  items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-primary/20 border-4 border-white">
                      {property.users?.name?.charAt(0) || "L"}
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-lg font-black text-primary leading-none">{property.users?.name || "Landlord"}</p>
                      <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded inline-block">Direct Contact</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {landlordProfile.phone_number && (
                      <div className="flex items-center gap-4 bg-white px-4 py-3 rounded-2xl border border-slate-100 shadow-sm group hover:border-primary/20 transition-colors">
                        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black uppercase text-slate-400">Mobile</span>
                          <span className="text-sm font-bold text-slate-700">{landlordProfile.phone_number}</span>
                        </div>
                      </div>
                    )}

                    {landlordProfile.facebook_name && (
                      <div className="flex items-center gap-4 bg-white px-4 py-3 rounded-2xl border border-slate-100 shadow-sm group hover:border-primary/20 transition-colors">
                        <div className="w-10 h-10 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black uppercase text-slate-400">Messenger</span>
                          <span className="text-sm font-bold text-slate-700 truncate max-w-[120px]">{landlordProfile.facebook_name}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-secondary/10 p-6 rounded-3xl border border-dashed border-primary/20 text-center">
                  <p className="text-xs font-bold text-muted-foreground italic">Contact info is currently hidden for this listing.</p>
                </div>
              )}
            </div>
          </CardContent>


        </div>
      </Card>
    </div>
  );
};
