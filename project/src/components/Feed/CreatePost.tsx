import React, { useState } from 'react';
import { Image, Smile, MapPin, X, Camera, Globe, Users, Lock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import CreatePostModal from '../Modals/CreatePostModal';

interface CreatePostProps {
  onCreatePost: (content: string, image?: string) => void;
}

export default function CreatePost({ onCreatePost }: CreatePostProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  const handleCreatePost = (content: string, image?: string, privacy?: string) => {
    onCreatePost(content, image);
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex space-x-4">
          <img
            src={user?.avatar}
            alt={user?.name}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100"
          />
          <div className="flex-1">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full text-left px-6 py-4 bg-gray-50 hover:bg-gray-100 rounded-2xl text-gray-500 transition-colors"
            >
              No que você está pensando, {user?.name?.split(' ')[0]}?
            </button>
            
            <div className="flex items-center justify-between mt-4">
              <div className="flex space-x-4">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <Camera className="w-5 h-5 text-red-500" />
                  <span className="text-sm font-medium text-gray-700">Foto</span>
                </button>
                
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <Smile className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm font-medium text-gray-700">Sentimento</span>
                </button>
                
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <MapPin className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-medium text-gray-700">Local</span>
                </button>
              </div>
              
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors"
              >
                Publicar
              </button>
            </div>
          </div>
        </div>
      </div>

      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreatePost={handleCreatePost}
      />
    </>
  );
}