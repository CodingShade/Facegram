import React, { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, Loader2 } from 'lucide-react';
import CreatePost from './CreatePost';
import PostCard from './PostCard';
import apiService, { PostResponse } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

interface Post {
  id: string;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    joinDate: string;
    friendsCount: number;
    postsCount: number;
  };
  content: string;
  image?: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  comments: any[];
}

function convertPostResponse(postResponse: PostResponse): Post {
  return {
    id: postResponse.id.toString(),
    userId: postResponse.user.id.toString(),
    user: {
      id: postResponse.user.id.toString(),
      name: postResponse.user.name,
      email: postResponse.user.email,
      avatar: postResponse.user.avatarUrl || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
      joinDate: postResponse.user.createdAt,
      friendsCount: 0,
      postsCount: postResponse.user.postsCount || 0
    },
    content: postResponse.content,
    image: postResponse.imageUrl,
    timestamp: postResponse.createdAt,
    likes: postResponse.likesCount,
    isLiked: postResponse.isLikedByCurrentUser,
    comments: [] // Será carregado separadamente se necessário
  };
}

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [feedFilter, setFeedFilter] = useState<'all' | 'trending' | 'friends'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const loadPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiService.getPosts(0, 20);
      const convertedPosts = response.content.map(convertPostResponse);
      setPosts(convertedPosts);
    } catch (err) {
      console.error('Failed to load posts:', err);
      setError('Erro ao carregar posts. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleCreatePost = async (content: string, image?: string) => {
    try {
      const newPostResponse = await apiService.createPost(content, image);
      const newPost = convertPostResponse(newPostResponse);
      setPosts([newPost, ...posts]);
    } catch (err) {
      console.error('Failed to create post:', err);
      setError('Erro ao criar post. Tente novamente.');
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const response = await apiService.toggleLike(postId);
      
      setPosts(posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            isLiked: response.isLiked,
            likes: response.isLiked ? post.likes + 1 : post.likes - 1
          };
        }
        return post;
      }));
    } catch (err) {
      console.error('Failed to toggle like:', err);
    }
  };

  const handleComment = async (postId: string, commentContent: string) => {
    try {
      await apiService.createComment(commentContent, postId);
      // Recarregar o post para obter comentários atualizados
      // Por simplicidade, vamos apenas simular a adição do comentário
      setPosts(posts.map(post => {
        if (post.id === postId) {
          const newComment = {
            id: Date.now().toString(),
            userId: user!.id,
            user: {
              id: user!.id,
              name: user!.name,
              email: user!.email,
              avatar: user!.avatar || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
              joinDate: user!.joinDate,
              friendsCount: user!.friendsCount,
              postsCount: user!.postsCount
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
    } catch (err) {
      console.error('Failed to create comment:', err);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await apiService.deletePost(postId);
      setPosts(posts.filter(post => post.id !== postId));
    } catch (err) {
      console.error('Failed to delete post:', err);
      setError('Erro ao excluir post. Tente novamente.');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-red-500" />
          <span className="ml-2 text-gray-600">Carregando posts...</span>
        </div>
      </div>
    );
  }

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

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
          <button
            onClick={loadPosts}
            className="mt-2 text-red-600 hover:text-red-700 font-medium"
          >
            Tentar novamente
          </button>
        </div>
      )}

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
        
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum post encontrado</h3>
            <p className="text-gray-500">Seja o primeiro a compartilhar algo!</p>
          </div>
        ) : (
          posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              onLike={handleLike}
              onComment={handleComment}
              onDelete={handleDeletePost}
            />
          ))
        )}
      </div>
    </div>
  );
}