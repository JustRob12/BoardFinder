'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '../utils/supabase/client';
import { User } from '@supabase/supabase-js';

export type Role = 'renter' | 'landlord';

interface AuthContextType {
  user: User | null;
  currentRole: Role;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: Role) => Promise<void>;
  logout: () => Promise<void>;
  switchRole: () => Promise<void>;
  updateAvatar: (url: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [currentRole, setCurrentRole] = useState<Role>('renter');
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // Initial session check
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) {
        setCurrentRole(session.user.user_metadata.role || 'renter');
      }
      setIsLoading(false);
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setCurrentRole(session.user.user_metadata.role || 'renter');
      } else {
        setCurrentRole('renter');
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const register = async (email: string, password: string, name: string, role: Role) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
          role: role,
        },
      },
    });
    if (error) throw error;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const switchRole = async () => {
    const newRole = currentRole === 'renter' ? 'landlord' : 'renter';
    setCurrentRole(newRole);
    
    // Persist role change to Supabase metadata
    if (user) {
      await supabase.auth.updateUser({
        data: { role: newRole }
      });
    }
  };

  const updateAvatar = async (url: string) => {
    if (!user) return;
    
    // 1. Update Supabase Auth metadata
    const { error: authError } = await supabase.auth.updateUser({
      data: { avatar_url: url }
    });
    if (authError) throw authError;

    // 2. Update public.users table for persistence and joins
    const { error: dbError } = await supabase
      .from('users')
      .update({ avatar_url: url })
      .eq('id', user.id);
    if (dbError) throw dbError;
  };

  return (
    <AuthContext.Provider value={{ user, currentRole, isLoading, login, register, logout, switchRole, updateAvatar }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
