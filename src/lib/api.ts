// API configuration and client
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export interface ApiResponse<T> {
  message: string;
  data?: T;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  role: 'admin' | 'student' | 'teacher';
  exp: number;
  access_token: string;
  refresh_token: string;
  expires_at: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  username: string;
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface LogoutRequest {
  access_token: string;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
      mode: 'cors',
      ...options,
    };

    // Add auth token if available
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }
    }

    try {
      console.log('Making API request to:', url);
      console.log('Request payload:', options.body);
      
      const response = await fetch(url, config);
      
      console.log('Response status:', response.status);
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error(`Server returned non-JSON response: ${text}`);
      }

      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request error:', error);
      
      // Better error messages for common issues
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Please check if the backend is running on http://localhost:8080');
      }
      
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error('An unknown error occurred');
    }
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<ApiResponse<User>> {
    return this.request<User>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: RegisterRequest): Promise<ApiResponse<User>> {
    return this.request<User>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async refreshToken(tokenData: RefreshTokenRequest): Promise<ApiResponse<{ access_token: string; refresh_token: string; expires_at: string }>> {
    return this.request('/api/auth/refresh-token', {
      method: 'POST',
      body: JSON.stringify(tokenData),
    });
  }

  async logout(): Promise<ApiResponse<null>> {
    return this.request('/api/auth/logout', {
      method: 'GET',
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);