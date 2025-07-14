const API_BASE_URL = 'http://localhost:8080/api';

// Configuração do axios-like fetch
class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
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

  // Auth endpoints
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

  // User endpoints
  async getCurrentUser() {
    return this.request<UserResponse>('/users/me');
  }

  async getUserById(id: string) {
    return this.request<UserResponse>(`/users/${id}`);
  }

  async updateUser(id: string, userData: Partial<UserResponse>) {
    return this.request<UserResponse>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: string) {
    return this.request<void>(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  async searchUsers(name: string) {
    return this.request<UserResponse[]>(`/users/search?name=${encodeURIComponent(name)}`);
  }

  // Post endpoints
  async getPosts(page = 0, size = 10) {
    return this.request<PostsResponse>(`/posts?page=${page}&size=${size}`);
  }

  async getPostById(id: string) {
    return this.request<PostResponse>(`/posts/${id}`);
  }

  async getUserPosts(userId: string, page = 0, size = 10) {
    return this.request<PostsResponse>(`/posts/user/${userId}?page=${page}&size=${size}`);
  }

  async createPost(content: string, imageUrl?: string) {
    return this.request<PostResponse>('/posts', {
      method: 'POST',
      body: JSON.stringify({ content, imageUrl }),
    });
  }

  async updatePost(id: string, content: string, imageUrl?: string) {
    return this.request<PostResponse>(`/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ content, imageUrl }),
    });
  }

  async deletePost(id: string) {
    return this.request<void>(`/posts/${id}`, {
      method: 'DELETE',
    });
  }

  // Like endpoints
  async toggleLike(postId: string) {
    return this.request<{ isLiked: boolean; message: string }>(`/likes/toggle/${postId}`, {
      method: 'POST',
    });
  }

  async checkLike(postId: string) {
    return this.request<{ isLiked: boolean }>(`/likes/check/${postId}`);
  }

  // Comment endpoints
  async createComment(content: string, postId: string) {
    return this.request<CommentResponse>('/comments', {
      method: 'POST',
      body: JSON.stringify({ content, postId }),
    });
  }

  async getPostComments(postId: string) {
    return this.request<CommentResponse[]>(`/comments/post/${postId}`);
  }

  async updateComment(id: string, content: string) {
    return this.request<CommentResponse>(`/comments/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    });
  }

  async deleteComment(id: string) {
    return this.request<void>(`/comments/${id}`, {
      method: 'DELETE',
    });
  }
}

// Types
export interface AuthResponse {
  token: string;
  type: string;
  user: UserResponse;
}

export interface UserResponse {
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

export interface PostResponse {
  id: number;
  content: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  user: UserResponse;
  likesCount: number;
  commentsCount: number;
  isLikedByCurrentUser: boolean;
}

export interface PostsResponse {
  content: PostResponse[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface CommentResponse {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: UserResponse;
  postId: number;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

const apiService = new ApiService(API_BASE_URL);
export default apiService;