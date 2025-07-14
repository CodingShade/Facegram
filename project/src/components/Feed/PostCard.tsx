import React, { useState } from 'react';
import { Heart, MessageCircle, Share, MoreHorizontal, Globe, Trash2, Edit3 } from 'lucide-react';
import { Post } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onComment: (postId: string, comment: string) => void;
  onDelete?: (postId: string) => void;
}

export default function PostCard({ post, onLike, onComment, onDelete }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const { user } = useAuth();

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onComment(post.id, newComment);
      setNewComment('');
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Agora';
    if (hours < 24) return `${hours}h`;
    return date.toLocaleDateString('pt-BR');
  };

  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja excluir esta publicação?')) {
      onDelete?.(post.id);
    }
    setShowMenu(false);
  };

  const isOwner = user?.id === post.userId || user?.id === post.user.id;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 overflow-hidden hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img
            src={post.user.avatar}
            alt={post.user.name}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100"
          />
          <div>
            <h3 className="font-semibold text-gray-900">{post.user.name}</h3>
            <p className="text-sm text-gray-500 flex items-center space-x-1">
              <span>{formatTime(post.timestamp)}</span>
              <span>•</span>
              <Globe className="w-3 h-3" />
            </p>
          </div>
        </div>
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
          >
          <MoreHorizontal className="w-5 h-5" />
        </button>
          
          {showMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-10">
              {isOwner && (
                <>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      // Implementar edição futuramente
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Editar publicação</span>
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Excluir publicação</span>
                  </button>
                </>
              )}
              {!isOwner && (
                <button
                  onClick={() => setShowMenu(false)}
                  className="w-full flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <span>Denunciar publicação</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-4">
        <p className="text-gray-900 leading-relaxed text-[15px]">{post.content}</p>
      </div>

      {/* Image */}
      {post.image && (
        <div className="px-6 pb-4">
          <img
            src={post.image}
            alt="Post content"
            className="w-full rounded-2xl object-cover max-h-96 cursor-pointer hover:opacity-95 transition-opacity"
          />
        </div>
      )}

      {/* Actions */}
      <div className="px-6 py-4 border-t border-gray-50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-6">
            <button
              onClick={() => onLike(post.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl transition-all ${
                post.isLiked 
                  ? 'text-red-500 bg-red-50' 
                  : 'text-gray-500 hover:text-red-500 hover:bg-red-50'
              }`}
            >
              <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm font-medium">{post.likes}</span>
            </button>
            
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-2 px-3 py-2 rounded-xl text-gray-500 hover:text-blue-500 hover:bg-blue-50 transition-all"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm font-medium">{post.comments.length}</span>
            </button>
            
            <button className="flex items-center space-x-2 px-3 py-2 rounded-xl text-gray-500 hover:text-green-500 hover:bg-green-50 transition-all">
              <Share className="w-5 h-5" />
              <span className="text-sm font-medium">Compartilhar</span>
            </button>
          </div>
        </div>

        {/* Comments */}
        {showComments && (
          <div className="space-y-4 mt-4">
            {post.comments.map((comment) => (
              <div key={comment.id} className="flex space-x-3">
                <img
                  src={comment.user.avatar}
                  alt={comment.user.name}
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-gray-200"
                />
                <div className="flex-1 bg-gray-50 rounded-2xl p-4">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-semibold text-sm text-gray-900">
                      {comment.user.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatTime(comment.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{comment.content}</p>
                </div>
              </div>
            ))}

            {/* Add comment */}
            <form onSubmit={handleComment} className="flex space-x-3 mt-4">
              <img
                src={post.user.avatar}
                alt="Your avatar"
                className="w-8 h-8 rounded-full object-cover ring-1 ring-gray-200"
              />
              <div className="flex-1">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Escreva um comentário..."
                  className="w-full px-4 py-3 bg-gray-50 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all"
                />
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}