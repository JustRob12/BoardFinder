'use client';

import { useAuth } from '../context/AuthContext';
import { AuthForm } from '../components/AuthForm';
import { DashboardRenter } from '../components/DashboardRenter';
import { DashboardLandlord } from '../components/DashboardLandlord';

export default function Home() {
  const { user, currentRole, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-180px)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-sm font-bold text-primary animate-pulse italic">Connecting to BoardFinder...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-180px)] py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-black text-primary tracking-tighter">BoardFinder</h1>
            <p className="text-muted-foreground font-medium">Your gateway to the perfect student accommodation.</p>
          </div>
          <AuthForm />
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700">
      <div className="mb-8 border-b pb-8">
        <h1 className="text-4xl font-black tracking-tight mb-2">
          Dashboard<span className="text-primary italic">{currentRole === 'renter' ? 'Renter' : 'Landlord'}</span>
        </h1>
        <p className="text-muted-foreground">
          Welcome back, <span className="font-bold text-foreground">{user.user_metadata.name}</span>! Here's what's happening today.
        </p>
      </div>
      
      {currentRole === 'renter' ? <DashboardRenter /> : <DashboardLandlord />}
    </div>
  );
}
