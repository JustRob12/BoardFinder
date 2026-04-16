'use client';

import React from 'react';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/Button';

export const Navbar = () => {
  const { user, logout, currentRole, switchRole } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-border shadow-sm">
            <Image 
              src="/boardfinder.png" 
              alt="BoardFinder Logo" 
              fill
              className="object-cover"
            />
          </div>
          <span className="text-xl font-bold tracking-tight text-primary">
            BoardFinder
          </span>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="hidden sm:flex flex-col items-end mr-2 gap-0">
                <span className="text-sm font-semibold leading-none">{user.user_metadata.name}</span>
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">{currentRole}</span>
              </div>
              
              <Button 
                variant="primary" 
                size="sm" 
                onClick={switchRole}
                className="rounded-full px-4 shadow-md hover:shadow-lg transition-all"
              >
                Switch to {currentRole === 'renter' ? 'Landlord' : 'Renter'}
              </Button>

              <div className="h-4 w-[1px] bg-border mx-1" />

              <Button variant="ghost" size="sm" onClick={logout} className="text-muted-foreground hover:text-foreground">
                Logout
              </Button>
            </>
          ) : (
             <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground font-medium hidden md:block italic">Find your perfect home away from home</span>
             </div>
          )}
        </div>
      </div>
    </header>
  );
};
