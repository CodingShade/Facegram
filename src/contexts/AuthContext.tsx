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
  postsCount: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, avatarUrl?: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
      return false;
    } finally {
      setIsLoading(false);
    }
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