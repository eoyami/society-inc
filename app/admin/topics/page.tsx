"use client";

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';

interface Topic {
  _id: string;
  title: string;
  content: string;
  author: {
    name: string;
    image: string;
  };
  createdAt: string;
  replies: number;
}

export default function TopicsPage() {
  const { data: session } = useSession();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await fetch(`/api/topics?page=${page}&limit=10`);
        if (!response.ok) throw new Error('Erro ao carregar tópicos');
        const data = await response.json();
        setTopics(data.topics);
        setTotalPages(Math.ceil(data.total / 10));
      } catch (err) {
        setError('Erro ao carregar tópicos');
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, [page]);

  const deleteTopic = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este tópico?')) return;

    try {
      const response = await fetch(`/api/topics/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Erro ao excluir tópico');

      setTopics(topics.filter(item => item._id !== id));
    } catch (err) {
      setError('Erro ao excluir tópico');
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
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Gerenciar Tópicos</h1>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {topics.map((item) => (
            <li key={item._id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 relative">
                      <Image
                        src={item.author.image}
                        alt={item.author.name}
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                    <div className="ml-4">
                      <h2 className="text-lg font-medium text-gray-900">
                        {item.title}
                      </h2>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <p>
                          Por {item.author.name} •{' '}
                          {new Date(item.createdAt).toLocaleDateString()} •{' '}
                          {item.replies} respostas
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Link
                      href={`/admin/topics/${item._id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Ver Respostas
                    </Link>
                    <button
                      onClick={() => deleteTopic(item._id)}
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
        <div className="mt-4 flex justify-center">
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              Anterior
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              Próxima
            </button>
          </nav>
        </div>
      )}
    </div>
  );
} 