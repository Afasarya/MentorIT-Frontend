'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { apiClient, User, LoginRequest, RegisterRequest } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): React.ReactElement {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const clearAuthData = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('user_data');
    setUser(null);
  }, []);

  const validateAndRefreshToken = useCallback(async () => {
    const refreshTokenValue = localStorage.getItem('refresh_token');
    if (!refreshTokenValue) throw new Error('No refresh token');

    try {
      const response = await apiClient.refreshToken({ refresh_token: refreshTokenValue });
      
      if (response.data) {
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('refresh_token', response.data.refresh_token);
        localStorage.setItem('expires_at', response.data.expires_at);
      }
    } catch (error) {
      throw error;
    }
  }, []);

  const checkAuthStatus = useCallback(async () => {
    try {
      const userData = localStorage.getItem('user_data');
      const accessToken = localStorage.getItem('access_token');
      const refreshToken = localStorage.getItem('refresh_token');
      
      if (!accessToken || !refreshToken || !userData) {
        setLoading(false);
        return;
      }

      // Parse user data from localStorage
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Try to refresh token to ensure it's still valid
      try {
        await validateAndRefreshToken();
      } catch (error) {
        console.error('Token validation failed:', error);
        clearAuthData();
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      clearAuthData();
    } finally {
      setLoading(false);
    }
  }, [validateAndRefreshToken, clearAuthData]);

  // Check if user is already logged in on mount
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const redirectBasedOnRole = useCallback((role: string) => {
    switch (role) {
      case 'admin':
        router.push('/admin/dashboard');
        break;
      case 'teacher':
        router.push('/teacher/dashboard');
        break;
      case 'student':
      default:
        router.push('/');
        break;
    }
  }, [router]);

  const login = async (credentials: LoginRequest) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.login(credentials);
      
      if (response.data) {
        const userData = response.data;
        
        // Store auth data
        localStorage.setItem('access_token', userData.access_token);
        localStorage.setItem('refresh_token', userData.refresh_token);
        localStorage.setItem('expires_at', userData.expires_at);
        localStorage.setItem('user_data', JSON.stringify(userData));
        
        setUser(userData);
        
        // Redirect based on role
        redirectBasedOnRole(userData.role);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterRequest) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.register(userData);
      
      if (response.data) {
        const user = response.data;
        
        // Store auth data
        localStorage.setItem('access_token', user.access_token);
        localStorage.setItem('refresh_token', user.refresh_token);
        localStorage.setItem('expires_at', user.expires_at);
        localStorage.setItem('user_data', JSON.stringify(user));
        
        setUser(user);
        
        // Redirect based on role (new users are typically students)
        redirectBasedOnRole(user.role);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Try to call logout endpoint, but don't fail if it doesn't work
      try {
        await apiClient.logout();
      } catch (error) {
        console.error('Logout API call failed:', error);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuthData();
      router.push('/');
    }
  };

  const refreshToken = async () => {
    try {
      const refreshTokenValue = localStorage.getItem('refresh_token');
      if (!refreshTokenValue) throw new Error('No refresh token');

      const response = await apiClient.refreshToken({ refresh_token: refreshTokenValue });
      
      if (response.data) {
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('refresh_token', response.data.refresh_token);
        localStorage.setItem('expires_at', response.data.expires_at);
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      clearAuthData();
      router.push('/login');
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    refreshToken,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}