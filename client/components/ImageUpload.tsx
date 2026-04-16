'use client';

import React from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import { Button } from './ui/Button';

interface ImageUploadProps {
  onUpload: (url: string) => void;
  value?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onUpload, value }) => {
  return (
    <div className="space-y-4 w-full">
      <CldUploadWidget
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        onSuccess={(result: any) => {
          if (result.info && typeof result.info === 'object') {
            onUpload(result.info.secure_url);
          }
        }}
      >
        {({ open }) => {
          return (
            <div
              onClick={() => open()}
              className="relative cursor-pointer hover:opacity-70 transition border-dashed border-2 border-primary/20 bg-secondary/5 rounded-xl h-48 flex flex-col justify-center items-center gap-2 overflow-hidden"
            >
              {value ? (
                <img src={value} alt="Current listing image" className="object-cover w-full h-full" />
              ) : (
                <>
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></svg>
                  </div>
                  <div className="text-xs font-bold text-primary uppercase tracking-wider">Click to upload photo</div>
                </>
              )}
            </div>
          );
        }}
      </CldUploadWidget>
      {value && (
        <p className="text-[10px] text-center font-medium text-muted-foreground italic">Click the image again to change photo</p>
      )}
    </div>
  );
};

