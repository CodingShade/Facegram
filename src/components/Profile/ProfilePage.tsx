import { useState, useEffect } from 'react';
import { Camera, MapPin, Calendar, Edit3, Settings, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import PostCard from '../Feed/PostCard';
import apiService, { PostResponse } from '../../services/api';

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
    comments: []
  };
}

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('posts');
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    location: user?.location || '',
    avatar: user?.avatar || '',
    coverPhoto: user?.coverPhoto || ''
  });

  const loadUserPosts = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const response = await apiService.getUserPosts(user.id, 0, 20);
      const convertedPosts = response.content.map(convertPostResponse);
      setPosts(convertedPosts);
    } catch (err) {
      console.error('Failed to load user posts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name,
        bio: user.bio || '',
        location: user.location || '',
        avatar: user.avatar || '',
        coverPhoto: user.coverPhoto || ''
      });
      loadUserPosts();
    }
  }, [user]);

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
    }
  };

  const handleSaveProfile = async () => {
    const success = await updateProfile({
      name: editForm.name,
      bio: editForm.bio,
      location: editForm.location,
      avatar: editForm.avatar,
      coverPhoto: editForm.coverPhoto
    });

    if (success) {
      setIsEditing(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Cover Photo */}
      <div className="relative h-64 bg-gradient-to-r from-red-400 to-pink-500 rounded-lg overflow-hidden mb-6">
        {(isEditing ? editForm.coverPhoto : user.coverPhoto) && (
          <img
            src={isEditing ? editForm.coverPhoto : user.coverPhoto}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        {isEditing && (
          <div className="absolute bottom-4 right-4">
            <input
              type="url"
              value={editForm.coverPhoto}
              onChange={(e) => setEditForm({ ...editForm, coverPhoto: e.target.value })}
              placeholder="URL da foto de capa"
              className="px-3 py-2 bg-white bg-opacity-90 rounded-lg text-sm"
            />
          </div>
        )}
        {!isEditing && (
          <button className="absolute bottom-4 right-4 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-all">
            <Camera className="w-4 h-4" />
            <span className="text-sm font-medium">Alterar capa</span>
          </button>
        )}
      </div>

      {/* Profile Info */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-start space-x-6">
          <div className="relative">
            <img
              src={isEditing ? editForm.avatar : user.avatar}
              alt={user.name}
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
            />
            {isEditing && (
              <div className="absolute -bottom-2 -right-2">
                <input
                  type="url"
                  value={editForm.avatar}
                  onChange={(e) => setEditForm({ ...editForm, avatar: e.target.value })}
                  placeholder="URL do avatar"
                  className="w-32 px-2 py-1 text-xs bg-white border rounded"
                />
              </div>
            )}
            {!isEditing && (
              <button className="absolute bottom-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <div>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="text-3xl font-bold text-gray-800 mb-2 border-b-2 border-gray-300 focus:border-red-500 outline-none"
                  />
                ) : (
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">{user.name}</h1>
                )}
                
                {isEditing ? (
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    placeholder="Sua bio..."
                    className="text-gray-600 mb-3 w-full border border-gray-300 rounded p-2 resize-none"
                    rows={2}
                  />
                ) : (
                  <p className="text-gray-600 mb-3">{user.bio || 'Nenhuma bio adicionada'}</p>
                )}
              </div>
              
              <div className="flex space-x-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSaveProfile}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                    >
                      <span>Salvar</span>
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex items-center space-x-2 px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors"
                    >
                      <span>Cancelar</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Editar perfil</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors">
                      <Settings className="w-4 h-4" />
                      <span>Configurações</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.location}
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  placeholder="Sua localização"
                  className="border border-gray-300 rounded px-2 py-1"
                />
              ) : (
                user.location && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{user.location}</span>
                  </div>
                )
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
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-red-500" />
                  <span className="ml-2 text-gray-600">Carregando posts...</span>
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Edit3 className="w-6 h-6 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma publicação ainda</h3>
                  <p className="text-gray-500">Compartilhe algo para aparecer aqui!</p>
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
          )}

          {activeTab === 'photos' && (
            <div className="grid grid-cols-3 gap-4">
              {posts.filter(post => post.image).length === 0 ? (
                <div className="col-span-3 text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Camera className="w-6 h-6 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma foto ainda</h3>
                  <p className="text-gray-500">Compartilhe fotos para aparecerem aqui!</p>
                </div>
              ) : (
                posts.filter(post => post.image).map((post) => (
                  <div key={post.id} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={post.image}
                      alt="Post photo"
                      className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                    />
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'friends' && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Sistema de amigos em desenvolvimento</h3>
              <p className="text-gray-500">Esta funcionalidade estará disponível em breve!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}