import React, { useState } from 'react';
import { Search, UserPlus, MessageCircle, MoreHorizontal, Users, UserCheck, Clock } from 'lucide-react';
import { User } from '../../types';

const mockFriends: User[] = [
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
  },
  {
    id: '4',
    name: 'Carlos Oliveira',
    email: 'carlos@example.com',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
    joinDate: '2023-01-20',
    friendsCount: 198,
    postsCount: 34
  }
];

const friendRequests: User[] = [
  {
    id: '5',
    name: 'Lucia Ferreira',
    email: 'lucia@example.com',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    joinDate: '2023-04-01',
    friendsCount: 87,
    postsCount: 23
  },
  {
    id: '6',
    name: 'Pedro Almeida',
    email: 'pedro@example.com',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
    joinDate: '2023-03-15',
    friendsCount: 145,
    postsCount: 56
  }
];

const suggestions: User[] = [
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
  }
];

export default function FriendsPage() {
  const [activeTab, setActiveTab] = useState('friends');
  const [searchTerm, setSearchTerm] = useState('');

  const tabs = [
    { id: 'friends', label: 'Amigos', count: mockFriends.length, icon: Users },
    { id: 'requests', label: 'Solicitações', count: friendRequests.length, icon: Clock },
    { id: 'suggestions', label: 'Sugestões', count: suggestions.length, icon: UserPlus }
  ];

  const filteredFriends = mockFriends.filter(friend =>
    friend.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderFriendCard = (user: User, type: 'friend' | 'request' | 'suggestion') => (
    <div key={user.id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg hover:border-red-200 transition-all duration-300">
      <div className="flex items-center space-x-5">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-16 h-16 rounded-2xl object-cover ring-2 ring-gray-100 group-hover:ring-red-200 transition-all"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900">{user.name}</h3>
            {type === 'request' && (
              <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full font-medium">
                Pendente
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mb-4">{user.friendsCount} amigos</p>
          <div className="flex items-center space-x-3">
            {type === 'friend' && (
              <>
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-full font-medium transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  <span>Mensagem</span>
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </>
            )}
            
            {type === 'request' && (
              <>
                <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-full font-medium transition-colors">
                  Aceitar
                </button>
                <button className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm rounded-full font-medium transition-colors">
                  Recusar
                </button>
              </>
            )}
            
            {type === 'suggestion' && (
              <button className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-full font-medium transition-colors">
                <UserPlus className="w-4 h-4" />
                <span>Adicionar</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Amigos</h1>
            <p className="text-gray-600">Gerencie suas conexões</p>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative max-w-md mb-8">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar amigos..."
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-red-500 focus:bg-white transition-all text-gray-900 placeholder-gray-500"
          />
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 bg-gray-50 rounded-2xl p-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-red-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                <span className={`px-2 py-1 text-xs rounded-full font-semibold ${
                  activeTab === tab.id
                    ? 'bg-red-100 text-red-600'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activeTab === 'friends' && (
          <>
            {filteredFriends.length > 0 ? (
              filteredFriends.map(friend => renderFriendCard(friend, 'friend'))
            ) : (
              <div className="col-span-full bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  {searchTerm ? 'Nenhum amigo encontrado' : 'Você ainda não tem amigos'}
                </h3>
                <p className="text-gray-600">
                  {searchTerm 
                    ? 'Tente buscar por outro nome'
                    : 'Comece adicionando pessoas que você conhece'
                  }
                </p>
              </div>
            )}
          </>
        )}

        {activeTab === 'requests' && (
          <>
            {friendRequests.length > 0 ? (
              friendRequests.map(request => renderFriendCard(request, 'request'))
            ) : (
              <div className="col-span-full bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  Nenhuma solicitação pendente
                </h3>
                <p className="text-gray-600">
                  Quando alguém enviar uma solicitação de amizade, ela aparecerá aqui
                </p>
              </div>
            )}
          </>
        )}

        {activeTab === 'suggestions' && (
          <>
            {suggestions.map(suggestion => renderFriendCard(suggestion, 'suggestion'))}
          </>
        )}
      </div>
    </div>
  );
}