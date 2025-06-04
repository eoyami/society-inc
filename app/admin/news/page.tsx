'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';

interface News {
  _id: string;
  title: string;
  content: string;
  image: string;
  author: {
    name: string;
    image: string;
  };
  createdAt: string;
  likes: number;
  comments: number;
  slug: string;
}

export default function NewsPage() {
  const { data: session } = useSession();
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/news?page=${page}&limit=10`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Erro ao carregar notícias');
        }

        setNews(data.news);
        setTotalPages(data.totalPages);
        setError('');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar notícias');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [page]);

  const deleteNews = async (slug: string) => {
    if (!confirm('Tem certeza que deseja excluir esta notícia?')) {
      return;
    }

    try {
      const response = await fetch(`/api/news/${slug}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir notícia');
      }

      setNews(news.filter((item) => item.slug !== slug));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir notícia');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Gerenciar Notícias</h1>
        <Link
          href="/admin/news/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Nova Notícia
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {news.map((item) => (
            <li key={item._id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 relative">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                    <div className="ml-4">
                      <h2 className="text-lg font-medium text-gray-900">
                        {item.title}
                      </h2>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <span>{item.author.name}</span>
                        <span className="mx-2">•</span>
                        <span>
                          {new Date(item.createdAt).toLocaleDateString('pt-BR')}
                        </span>
                        <span className="mx-2">•</span>
                        <span>{item.likes} curtidas</span>
                        <span className="mx-2">•</span>
                        <span>{item.comments} comentários</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      href={`/admin/news/${item.slug}/edit`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => deleteNews(item.slug)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border rounded-md disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="px-4 py-2">
            Página {page} de {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border rounded-md disabled:opacity-50"
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  );
} 