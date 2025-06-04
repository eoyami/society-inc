'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { formatDate } from '@/app/lib/utils';

interface Comment {
  _id: string;
  content: string;
  author: {
    _id: string;
    name: string;
    username: string;
    image?: string;
  };
  createdAt: string;
  replies?: Comment[];
}

interface CommentsProps {
  newsSlug: string;
}

export default function Comments({ newsSlug }: CommentsProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<{ id: string; author: { name: string; username: string } } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchComments();
  }, [newsSlug]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/news/${newsSlug}/comments`);
      if (!response.ok) throw new Error('Erro ao carregar comentários');
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Erro ao buscar comentários:', error);
      setError('Não foi possível carregar os comentários');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/news/${newsSlug}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          content: newComment,
          parentCommentId: replyTo?.id 
        }),
      });

      if (!response.ok) throw new Error('Erro ao enviar comentário');

      const comment = await response.json();
      
      if (replyTo) {
        // Atualizar a lista de respostas do comentário pai
        setComments(comments.map(c => {
          if (c._id === replyTo.id) {
            return {
              ...c,
              replies: [...(c.replies || []), comment]
            };
          }
          return c;
        }));
      } else {
        // Adicionar novo comentário principal
        setComments([comment, ...comments]);
      }
      
      setNewComment('');
      setReplyTo(null);
    } catch (error) {
      console.error('Erro ao enviar comentário:', error);
      setError('Não foi possível enviar o comentário');
    } finally {
      setIsLoading(false);
    }
  };

  const renderAvatar = (user: { name?: string | null; image?: string | null }) => {
    if (user?.image) {
      return (
        <div className="relative w-10 h-10 rounded-full overflow-hidden">
          <Image
            src={user.image}
            alt={user.name || 'Avatar do usuário'}
            fill
            sizes="40px"
            className="object-cover"
            unoptimized={user.image.startsWith('data:')}
            quality={75}
          />
        </div>
      );
    }
    return (
      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
        {user?.name?.charAt(0) || '?'}
      </div>
    );
  };

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <div className={`flex gap-4 ${isReply ? 'ml-12' : ''}`}>
      <div className="flex-shrink-0">
        {renderAvatar(comment.author)}
      </div>
      <div className="flex-grow">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="font-medium text-gray-900">
                {comment.author.name}
              </span>
              <span className="text-gray-500 text-sm ml-2">
                @{comment.author.username}
              </span>
            </div>
            <time className="text-sm text-gray-500">
              {formatDate(comment.createdAt)}
            </time>
          </div>
          <p className="text-gray-700">{comment.content}</p>
          {!isReply && session && (
            <button
              onClick={() => setReplyTo({ 
                id: comment._id, 
                author: { 
                  name: comment.author.name, 
                  username: comment.author.username 
                } 
              })}
              className="mt-2 text-sm text-blue-600 hover:text-blue-700"
            >
              Responder
            </button>
          )}
        </div>
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4 space-y-4">
            {comment.replies.map((reply) => (
              <CommentItem key={reply._id} comment={reply} isReply />
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Comentários</h2>

      {/* Formulário de comentário */}
      {session ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              {renderAvatar(session.user)}
            </div>
            <div className="flex-grow">
              {replyTo && (
                <div className="mb-2 p-2 bg-blue-50 rounded-lg flex items-center justify-between">
                  <span className="text-sm text-blue-700">
                    Respondendo a <span className="font-medium">@{replyTo.author.username}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setReplyTo(null)}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Cancelar
                  </button>
                </div>
              )}
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={replyTo ? `Respondendo a @${replyTo.author.username}...` : "Escreva seu comentário..."}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
              />
              <div className="mt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading || !newComment.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Enviando...' : replyTo ? 'Responder' : 'Comentar'}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-gray-600">
            <a href="/login" className="text-blue-600 hover:underline">
              Faça login
            </a>{' '}
            para deixar um comentário
          </p>
        </div>
      )}

      {/* Lista de comentários */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {comments.map((comment) => (
          <CommentItem key={comment._id} comment={comment} />
        ))}

        {comments.length === 0 && !error && (
          <div className="text-center text-gray-500 py-8">
            Nenhum comentário ainda. Seja o primeiro a comentar!
          </div>
        )}
      </div>
    </div>
  );
} 