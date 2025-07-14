export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  coverPhoto?: string;
  bio?: string;
  location?: string;
  joinDate: string;
  friendsCount: number;
  postsCount: number;
}

export interface Post {
  id: string;
  userId: string;
  user: User;
  content: string;
  image?: string;
  timestamp: string;
  likes: number;
  comments: Comment[];
  isLiked: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  user: User;
  content: string;
  timestamp: string;
}

export interface Friend {
  id: string;
  user: User;
  status: 'pending' | 'accepted' | 'blocked';
  timestamp: string;
}