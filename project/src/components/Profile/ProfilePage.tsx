import { useState } from 'react';
import { Camera, MapPin, Calendar, Edit3, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import PostCard from '../Feed/PostCard';
import { Post } from '../../types';

const userPosts: Post[] = [
  {
    id: '3',
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
    content: 'Explorando novos lugares e capturando momentos únicos! A fotografia me permite ver o mundo de uma forma completamente diferente. 📷✨',
    image: 'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=600',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 67,
    isLiked: true,
    comments: []
  }
];

export default function ProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('posts');
  const [posts, setPosts] = useState<Post[]>(userPosts);

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
          user: user!,
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

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Cover Photo */}
      <div className="relative h-64 bg-gradient-to-r from-red-400 to-pink-500 rounded-lg overflow-hidden mb-6">
        {user.coverPhoto && (
          <img
            src={user.coverPhoto}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <button className="absolute bottom-4 right-4 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-all">
          <Camera className="w-4 h-4" />
          <span className="text-sm font-medium">Alterar capa</span>
        </button>
      </div>

      {/* Profile Info */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-start space-x-6">
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
            />
            <button className="absolute bottom-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors">
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{user.name}</h1>
                <p className="text-gray-600 mb-3">{user.bio}</p>
              </div>
              <div className="flex space-x-3">
                <button className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors">
                  <Edit3 className="w-4 h-4" />
                  <span>Editar perfil</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors">
                  <Settings className="w-4 h-4" />
                  <span>Configurações</span>
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
              {user.location && (
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{user.location}</span>
                </div>
              )}
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Entrou em {new Date(user.joinDate).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>

            <div className="flex space-x-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">{user.postsCount}</div>
                <div className="text-sm text-gray-600">Publicações</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">{user.friendsCount}</div>
                <div className="text-sm text-gray-600">Amigos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">1.2k</div>
                <div className="text-sm text-gray-600">Seguidores</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('posts')}
            className={`px-6 py-4 font-medium transition-colors ${
              activeTab === 'posts'
                ? 'text-red-600 border-b-2 border-red-500'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Publicações
          </button>
          <button
            onClick={() => setActiveTab('photos')}
            className={`px-6 py-4 font-medium transition-colors ${
              activeTab === 'photos'
                ? 'text-red-600 border-b-2 border-red-500'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Fotos
          </button>
          <button
            onClick={() => setActiveTab('friends')}
            className={`px-6 py-4 font-medium transition-colors ${
              activeTab === 'friends'
                ? 'text-red-600 border-b-2 border-red-500'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Amigos
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'posts' && (
            <div className="space-y-6">
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
          )}

          {activeTab === 'photos' && (
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={`https://images.pexels.com/photos/${1323550 + i}/pexels-photo-${1323550 + i}.jpeg?auto=compress&cs=tinysrgb&w=300`}
                    alt={`Photo ${i}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                  />
                </div>
              ))}
            </div>
          )}

          {activeTab === 'friends' && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-4 text-center hover:bg-gray-100 transition-colors cursor-pointer">
                  <img
                    src={`https://images.pexels.com/photos/${774909 + i}/pexels-photo-${774909 + i}.jpeg?auto=compress&cs=tinysrgb&w=200`}
                    alt={`Friend ${i}`}
                    className="w-16 h-16 rounded-full object-cover mx-auto mb-3"
                  />
                  <h3 className="font-medium text-gray-800">Amigo {i}</h3>
                  <p className="text-sm text-gray-600">12 amigos em comum</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}