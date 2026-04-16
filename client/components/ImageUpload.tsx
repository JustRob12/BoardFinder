'use client';

import React from 'react';
import { CldUploadWidget } from 'next-cloudinary';

interface ImageUploadProps {
  onUpload: (url: string) => void;
  onRemove: (url: string) => void;
  values?: string[];
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onUpload, onRemove, values = [] }) => {
  return (
    <div className="space-y-4 w-full">
      {/* Thumbnail Gallery */}
      {values.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
          {values.map((url) => (
            <div key={url} className="relative aspect-square rounded-xl overflow-hidden group">
              <img src={url} alt="Listing photo" className="object-cover w-full h-full" />
              <button 
                type="button"
                onClick={() => onRemove(url)}
                className="absolute top-1 right-1 bg-destructive text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
          ))}
        </div>
      )}

      <CldUploadWidget 
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        onSuccess={(result: any) => {
          if (result.info && typeof result.info === 'object') {
            onUpload(result.info.secure_url);
          }
        }}
        options={{
          multiple: true,
          maxFiles: 5
        }}
      >
        {({ open }) => {
          return (
            <div 
              onClick={() => open()}
              className="relative cursor-pointer hover:bg-secondary/10 transition border-dashed border-2 border-primary/20 bg-secondary/5 rounded-xl h-32 flex flex-col justify-center items-center gap-2 overflow-hidden"
            >
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
              </div>
              <div className="text-xs font-bold text-primary uppercase tracking-wider">
                {values.length > 0 ? 'Add more photos' : 'Upload photos'}
              </div>
            </div>
          );
        }}
      </CldUploadWidget>
      
      <p className="text-[10px] text-center font-bold text-muted-foreground uppercase tracking-widest italic">
        Supported: JPG, PNG • Max 5 photos
      </p>
    </div>
  );
};
