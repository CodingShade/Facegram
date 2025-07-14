// src/pages/ProfilePictureForm.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function ProfilePictureForm() {
  const [imageUrl, setImageUrl] = useState('');
  const [preview, setPreview] = useState('');
  const navigate = useNavigate();
  const { updateProfile } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageUrl) return;

    updateProfile({ avatar: imageUrl }); // Atualiza o contexto com a imagem
    navigate('/perfil'); // Vai para a página de perfil
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Link da imagem de perfil
          </label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => {
              setImageUrl(e.target.value);
              setPreview(e.target.value);
            }}
            placeholder="https://exemplo.com/imagem.jpg"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
          />
        </div>

        {preview && (
          <div className="text-center">
            <img
              src={preview}
              alt="Prévia"
              className="mx-auto h-32 w-32 object-cover rounded-full border"
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 transition-colors"
        >
          Salvar imagem
        </button>
      </form>
    </div>
  );
}
