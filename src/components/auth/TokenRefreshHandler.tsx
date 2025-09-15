'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export function TokenRefreshHandler({ children }: { children: React.ReactNode }) {
  const { user, refreshToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    let refreshInterval: NodeJS.Timeout;

    if (user) {
      // Check token status every minute instead of every 5 minutes for better UX
      refreshInterval = setInterval(async () => {
        const expiresAt = localStorage.getItem('expires_at');
        
        if (!expiresAt) {
          return;
        }

        const expirationTime = new Date(expiresAt).getTime();
        const currentTime = new Date().getTime();
        const timeUntilExpiry = expirationTime - currentTime;
        
        // Only refresh if token expires in the next 10 minutes
        // This prevents unnecessary refreshes and race conditions
        if (timeUntilExpiry < 10 * 60 * 1000 && timeUntilExpiry > 0) {
          console.log('Token will expire soon, refreshing...');
          try {
            await refreshToken();
          } catch (error) {
            console.error('Auto token refresh failed:', error);
            // If refresh fails, redirect to login
            router.push('/login');
          }
        }
      }, 1 * 60 * 1000); // Check every minute
    }

    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [user, refreshToken, router]);

  return <>{children}</>;
}