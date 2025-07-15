import React, { useState } from 'react';
import { Heart, MessageCircle, Share, MoreHorizontal, Globe, Trash2, Edit3, Loader2 } from 'lucide-react';
import { Post } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onComment: (postId: string, comment: string) => void;
  onDelete?: (postId: string) => void;
  onUpdate?: (postId: string, content: string, imageUrl?: string) => void;
}

export default function PostCard({ post, onLike, onComment, onDelete, onUpdate }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [editImage, setEditImage] = useState(post.image || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onComment(post.id, newComment);
      setNewComment('');
    }
  };

  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja excluir esta publicação?')) {
      onDelete?.(post.id);
    }
    setShowMenu(false);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editContent.trim() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await onUpdate?.(post.id, editContent, editImage || undefined);
        setIsEditing(false);
        setShowMenu(false);
      } catch (error) {
        console.error('Failed to update post:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditContent(post.content);
    setEditImage(post.image || '');
    setIsEditing(false);
    setShowMenu(false);
  };

  const isOwner = user?.id === post.userId || user?.id === post.user.id;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
            src={post.user.avatar || '/default-avatar.png'}
            alt={post.user.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-gray-900">{post.user.name}</h3>
            <div className="flex items-center space-x-2 text-gray-500 text-sm">
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              <span>•</span>
              <Globe className="w-4 h-4" />
            </div>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <MoreHorizontal className="w-5 h-5 text-gray-500" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
              {isOwner && (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Editar</span>
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-gray-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Excluir</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      {isEditing ? (
        <form onSubmit={handleUpdate} className="px-6 pb-4 space-y-4">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-none"
            rows={3}
            maxLength={1000}
            disabled={isSubmitting}
          />
          <input
            type="url"
            value={editImage}
            onChange={(e) => setEditImage(e.target.value)}
            placeholder="URL da imagem (opcional)"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
            disabled={isSubmitting}
          />
          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={!editContent.trim() || isSubmitting}
              className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Salvando...</span>
                </>
              ) : (
                <span>Salvar</span>
              )}
            </button>
            <button
              type="button"
              onClick={handleCancelEdit}
              disabled={isSubmitting}
              className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <div className="px-6 pb-4">
          <p className="text-gray-900 leading-relaxed text-[15px]">{post.content}</p>
        </div>
      )}

      {/* Image */}
      {(isEditing ? editImage : post.image) && (
        <div className="px-6 pb-4">
          <img
            src={isEditing ? editImage : post.image}
            alt="Post content"
            className="w-full rounded-2xl object-cover max-h-96 cursor-pointer hover:opacity-95 transition-opacity"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Actions */}
      <div className="px-6 py-2 border-t border-gray-100">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => onLike(post.id)}
            className={`flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors ${
              post.liked ? 'text-red-500' : ''
            }`}
          >
            <Heart className={`w-5 h-5 ${post.liked ? 'fill-current' : ''}`} />
            <span>{post.likes}</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            <span>{post.comments.length}</span>
          </button>

          <button className="flex items-center space-x-2 text-gray-600 hover:text-green-500 transition-colors">
            <Share className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="px-6 py-4 border-t border-gray-100">
          <form onSubmit={handleComment} className="flex space-x-3 mb-4">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escreva um comentário..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="px-4 py-2 bg-red-500 text-white rounded-full font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              Comentar
            </button>
          </form>

          <div className="space-y-4">
            {post.comments.map((comment) => (
              <div key={comment.id} className="flex space-x-3">
                <img
                  src={comment.user.avatar || '/default-avatar.png'}
                  alt={comment.user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-2xl px-4 py-2">
                    <h4 className="font-semibold text-gray-900">{comment.user.name}</h4>
                    <p className="text-gray-700 text-sm">{comment.content}</p>
                  </div>
                  <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                    <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                    <button className="hover:text-red-500 transition-colors">Curtir</button>
                    <button className="hover:text-blue-500 transition-colors">Responder</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}