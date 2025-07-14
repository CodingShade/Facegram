import React, { useState } from 'react';
import { User, Mail, MapPin, FileText, Camera, Save, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function AccountSettings() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    location: user?.location || '',
    avatarUrl: user?.avatar || ''
  });

  const handleSave = () => {
    // Implementar lógica de salvamento
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      bio: user?.bio || '',
      location: user?.location || '',
      avatarUrl: user?.avatar || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-8">
      {/* Profile Picture Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Foto do Perfil</h3>
        
        <div className="flex items-center space-x-6">
          <div className="relative">
            <img
              src={formData.avatarUrl}
              alt="Profile"
              className="w-24 h-24 rounded-2xl object-cover ring-4 ring-gray-100"
            />
            <button className="absolute -bottom-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Alterar foto do perfil</h4>
            <p className="text-sm text-gray-600 mb-4">
              Recomendamos uma imagem de pelo menos 400x400 pixels
            </p>
            <div className="flex space-x-3">
              <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors">
                Fazer upload
              </button>
              <button className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors">
                Remover
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Informações Pessoais</h3>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
            >
              <User className="w-4 h-4" />
              <span>Editar</span>
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Salvar</span>
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Cancelar</span>
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
              <User className="w-4 h-4" />
              <span>Nome completo</span>
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
              />
            ) : (
              <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                {formData.name}
              </div>
            )}
          </div>

          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </label>
            {isEditing ? (
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
              />
            ) : (
              <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                {formData.email}
              </div>
            )}
          </div>

          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
              <MapPin className="w-4 h-4" />
              <span>Localização</span>
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Cidade, Estado"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
              />
            ) : (
              <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                {formData.location || 'Não informado'}
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
              <FileText className="w-4 h-4" />
              <span>Bio</span>
            </label>
            {isEditing ? (
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Conte um pouco sobre você..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all resize-none"
              />
            ) : (
              <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 min-h-[100px]">
                {formData.bio || 'Nenhuma bio adicionada'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Account Statistics */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Estatísticas da Conta</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl border border-red-100">
            <div className="text-3xl font-bold text-red-600 mb-2">{user?.postsCount}</div>
            <div className="text-sm text-red-700 font-medium">Publicações</div>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
            <div className="text-3xl font-bold text-blue-600 mb-2">{user?.friendsCount}</div>
            <div className="text-sm text-blue-700 font-medium">Amigos</div>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100">
            <div className="text-3xl font-bold text-green-600 mb-2">1.2k</div>
            <div className="text-sm text-green-700 font-medium">Curtidas</div>
          </div>
        </div>
      </div>
    </div>
  );
}