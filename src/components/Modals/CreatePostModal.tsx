import React, { useState } from 'react';
import { X, Image, Smile, MapPin, Users, Globe, Lock, Camera, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePost: (content: string, image?: string, privacy?: string) => void;
}

export default function CreatePostModal({ isOpen, onClose, onCreatePost }: CreatePostModalProps) {
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [privacy, setPrivacy] = useState<'public' | 'friends' | 'private'>('public');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await onCreatePost(content, selectedImage || undefined, privacy);
        setContent('');
        setSelectedImage('');
        setPrivacy('public');
        onClose();
      } catch (error) {
        console.error('Failed to create post:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedImage(e.target.value);
  };

  const isValidImageUrl = (url: string): boolean => {
    if (!url) return false;
    try {
      new URL(url);
      return /\.(jpg|jpeg|png|gif|webp)$/i.test(url) || 
             url.includes('pexels.com') || 
             url.includes('unsplash.com') ||
             url.includes('images.') ||
             url.includes('imgur.com');
    } catch {
      return false;
    }
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
            disabled={isSubmitting}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
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
                  disabled={isSubmitting}
                  className="text-sm bg-gray-100 border-0 rounded-lg px-3 py-1 focus:ring-2 focus:ring-red-500 outline-none disabled:opacity-50"
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
              placeholder={`No que você está pensando, ${user?.name?.split(' ')[0]}?`}
              disabled={isSubmitting}
              className="w-full h-32 resize-none border-0 outline-none text-lg placeholder-gray-500 focus:ring-0 disabled:opacity-50"
              autoFocus
              maxLength={1000}
            />

            {/* Image URL Input */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adicionar imagem (opcional)
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={selectedImage}
                  onChange={handleImageUrlChange}
                  placeholder="Cole o link de uma imagem..."
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all disabled:opacity-50"
                />
                <Camera className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Suporte para JPG, PNG, GIF, WebP ou links do Pexels/Unsplash
              </p>
            </div>

            {/* Selected Image Preview */}
            {selectedImage && isValidImageUrl(selectedImage) && (
              <div className="relative mt-4">
                <img
                  src={selectedImage}
                  alt="Preview"
                  className="w-full max-h-64 object-cover rounded-2xl"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setSelectedImage('')}
                  disabled={isSubmitting}
                  className="absolute top-3 right-3 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {selectedImage && !isValidImageUrl(selectedImage) && (
              <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-700">
                  ⚠️ URL da imagem pode não ser válida. Verifique se está correta.
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="p-6 border-t border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex space-x-4">
                <button
                  type="button"
                  disabled={isSubmitting}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50"
                >
                  <Smile className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Emoji</span>
                </button>
                
                <button
                  type="button"
                  disabled={isSubmitting}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50"
                >
                  <MapPin className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Local</span>
                </button>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-6 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!content.trim() || isSubmitting}
                  className="px-6 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Publicando...</span>
                    </>
                  ) : (
                    <span>Publicar</span>
                  )}
                </button>
              </div>
            </div>

            {/* Character Count */}
            <div className="flex justify-end">
              <span className={`text-sm ${content.length > 800 ? 'text-red-500' : 'text-gray-500'}`}>
                {content.length}/1000
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}