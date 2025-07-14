import React, { useState } from 'react';
import { X, Image, Smile, MapPin, Users, Globe, Lock, Camera } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePost: (content: string, image?: string, privacy?: string) => void;
}

export default function CreatePostModal({ isOpen, onClose, onCreatePost }: CreatePostModalProps) {
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [privacy, setPrivacy] = useState<'public' | 'friends' | 'private'>('public');
  const { user } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onCreatePost(content, selectedImage || undefined, privacy);
      setContent('');
      setSelectedImage(null);
      setPrivacy('public');
      onClose();
    }
  };

  const handleImageSelect = () => {
    const images = [
      'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=600'
    ];
    const randomImage = images[Math.floor(Math.random() * images.length)];
    setSelectedImage(randomImage);
  };

  const privacyOptions = [
    { id: 'public', label: 'Público', icon: Globe, description: 'Qualquer pessoa pode ver' },
    { id: 'friends', label: 'Amigos', icon: Users, description: 'Apenas seus amigos' },
    { id: 'private', label: 'Privado', icon: Lock, description: 'Apenas você' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Criar Publicação</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          {/* User Info */}
          <div className="flex items-center space-x-3 p-6 pb-4">
            <img
              src={user?.avatar}
              alt={user?.name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{user?.name}</h3>
              
              {/* Privacy Selector */}
              <div className="flex items-center space-x-2 mt-1">
                <select
                  value={privacy}
                  onChange={(e) => setPrivacy(e.target.value as any)}
                  className="text-sm bg-gray-100 border-0 rounded-lg px-3 py-1 focus:ring-2 focus:ring-red-500 outline-none"
                >
                  {privacyOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 px-6">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="No que você está pensando?"
              className="w-full h-32 resize-none border-0 outline-none text-lg placeholder-gray-500 focus:ring-0"
              autoFocus
            />

            {/* Selected Image */}
            {selectedImage && (
              <div className="relative mt-4">
                <img
                  src={selectedImage}
                  alt="Selected"
                  className="w-full max-h-64 object-cover rounded-2xl"
                />
                <button
                  type="button"
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-3 right-3 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="p-6 border-t border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={handleImageSelect}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  <Camera className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Foto</span>
                </button>
                
                <button
                  type="button"
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  <Smile className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Emoji</span>
                </button>
                
                <button
                  type="button"
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  <MapPin className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Local</span>
                </button>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!content.trim()}
                  className="px-6 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors"
                >
                  Publicar
                </button>
              </div>
            </div>

            {/* Character Count */}
            <div className="flex justify-end">
              <span className={`text-sm ${content.length > 280 ? 'text-red-500' : 'text-gray-500'}`}>
                {content.length}/500
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}