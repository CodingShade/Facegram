import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import apiService, { UserResponse } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  coverPhoto?: string;
  bio?: string;
  location?: string;
  joinDate: string;
  friendsCount: number;
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// API Service
const API_BASE_URL = 'http://localhost:8080/api';

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  async login(email: string, password: string) {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: RegisterData) {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getCurrentUser() {
    return this.request<UserResponse>('/users/me');
  }

  async updateUser(id: string, userData: Partial<UserResponse>) {
    return this.request<UserResponse>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }
}

// Types
interface AuthResponse {
  token: string;
  type: string;
  user: UserResponse;
}

interface UserResponse {
  id: number;
  name: string;
  email: string;
  bio?: string;
  location?: string;
  avatarUrl?: string;
  coverPhotoUrl?: string;
  createdAt: string;
  postsCount: number;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  coverPhoto?: string;
  bio?: string;
  location?: string;
  joinDate: string;
  friendsCount: number;
  postsCount: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, avatarUrl?: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const apiService = new ApiService(API_BASE_URL);

function convertUserResponse(userResponse: UserResponse): User {
  return {
    id: userResponse.id.toString(),
    name: userResponse.name,
    email: userResponse.email,
    avatar: userResponse.avatarUrl || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    coverPhoto: userResponse.coverPhotoUrl,
    bio: userResponse.bio,
    location: userResponse.location,
    joinDate: userResponse.createdAt,
    friendsCount: 0, // Será implementado futuramente
    postsCount: userResponse.postsCount || 0
  };
}
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Verificar se há token salvo ao inicializar
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoading(true);
      apiService.setToken(token);
      apiService.getCurrentUser()
        .then(userResponse => {
          setUser(convertUserResponse(userResponse));
        })
        .catch(() => {
          // Token inválido, limpar
          localStorage.removeItem('token');
          apiService.clearToken();
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, []);

  // Verificar se há token salvo ao inicializar
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoading(true);
      apiService.setToken(token);
      apiService.getCurrentUser()
        .then(userResponse => {
          setUser(convertUserResponse(userResponse));
        })
        .catch(() => {
          // Token inválido, limpar
          localStorage.removeItem('token');
          apiService.clearToken();
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await apiService.login(email, password);
      apiService.setToken(response.token);
      setUser(convertUserResponse(response.user));
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, avatarUrl?: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const registerData = { name, email, password };
      const response = await apiService.register(registerData);
      
      apiService.setToken(response.token);
      
      // Se foi fornecida uma URL de avatar, atualizar o perfil
      if (avatarUrl) {
        try {
          const updatedUser = await apiService.updateUser(response.user.id.toString(), {
            ...response.user,
            avatarUrl
          });
          setUser(convertUserResponse(updatedUser));
        } catch (updateError) {
          console.error('Failed to update avatar:', updateError);
          // Mesmo se falhar ao atualizar o avatar, o usuário foi criado com sucesso
          setUser(convertUserResponse(response.user));
        }
      } else {
        setUser(convertUserResponse(response.user));
      }
      
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {

  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
  const register = async (name: string, email: string, password: string, avatarUrl?: string): Promise<boolean> => {
    
    setIsLoading(true);
      
      const updatedUser = await apiService.updateUser(user.id, updateData);
      setUser(convertUserResponse(updatedUser));
      return true;
    } catch (error) {
      console.error('Profile update failed:', error);
      return false;
    try {
      const registerData = { name, email, password };
      const response = await apiService.register(registerData);
      
      apiService.setToken(response.token);
      
      // Se foi fornecida uma URL de avatar, atualizar o perfil
      if (avatarUrl) {
        try {
          const updatedUser = await apiService.updateUser(response.user.id.toString(), {
            ...response.user,
            avatarUrl
          });
          setUser(convertUserResponse(updatedUser));
        } catch (updateError) {
          console.error('Failed to update avatar:', updateError);
          // Mesmo se falhar ao atualizar o avatar, o usuário foi criado com sucesso
          setUser(convertUserResponse(response.user));
        }
      } else {
        setUser(convertUserResponse(response.user));
      }
      
      return true;
    } catch (error) {
      return false;
  };

  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    if (!user) return false;
    
    setIsLoading(true);
    
    try {
      const updateData = {
        name: data.name || user.name,
        email: data.email || user.email,
        bio: data.bio,
        location: data.location,
        avatarUrl: data.avatar,
        coverPhotoUrl: data.coverPhoto
      };
      
      const updatedUser = await apiService.updateUser(user.id, updateData);
      setUser(convertUserResponse(updatedUser));
      return true;
    } catch (error) {
      console.error('Profile update failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    apiService.clearToken();
    apiService.clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}