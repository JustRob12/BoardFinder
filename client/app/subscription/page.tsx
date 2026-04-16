'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { createClient } from '../../utils/supabase/client';
import { useAuth } from '../../context/AuthContext';

const SUBSCRIPTION_TIERS = [
  {
    tier: 1,
    name: 'Bronze Starter',
    price: '₱49',
    limit: 2,
    features: ['Up to 2 property listings', 'Basic visibility', 'Standard support'],
    color: 'slate',
    popular: false
  },
  {
    tier: 2,
    name: 'Silver Pro',
    price: '₱99',
    limit: 4,
    features: ['Up to 4 property listings', 'Enhanced visibility', 'Priority support', 'Analytics dashboard'],
    color: 'primary',
    popular: true
  },
  {
    tier: 3,
    name: 'Gold Elite',
    price: '₱199',
    limit: 5,
    features: ['Up to 5 property listings', 'Top-of-Dashboard visibility', 'Featured badge', '24/7 dedicated support'],
    color: 'amber',
    popular: false
  }
];

export default function SubscriptionPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<number | null>(null);
  const supabase = createClient();

  const handleSubscribe = async (tier: typeof SUBSCRIPTION_TIERS[0]) => {
    if (!user) {
      alert('Please login first');
      return;
    }

    setIsLoading(tier.tier);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));

      const { error } = await supabase
        .from('subscriptions')
        .upsert({
          user_id: user.id,
          tier: tier.tier,
          post_limit: tier.limit,
          status: 'paid'
        }, { onConflict: 'user_id' });

      if (error) throw error;

      alert(`Successfully subscribed to ${tier.name}!`);
      router.push('/dashboard');
    } catch (error: any) {
      alert(error.message || 'Error processing subscription');
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-black text-primary tracking-tight">Level Up Your Listings</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-medium">
          Choose the plan that fits your business. Expand your reach and find tenants faster with premium visibility.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {SUBSCRIPTION_TIERS.map((plan) => (
          <Card 
            key={plan.tier} 
            className={`relative flex flex-col h-full transition-all duration-500 hover:-translate-y-2 border-none shadow-xl ${
              plan.popular ? 'ring-2 ring-primary scale-105 z-10' : 'scale-100 hover:shadow-2xl'
            } bg-white rounded-[2.5rem] overflow-hidden`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-bl-2xl">
                Most Popular
              </div>
            )}
            
            <CardHeader className="p-8 pb-0">
              <div className={`w-12 h-12 rounded-2xl mb-4 flex items-center justify-center ${
                plan.tier === 1 ? 'bg-slate-100 text-slate-600' : 
                plan.tier === 2 ? 'bg-primary/10 text-primary' : 
                'bg-amber-100 text-amber-600'
              }`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  {plan.tier === 1 ? (
                    <>
                      <path d="M6 3h12l-2 10H8L6 3z"/><path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 11V7"/><path d="M17 11V7"/>
                    </>
                  ) : plan.tier === 2 ? (
                    <>
                      <circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
                    </>
                  ) : (
                    <path d="m12 15 2 7-6-3-6 3 2-7-5-5h7l3-7 3 7h7z"/>
                  )}
                </svg>
              </div>
              <CardTitle className="text-2xl font-black text-slate-900 mb-1">{plan.name}</CardTitle>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-slate-900">{plan.price}</span>
                <span className="text-sm font-bold text-muted-foreground lowercase">/one-time</span>
              </div>
            </CardHeader>

            <CardContent className="p-8 flex-1">
              <ul className="space-y-4">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-600">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter className="p-8 pt-0">
              <Button 
                onClick={() => handleSubscribe(plan)}
                disabled={isLoading !== null}
                className={`w-full h-14 rounded-2xl text-base font-black uppercase tracking-widest transition-all ${
                  plan.popular 
                    ? 'bg-primary shadow-lg shadow-primary/30 hover:shadow-primary/40' 
                    : 'bg-slate-900 hover:bg-slate-800'
                }`}
              >
                {isLoading === plan.tier ? 'Processing...' : 'Choose Plan'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="bg-primary/5 rounded-[2rem] p-8 md:p-12 border border-primary/10 flex flex-col md:flex-row items-center gap-8 shadow-inner">
        <div className="w-20 h-20 rounded-3xl bg-white shadow-xl flex items-center justify-center text-primary shrink-0 rotate-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/></svg>
        </div>
        <div className="flex-1 text-center md:text-left space-y-2">
          <h3 className="text-xl font-black text-primary">Trust & Safety Guaranteed</h3>
          <p className="text-sm font-medium text-muted-foreground leading-relaxed">
            All premium listings go through an enhanced verification process. Gold members get a "Verified Landlord" badge and priority placement in search results to build trust with potential tenants.
          </p>
        </div>
      </div>
    </div>
  );
}
