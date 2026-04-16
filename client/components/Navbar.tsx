'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/Button';

export const Navbar = () => {
  const { user, logout, currentRole, switchRole } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-border bg-white shadow-sm group-hover:shadow-md transition-all">
            <Image 
              src="/boardfinder.png" 
              alt="BoardFinder Logo" 
              fill
              sizes="36px"
              className="object-cover"
            />
          </div>
          <span className="text-xl font-black tracking-tight text-primary">
            BoardFinder
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 p-1.5 px-3 rounded-full hover:bg-secondary/50 transition-all border border-transparent hover:border-border group"
              >
                 <div className="flex flex-col items-end gap-0 hidden sm:flex">
                    <span className="text-sm font-black text-primary leading-none capitalize">{user.user_metadata.name}</span>
                    <span className="text-[9px] font-black text-muted-foreground uppercase tracking-wider">{currentRole}</span>
                 </div>
                 <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black border-2 border-white shadow-sm group-hover:scale-105 transition-transform overflow-hidden relative">
                    {user.user_metadata.avatar_url ? (
                      <Image 
                        src={user.user_metadata.avatar_url} 
                        alt="Avatar" 
                        fill 
                        className="object-cover"
                        sizes="40px"
                      />
                    ) : (
                      user.user_metadata.name?.charAt(0) || 'U'
                    )}
                 </div>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 rounded-2xl bg-white shadow-2xl shadow-primary/20 border border-primary/5 py-2 animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-4 py-3 border-b border-primary/5 mb-2">
                     <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Account</p>
                     <p className="text-sm font-black text-primary truncate">{user.email}</p>
                  </div>
                  
                  <Link 
                    href="/profile" 
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-foreground hover:bg-primary/5 hover:text-primary transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    My Profile
                  </Link>

                  <button 
                    onClick={() => {
                      switchRole();
                      setIsDropdownOpen(false);
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-bold text-foreground hover:bg-primary/5 hover:text-primary transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 3h5v5"/><path d="M8 3H3v5"/><path d="M21 16v5h-5"/><path d="M3 16v5h5"/><path d="M15 9 9 15"/><path d="M9 9 15 15"/></svg>
                    Switch to {currentRole === 'renter' ? 'Landlord' : 'Renter'}
                  </button>

                  {currentRole === 'landlord' && (
                    <Link 
                      href="/subscription" 
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-foreground hover:bg-primary/5 hover:text-primary transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="m17 7-5-5-5 5"/><path d="M12 2v20"/></svg>
                      Subscription
                    </Link>
                  )}

                  <div className="h-px bg-primary/5 my-2" />

                  <button 
                    onClick={logout}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-bold text-destructive hover:bg-destructive/5 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
             <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground font-medium hidden md:block italic">Find your perfect home</span>
             </div>
          )}
        </div>
      </div>
    </header>
  );
};
