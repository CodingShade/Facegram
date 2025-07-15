@@ .. @@
 import React, { useState } from 'react';
-import { Heart, MessageCircle, Share, MoreHorizontal, Globe, Trash2, Edit3 } from 'lucide-react';
+import { Heart, MessageCircle, Share, MoreHorizontal, Globe, Trash2, Edit3, Loader2 } from 'lucide-react';
 import { Post } from '../../types';
 import { useAuth } from '../../contexts/AuthContext';

 interface PostCardProps {
   post: Post;
   onLike: (postId: string) => void;
   onComment: (postId: string, comment: string) => void;
   onDelete?: (postId: string) => void;
+  onUpdate?: (postId: string, content: string, imageUrl?: string) => void;
 }

-export default function PostCard({ post, onLike, onComment, onDelete }: PostCardProps) {
+export default function PostCard({ post, onLike, onComment, onDelete, onUpdate }: PostCardProps) {
   const [showComments, setShowComments] = useState(false);
   const [newComment, setNewComment] = useState('');
   const [showMenu, setShowMenu] = useState(false);
+  const [isEditing, setIsEditing] = useState(false);
+  const [editContent, setEditContent] = useState(post.content);
+  const [editImage, setEditImage] = useState(post.image || '');
+  const [isSubmitting, setIsSubmitting] = useState(false);
   const { user } = useAuth();

   const handleComment = (e: React.FormEvent) => {
@@ .. @@
   const handleDelete = () => {
     if (window.confirm('Tem certeza que deseja excluir esta publicação?')) {
       onDelete?.(post.id);
     }
     setShowMenu(false);
   };

+  const handleUpdate = async (e: React.FormEvent) => {
+    e.preventDefault();
+    if (editContent.trim() && !isSubmitting) {
+      setIsSubmitting(true);
+      try {
+        await onUpdate?.(post.id, editContent, editImage || undefined);
+        setIsEditing(false);
+        setShowMenu(false);
+      } catch (error) {
+        console.error('Failed to update post:', error);
+      } finally {
+        setIsSubmitting(false);
+      }
+    }
+  };
+
+  const handleCancelEdit = () => {
+    setEditContent(post.content);
+    setEditImage(post.image || '');
+    setIsEditing(false);
+    setShowMenu(false);
+  };

   const isOwner = user?.id === post.userId || user?.id === post.user.id;

   return (
@@ .. @@
               {isOwner && (
                 <>
                   <button
-                    onClick={() => {
-                      setShowMenu(false);
-                      // Implementar edição futuramente
-                    }}
+                    onClick={() => setIsEditing(true)}
                     className="w-full flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                   >
                     <Edit3 className="w-4 h-4" />
@@ .. @@
       </div>

       {/* Content */}
-      <div className="px-6 pb-4">
-        <p className="text-gray-900 leading-relaxed text-[15px]">{post.content}</p>
-      </div>
+      {isEditing ? (
+        <form onSubmit={handleUpdate} className="px-6 pb-4 space-y-4">
+          <textarea
+            value={editContent}
+            onChange={(e) => setEditContent(e.target.value)}
+            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-none"
+            rows={3}
+            maxLength={1000}
+            disabled={isSubmitting}
+          />
+          <input
+            type="url"
+            value={editImage}
+            onChange={(e) => setEditImage(e.target.value)}
+            placeholder="URL da imagem (opcional)"
+            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
+            disabled={isSubmitting}
+          />
+          <div className="flex space-x-3">
+            <button
+              type="submit"
+              disabled={!editContent.trim() || isSubmitting}
+              className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
+            >
+              {isSubmitting ? (
+                <>
+                  <Loader2 className="w-4 h-4 animate-spin" />
+                  <span>Salvando...</span>
+                </>
+              ) : (
+                <span>Salvar</span>
+              )}
+            </button>
+            <button
+              type="button"
+              onClick={handleCancelEdit}
+              disabled={isSubmitting}
+              className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors disabled:opacity-50"
+            >
+              Cancelar
+            </button>
+          </div>
+        </form>
+      ) : (
+        <div className="px-6 pb-4">
+          <p className="text-gray-900 leading-relaxed text-[15px]">{post.content}</p>
+        </div>
+      )}

       {/* Image */}
-      {post.image && (
+      {(isEditing ? editImage : post.image) && (
         <div className="px-6 pb-4">
           <img
-            src={post.image}
+            src={isEditing ? editImage : post.image}
             alt="Post content"
             className="w-full rounded-2xl object-cover max-h-96 cursor-pointer hover:opacity-95 transition-opacity"
+            onError={(e) => {
+              e.currentTarget.style.display = 'none';
+            }}
           />
         </div>
       )}