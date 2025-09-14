'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export function TokenRefreshHandler({ children }: { children: React.ReactNode }) {
  const { refreshToken, user } = useAuth();

  useEffect(() => {
    let refreshInterval: NodeJS.Timeout;

    if (user) {
      // Check token expiry every 5 minutes
      refreshInterval = setInterval(async () => {
        const expiresAt = localStorage.getItem('expires_at');
        if (expiresAt) {
          const expirationTime = new Date(expiresAt).getTime();
          const currentTime = new Date().getTime();
          const timeUntilExpiry = expirationTime - currentTime;
          
          // Refresh token if it expires in the next 10 minutes
          if (timeUntilExpiry < 10 * 60 * 1000 && timeUntilExpiry > 0) {
            try {
              await refreshToken();
            } catch (error) {
              console.error('Auto token refresh failed:', error);
            }
          }
        }
      }, 5 * 60 * 1000); // Check every 5 minutes
    }

    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [user, refreshToken]);

  return <>{children}</>;
}