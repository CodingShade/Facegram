import React, { useState } from 'react';
import { Sparkles, TrendingUp } from 'lucide-react';
import CreatePost from './CreatePost';
import PostCard from './PostCard';
import { Post, User } from '../../types';

const mockUsers: User[] = [
  {
    id: '2',
    name: 'João Santos',
    email: 'joao@example.com',
    avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400',
    joinDate: '2023-02-10',
    friendsCount: 156,
    postsCount: 45
  },
  {
    id: '3',
    name: 'Ana Costa',
    email: 'ana@example.com',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400',
    joinDate: '2023-03-05',
    friendsCount: 289,
    postsCount: 67
  }
];

const initialPosts: Post[] = [
  {
    id: '1',
    userId: '2',
    user: mockUsers[0],
    content: 'Que dia lindo para uma caminhada no parque! 🌞 Aproveitando cada momento desta manhã perfeita.',
    image: 'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=600',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    likes: 24,
    isLiked: false,
    comments: [
      {
        id: '1',
        userId: '3',
        user: mockUsers[1],
        content: 'Que foto incrível! Onde foi tirada?',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
      }
    ]
  },
  {
    id: '2',
    userId: '3',
    user: mockUsers[1],
    content: 'Finalmente terminei meu projeto de fotografia! Foram meses de trabalho, mas o resultado valeu a pena. Obrigada a todos que me apoiaram nessa jornada! 📸✨',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    likes: 42,
    isLiked: true,
    comments: []
  }
];

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [feedFilter, setFeedFilter] = useState<'all' | 'trending' | 'friends'>('all');

  const handleCreatePost = (content: string, image?: string) => {
    const newPost: Post = {
      id: Date.now().toString(),
      userId: '1',
      user: {
        id: '1',
        name: 'Maria Silva',
        email: 'maria@example.com',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
        joinDate: '2023-01-15',
        friendsCount: 234,
        postsCount: 89
      },
      content,
      image,
      timestamp: new Date().toISOString(),
      likes: 0,
      isLiked: false,
      comments: []
    };

    setPosts([newPost, ...posts]);
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };

  const handleComment = (postId: string, commentContent: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const newComment = {
          id: Date.now().toString(),
          userId: '1',
          user: {
            id: '1',
            name: 'Maria Silva',
            email: 'maria@example.com',
            avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
            joinDate: '2023-01-15',
            friendsCount: 234,
            postsCount: 89
          },
          content: commentContent,
          timestamp: new Date().toISOString()
        };
        
        return {
          ...post,
          comments: [...post.comments, newComment]
        };
      }
      return post;
    }));
  };

  const handleDeletePost = (postId: string) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Feed Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Feed</h1>
            <p className="text-gray-600">Veja o que está acontecendo</p>
          </div>
          
          {/* Feed Filters */}
          <div className="flex space-x-2 bg-gray-50 rounded-2xl p-2">
            <button
              onClick={() => setFeedFilter('all')}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                feedFilter === 'all'
                  ? 'bg-white text-red-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFeedFilter('trending')}
              className={`flex items-center space-x-1 px-4 py-2 rounded-xl font-medium transition-all ${
                feedFilter === 'trending'
                  ? 'bg-white text-red-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Trending</span>
            </button>
            <button
              onClick={() => setFeedFilter('friends')}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                feedFilter === 'friends'
                  ? 'bg-white text-red-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
              }`}
            >
              Amigos
            </button>
          </div>
        </div>
      </div>

      <CreatePost onCreatePost={handleCreatePost} />
      
      <div className="space-y-6">
        {feedFilter === 'trending' && (
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200">
            <div className="flex items-center space-x-2 mb-2">
              <Sparkles className="w-5 h-5 text-orange-500" />
              <h3 className="font-semibold text-orange-900">Posts em Alta</h3>
            </div>
            <p className="text-orange-700 text-sm">
              Veja os posts mais populares da sua rede
            </p>
          </div>
        )}
        
        {posts.map(post => (
          <PostCard
            key={post.id}
            post={post}
            onLike={handleLike}
            onComment={handleComment}
            onDelete={handleDeletePost}
          />
        ))}
      </div>
    </div>
  );
}