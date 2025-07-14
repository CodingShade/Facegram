import { useState } from 'react';
import { Search, UserPlus, Users, Sparkles, TrendingUp } from 'lucide-react';
import { User } from '../../types';

const suggestedFriends: User[] = [
  {
    id: '7',
    name: 'Mariana Souza',
    email: 'mariana@example.com',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
    joinDate: '2023-02-28',
    friendsCount: 234,
    postsCount: 78
  },
  {
    id: '8',
    name: 'Rafael Lima',
    email: 'rafael@example.com',
    avatar: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=400',
    joinDate: '2023-03-10',
    friendsCount: 167,
    postsCount: 42
  },
  {
    id: '9',
    name: 'Camila Santos',
    email: 'camila@example.com',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    joinDate: '2023-04-01',
    friendsCount: 189,
    postsCount: 56
  },
  {
    id: '10',
    name: 'Lucas Oliveira',
    email: 'lucas@example.com',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
    joinDate: '2023-03-15',
    friendsCount: 145,
    postsCount: 34
  }
];

const trendingUsers: User[] = [
  {
    id: '11',
    name: 'Isabella Costa',
    email: 'isabella@example.com',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400',
    joinDate: '2023-01-20',
    friendsCount: 892,
    postsCount: 156
  },
  {
    id: '12',
    name: 'Gabriel Ferreira',
    email: 'gabriel@example.com',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
    joinDate: '2023-02-15',
    friendsCount: 567,
    postsCount: 89
  }
];

export default function AddFriendsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [addedFriends, setAddedFriends] = useState<Set<string>>(new Set());

  const handleAddFriend = (userId: string) => {
    setAddedFriends(prev => new Set([...prev, userId]));
  };

  const renderUserCard = (user: User, isTrending = false) => (
    <div key={user.id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg hover:border-red-200 transition-all duration-300">
      <div className="flex items-start space-x-4">
        <div className="relative">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-gray-100 group-hover:ring-red-200 transition-all"
          />
          {isTrending && (
            <div className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
              <TrendingUp className="w-3 h-3" />
              <span>Hot</span>
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900 truncate">{user.name}</h3>
            {addedFriends.has(user.id) ? (
              <div className="flex items-center space-x-1 text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm font-medium">
                <Users className="w-4 h-4" />
                <span>Adicionado</span>
              </div>
            ) : (
              <button
                onClick={() => handleAddFriend(user.id)}
                className="flex items-center space-x-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                <span>Adicionar</span>
              </button>
            )}
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
            <span>{user.friendsCount} amigos</span>
            <span>•</span>
            <span>{user.postsCount} posts</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <img
                  key={i}
                  src={`https://images.pexels.com/photos/${774909 + i}/pexels-photo-${774909 + i}.jpeg?auto=compress&cs=tinysrgb&w=100`}
                  alt={`Mutual friend ${i}`}
                  className="w-6 h-6 rounded-full border-2 border-white object-cover"
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">3 amigos em comum</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl">
            <UserPlus className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Adicionar Amigos</h1>
            <p className="text-gray-600">Encontre pessoas que você conhece</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar pessoas..."
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-red-500 focus:bg-white transition-all text-gray-900 placeholder-gray-500"
          />
        </div>
      </div>

      {/* Trending Users */}
      <div className="mb-10">
        <div className="flex items-center space-x-2 mb-6">
          <Sparkles className="w-5 h-5 text-orange-500" />
          <h2 className="text-xl font-bold text-gray-900">Em Alta</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-orange-200 to-transparent"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {trendingUsers.map(user => renderUserCard(user, true))}
        </div>
      </div>

      {/* Suggested Friends */}
      <div>
        <div className="flex items-center space-x-2 mb-6">
          <Users className="w-5 h-5 text-red-500" />
          <h2 className="text-xl font-bold text-gray-900">Sugestões para Você</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-red-200 to-transparent"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {suggestedFriends.map(user => renderUserCard(user))}
        </div>
      </div>

      {/* Empty State */}
      {searchTerm && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum resultado encontrado</h3>
          <p className="text-gray-500">Tente buscar por outro nome</p>
        </div>
      )}
    </div>
  );
}