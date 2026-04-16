'use client';

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/Card';

export const AuthForm = () => {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    username: '', // Still keeping username for UI, but using email for Supabase Auth
    email: '',
    password: '',
    role: 'renter' as 'renter' | 'landlord',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (isLogin) {
        // Supabase needs an email. If the user entered a username, we'll assume it's the email for this demo
        // or ensure the field is labeled 'Email'
        await login(formData.email || formData.username, formData.password);
      } else {
        await register(formData.email, formData.password, formData.name, formData.role);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-2xl border-primary/20 bg-background/50 backdrop-blur-md animate-in fade-in zoom-in duration-300">
      <CardHeader className="space-y-2 pb-8">
        <CardTitle className="text-3xl text-center font-extrabold tracking-tight text-primary">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </CardTitle>
        <CardDescription className="text-center text-base">
          {isLogin 
            ? 'Access your boarding house finder account' 
            : 'Join BoardFinder to discover the best accommodations'}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-5">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs p-3 rounded-lg font-medium animate-in fade-in zoom-in duration-200">
              {error}
            </div>
          )}
          {!isLogin && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Full Name</label>
              <Input 
                name="name" 
                placeholder="Juan Dela Cruz" 
                value={formData.name} 
                onChange={handleChange} 
                required 
              />
            </div>
          )}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
              {isLogin ? 'Email Address' : 'Email Address'}
            </label>
            <Input 
              name="email" 
              type="email"
              placeholder="juan@email.com" 
              value={formData.email} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Password</label>
            <Input 
              name="password" 
              type="password" 
              placeholder="••••••••" 
              value={formData.password} 
              onChange={handleChange} 
              required 
            />
          </div>
          {!isLogin && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Register as</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, role: 'renter'})}
                  className={`flex items-center justify-center h-10 rounded-md border text-sm font-medium transition-all ${formData.role === 'renter' ? 'bg-primary text-white border-primary shadow-inner' : 'bg-background hover:bg-muted'}`}
                >
                  Renter
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, role: 'landlord'})}
                  className={`flex items-center justify-center h-10 rounded-md border text-sm font-medium transition-all ${formData.role === 'landlord' ? 'bg-primary text-white border-primary shadow-inner' : 'bg-background hover:bg-muted'}`}
                >
                  Landlord
                </button>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4 pt-4">
          <Button type="submit" className="w-full text-base font-bold h-12 rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
            {isLogin ? 'Log In' : 'Sign Up'}
          </Button>
          <div className="text-sm text-center text-muted-foreground">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              type="button" 
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary font-bold hover:underline underline-offset-4"
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};
