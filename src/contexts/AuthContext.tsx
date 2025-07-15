import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../types';
import apiService from '../services/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, avatarUrl?: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Verificar se há token salvo ao inicializar
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadCurrentUser();
    }
  }, []);

  const loadCurrentUser = async () => {
    try {
      const userData = await apiService.getCurrentUser();
      const convertedUser: User = {
        id: userData.id.toString(),
        name: userData.name,
        email: userData.email,
        avatar: userData.avatarUrl || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
        coverPhoto: userData.coverPhotoUrl,
        bio: userData.bio,
        location: userData.location,
        joinDate: userData.createdAt,
        friendsCount: 234, // Mock data
        postsCount: userData.postsCount || 0
      };
      setUser(convertedUser);
    } catch (error) {
      console.error('Failed to load current user:', error);
      localStorage.removeItem('token');
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await apiService.login(email, password);
      
      // Salvar token
      apiService.setToken(response.token);
      
      // Converter dados do usuário
      const convertedUser: User = {
        id: response.user.id.toString(),
        name: response.user.name,
        email: response.user.email,
        avatar: response.user.avatarUrl || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
        coverPhoto: response.user.coverPhotoUrl,
        bio: response.user.bio,
        location: response.user.location,
        joinDate: response.user.createdAt,
        friendsCount: 234, // Mock data
        postsCount: response.user.postsCount || 0
      };
      
      setUser(convertedUser);
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      setIsLoading(false);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string, avatarUrl?: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const registerData = {
        name,
        email,
        password
      };

      const response = await apiService.register(registerData);
      
      // Salvar token
      apiService.setToken(response.token);
      
      // Converter dados do usuário
      let convertedUser: User = {
        id: response.user.id.toString(),
        name: response.user.name,
        email: response.user.email,
        avatar: response.user.avatarUrl || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
        coverPhoto: response.user.coverPhotoUrl,
        bio: response.user.bio,
        location: response.user.location,
        joinDate: response.user.createdAt,
        friendsCount: 0,
        postsCount: 0
      };

      // Se foi fornecida uma URL de avatar, atualizar o perfil
      if (avatarUrl && avatarUrl.trim()) {
        try {
          const updatedUser = await apiService.updateUser(response.user.id.toString(), {
            ...response.user,
            avatarUrl: avatarUrl.trim()
          });
          convertedUser.avatar = updatedUser.avatarUrl || convertedUser.avatar;
        } catch (updateError) {
          console.warn('Failed to update avatar, but user was created:', updateError);
        }
      }
      
      setUser(convertedUser);
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      setIsLoading(false);
      return false;
    }
  };

  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    if (!user) return false;

    try {
      const updateData = {
        name: data.name || user.name,
        bio: data.bio,
        location: data.location,
        avatarUrl: data.avatar,
        coverPhotoUrl: data.coverPhoto
      };

      const updatedUser = await apiService.updateUser(user.id, updateData);
      
      const convertedUser: User = {
        ...user,
        name: updatedUser.name,
        bio: updatedUser.bio,
        location: updatedUser.location,
        avatar: updatedUser.avatarUrl || user.avatar,
        coverPhoto: updatedUser.coverPhotoUrl
      };
      
      setUser(convertedUser);
      return true;
    } catch (error) {
      console.error('Profile update failed:', error);
      return false;
    }
  };

  const logout = () => {
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