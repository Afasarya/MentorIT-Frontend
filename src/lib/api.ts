// API configuration and client
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export interface ApiResponse<T> {
  message: string;
  data?: T;
  error?: boolean;
  statusCode?: number;
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
  classes?: Class[];
}

export interface UserListResponse {
  users: User[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

export interface CreateUserRequest {
  username: string;
  name: string;
  email: string;
  password: string;
  role: 'student' | 'teacher' | 'admin';
  exp?: number;
}

export interface UpdateUserRequest {
  username?: string;
  name?: string;
  email?: string;
  role?: 'student' | 'teacher' | 'admin';
  exp?: number;
}

export interface UpdatePasswordRequest {
  password: string;
}

export interface Class {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  trailer: string;
  price: number;
  formatted_price: string;
  category_name: string;
  class_category_id: number;
  member_count: number;
  level: string;
  target_audience: string;
  benefits: string;
  course_details: string;
  modules?: Module[];
  created_at: string;
  updated_at: string;
}

export interface CreateClassRequest {
  title: string;
  description: string;
  thumbnail: File;
  trailer: string;
  price: string;
  category_name: string;
  level?: string;
  target_audience?: string;
  benefits?: string;
  course_details?: string;
}

export interface UpdateClassRequest {
  title?: string;
  description?: string;
  thumbnail?: File;
  trailer?: string;
  price?: string;
  category_name?: string;
  level?: string;
  target_audience?: string;
  benefits?: string;
  course_details?: string;
}

// Course category interfaces
export interface ClassCategory {
  id: number;
  name: string;
  description: string;
  icon: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateCategoryRequest {
  name: string;
  description: string;
  icon?: File;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  icon?: File;
}

export interface Module {
  id: number;
  title: string;
  order: number;
  class_id: number;
  module_item?: ModuleItem[]; 
}

export interface CreateModuleRequest {
  title: string;
  class_id: number;
}

export interface UpdateModuleRequest {
  title: string;
}

export interface ModuleItem {
  id: number;
  module_id: number;
  item_type: 'submodule' | 'quiz' | 'project';
  item_id: number;
  order: number;
  data?: SubModule | Quiz | ProjectPage;
}

export interface SubModule {
  id: number;
  title: string;
  description: string;
  content: string;
  youtube_url?: string;
}

export interface Quiz {
  id: number;
  title: string;
  module_id: number;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id?: number;
  quiz_id?: number;
  question: string;
  options: string[];
  answer: string;
  order: number;
}

export interface ProjectPage {
  id: number;
  module_id: number;
  title: string;
  description: string;
  guide: string;
}

export interface CreateModuleItemRequest {
  module_id: number;
  item_type: 'submodule' | 'quiz' | 'project';
  // For submodule
  title: string;
  description?: string;
  content?: string;
  youtube_url?: string;
  // For quiz
  questions?: {
    question: string;
    options: string[];
    answer: string;
    order: number;
  }[];
  // For project
  guide?: string;
}

export interface CreateQuizData {
  title: string;
  questions: {
    question: string;
    options: string[];
    answer: string;
    order: number;
  }[];
}

export interface CreateProjectData {
  title: string;
  description: string;
  guide: string;
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

// Project submission types
export interface ProjectSubmission {
  id: number;
  user_id: number;
  user: User;
  project_page_id: number;
  project_page: ProjectPage;
  title: string;
  description: string;
  github_link: string;
  deploy_link: string;
  proposal_file: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  reviewed_by?: number;
  reviewer?: User;
  review_note: string;
  grade: string;
  points: number;
  created_at: string;
  updated_at: string;
}

export interface CreateProjectSubmissionRequest {
  project_page_id: number;
  title: string;
  description: string;
  github_link?: string;
  deploy_link?: string;
  proposal_file?: File;
}

export interface ReviewProjectSubmissionRequest {
  status: 'approved' | 'rejected' | 'under_review';
  review_note?: string;
  grade?: string;
  points?: number;
}

// Payment interfaces
export interface MidtransResponse {
  token: string;
  redirect_url: string;
}

export interface Transaction {
  id: number;
  order_id: string;
  user_id: number;
  class_id: number;
  amount: number;
  status: 'pending' | 'paid' | 'failed' | 'challenge' | 'unknown' | 'settlement';
  failure_reason?: string;
  class_name?: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentRequest {
  class_id: number;
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
      mode: 'cors',
      ...options,
    };

    // Set headers based on body type
    if (options.body instanceof FormData) {
      // Don't set Content-Type for FormData, let browser handle it
      config.headers = {
        'Accept': 'application/json',
        ...options.headers,
      };
    } else {
      // Set JSON headers for regular requests
      config.headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      };
    }

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
      const response = await fetch(url, config);
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      let data;
      
      // Handle empty response body (common for logout, delete operations)
      const responseText = await response.text();
      
      if (responseText.trim() === '') {
        // Empty response - return a default success response
        data = { message: 'Success' };
      } else if (contentType && contentType.includes('application/json')) {
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error('JSON parse error:', parseError);
          // Return a structured error response instead of throwing
          return {
            message: 'Invalid response from server',
            error: true,
            statusCode: response.status
          } as ApiResponse<T>;
        }
      } else {
        console.error('Non-JSON response:', responseText);
        // Return a structured error response instead of throwing
        return {
          message: 'Server returned an invalid response',
          error: true,
          statusCode: response.status
        } as ApiResponse<T>;
      }

      if (!response.ok) {
        // If token is invalid/expired and this isn't already a refresh request
        if (response.status === 401 && !endpoint.includes('/auth/refresh-token')) {
          // Clear auth data on 401 errors
          if (typeof window !== 'undefined') {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('expires_at');
            localStorage.removeItem('user_data');
          }
        }
        
        // Return structured error response instead of throwing
        return {
          message: data.message || this.getStatusMessage(response.status),
          error: true,
          statusCode: response.status,
          data: null
        } as ApiResponse<T>;
      }

      return data;
    } catch (error) {
      console.error('API request error:', error);
      
      // Return structured error response instead of throwing
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return {
          message: 'Cannot connect to server. Please check your internet connection.',
          error: true,
          statusCode: 0
        } as ApiResponse<T>;
      }
      
      return {
        message: error instanceof Error ? error.message : 'An unknown error occurred',
        error: true,
        statusCode: 0
      } as ApiResponse<T>;
    }
  }

  private getStatusMessage(status: number): string {
    switch (status) {
      case 400:
        return 'Bad request. Please check your input.';
      case 401:
        return 'You are not authorized to perform this action.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 409:
        return 'There was a conflict with your request.';
      case 422:
        return 'The provided data is invalid.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return `Request failed with status ${status}`;
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

  // User Management endpoints
  async getUsers(params?: {
    page?: number;
    limit?: number;
    role?: 'student' | 'teacher' | 'admin';
    search?: string;
  }): Promise<ApiResponse<UserListResponse>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.role) searchParams.append('role', params.role);
    if (params?.search) searchParams.append('search', params.search);

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/api/admin/users?${queryString}` : '/api/admin/users';
    
    return this.request<UserListResponse>(endpoint);
  }

  async getUserById(id: number): Promise<ApiResponse<User>> {
    return this.request<User>(`/api/admin/users/${id}`);
  }

  async createUser(userData: CreateUserRequest): Promise<ApiResponse<User>> {
    return this.request<User>('/api/admin/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id: number, userData: UpdateUserRequest): Promise<ApiResponse<User>> {
    return this.request<User>(`/api/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: number): Promise<ApiResponse<null>> {
    return this.request<null>(`/api/admin/users/${id}`, {
      method: 'DELETE',
    });
  }

  async updateUserPassword(id: number, passwordData: UpdatePasswordRequest): Promise<ApiResponse<null>> {
    return this.request<null>(`/api/admin/users/${id}/password`, {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  }

  // Class Management endpoints
  async getClasses(): Promise<ApiResponse<Class[]>> {
    return this.request<Class[]>('/api/classes/class');
  }

  async getClass(id: string | number): Promise<ApiResponse<Class>> {
    return this.request<Class>(`/api/classes/class/${id}`);
  }

  // Get enrolled classes for current student
  async getMyClasses(): Promise<ApiResponse<Class[]>> {
    return this.request<Class[]>('/api/classes/my-classes');
  }

  async createClass(data: CreateClassRequest): Promise<ApiResponse<Class>> {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('thumbnail', data.thumbnail);
    formData.append('trailer', data.trailer);
    formData.append('price', data.price);
    formData.append('category_name', data.category_name);
    if (data.level) formData.append('level', data.level);
    if (data.target_audience) formData.append('target_audience', data.target_audience);
    if (data.benefits) formData.append('benefits', data.benefits);
    if (data.course_details) formData.append('course_details', data.course_details);

    return this.request('/api/classes/create', {
      method: 'POST',
      headers: {
        // Remove Content-Type header to let browser set it automatically for FormData
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,

      },
      body: formData,
    });
  }

  async updateClass(id: number, data: UpdateClassRequest): Promise<ApiResponse<Class>> {
    const formData = new FormData();
    if (data.title) formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    if (data.thumbnail) formData.append('thumbnail', data.thumbnail);
    if (data.trailer) formData.append('trailer', data.trailer);
    if (data.price) formData.append('price', data.price);
    if (data.category_name) formData.append('category_name', data.category_name);
    if (data.level) formData.append('level', data.level);
    if (data.target_audience) formData.append('target_audience', data.target_audience);
    if (data.benefits) formData.append('benefits', data.benefits);
    if (data.course_details) formData.append('course_details', data.course_details);

    return this.request(`/api/classes/update/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: formData,
    });
  }

  async deleteClass(id: number): Promise<ApiResponse<null>> {
    return this.request<null>(`/api/classes/delete/${id}`, {
      method: 'DELETE',
    });
  }

  // Class Category endpoints
  async getClassCategories(): Promise<ApiResponse<ClassCategory[]>> {
    return this.request<ClassCategory[]>('/api/classes/category');
  }

  async getClassCategory(id: number): Promise<ApiResponse<ClassCategory>> {
    return this.request<ClassCategory>(`/api/classes/category/${id}`);
  }

  async createClassCategory(categoryData: CreateCategoryRequest): Promise<ApiResponse<ClassCategory>> {
    const formData = new FormData();
    formData.append('name', categoryData.name);
    formData.append('description', categoryData.description);
    if (categoryData.icon) {
      formData.append('icon', categoryData.icon);
    }

    return this.request<ClassCategory>('/api/classes/category', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: formData,
    });
  }

  async updateClassCategory(id: number, categoryData: UpdateCategoryRequest): Promise<ApiResponse<ClassCategory>> {
    const formData = new FormData();
    if (categoryData.name) formData.append('name', categoryData.name);
    if (categoryData.description) formData.append('description', categoryData.description);
    if (categoryData.icon) formData.append('icon', categoryData.icon);

    return this.request<ClassCategory>(`/api/classes/category/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: formData,
    });
  }

  async deleteClassCategory(id: number): Promise<ApiResponse<null>> {
    return this.request<null>(`/api/classes/category/${id}`, {
      method: 'DELETE',
    });
  }

  // Module Management endpoints
  async getModules(classId: string | number): Promise<ApiResponse<Module[]>> {
    return this.request<Module[]>(`/api/classes/modules/${classId}`);
  }

  async getModule(id: string): Promise<ApiResponse<Module>> {
    return this.request<Module>(`/api/classes/module/${id}`);
  }

  async createModule(data: CreateModuleRequest): Promise<ApiResponse<Module>> {
    return this.request<Module>('/api/classes/create/module', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateModule(id: string, data: UpdateModuleRequest): Promise<ApiResponse<Module>> {
    return this.request<Module>(`/api/classes/edit/module/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteModule(id: string): Promise<ApiResponse<null>> {
    return this.request<null>(`/api/classes/delete/module/${id}`, {
      method: 'DELETE',
    });
  }

  // Module Item Management endpoints
  async getModuleItems(moduleId: string): Promise<ApiResponse<ModuleItem[]>> {
    return this.request<ModuleItem[]>(`/api/classes/item-modules/${moduleId}`);
  }

  async getModuleItem(id: string): Promise<ApiResponse<ModuleItem>> {
    return this.request<ModuleItem>(`/api/classes/item-module/${id}`);
  }

  async createModuleItem(data: CreateModuleItemRequest): Promise<ApiResponse<ModuleItem>> {
    return this.request<ModuleItem>('/api/classes/create/item-module', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateModuleItem(id: string, data: Partial<CreateModuleItemRequest>): Promise<ApiResponse<ModuleItem>> {
    return this.request<ModuleItem>(`/api/classes/edit/item-module/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteModuleItem(id: number): Promise<ApiResponse<null>> {
    return this.request<null>(`/api/classes/delete/item-module/${id}`, {
      method: 'DELETE',
    });
  }

  // Project submission methods
  async submitProject(data: CreateProjectSubmissionRequest): Promise<ApiResponse<ProjectSubmission>> {
    const formData = new FormData();
    formData.append('project_page_id', data.project_page_id.toString());
    formData.append('title', data.title);
    formData.append('description', data.description);
    
    if (data.github_link) {
      formData.append('github_link', data.github_link);
    }
    if (data.deploy_link) {
      formData.append('deploy_link', data.deploy_link);
    }
    if (data.proposal_file) {
      formData.append('proposal_file', data.proposal_file);
    }

    return this.request<ProjectSubmission>('/api/projects/submit', {
      method: 'POST',
      body: formData,
    });
  }

  async getMySubmissions(): Promise<ApiResponse<ProjectSubmission[]>> {
    return this.request<ProjectSubmission[]>('/api/projects/my-submissions');
  }

  async getAllSubmissions(status?: string, page?: number, limit?: number): Promise<ApiResponse<{
    submissions: ProjectSubmission[];
    pagination: {
      current_page: number;
      per_page: number;
      total: number;
      total_pages: number;
    };
  }>> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());

    const queryString = params.toString();
    return this.request(`/api/projects/submissions${queryString ? `?${queryString}` : ''}`);
  }

  async getSubmissionDetail(id: number): Promise<ApiResponse<ProjectSubmission>> {
    return this.request<ProjectSubmission>(`/api/projects/submission/${id}`);
  }

  async reviewSubmission(id: number, data: ReviewProjectSubmissionRequest): Promise<ApiResponse<ProjectSubmission>> {
    return this.request<ProjectSubmission>(`/api/projects/submissions/${id}/review`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Payment endpoints
  async buyClass(classId: number): Promise<ApiResponse<MidtransResponse>> {
    return this.request<MidtransResponse>(`/api/classes/buy-class/${classId}`, {
      method: 'POST',
    });
  }

  async getTransactionStatus(orderId: string): Promise<ApiResponse<Transaction>> {
    return this.request<Transaction>(`/api/classes/transaction/${orderId}`);
  }

  // Add manual transaction status check
  async checkTransactionStatus(orderId: string): Promise<ApiResponse<Transaction>> {
    return this.request<Transaction>(`/api/classes/check-transaction/${orderId}`);
  }

  async getUserTransactions(): Promise<ApiResponse<Transaction[]>> {
    return this.request<Transaction[]>('/api/classes/transactions');
  }
}

export const apiClient = new ApiClient(API_BASE_URL);