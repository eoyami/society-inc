'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface News {
  _id: string;
  title: string;
  content: string;
  image: string;
  views: number;
  featured: boolean;
  tags: string[];
  createdAt: string;
}

export default function NewsPage() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [featuredNews, setFeaturedNews] = useState<News | null>(null);

  useEffect(() => {
    fetchNews();
  }, [currentPage]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`/api/news?page=${currentPage}&limit=10`);
      if (!response.ok) throw new Error('Erro ao carregar notícias');
      const data = await response.json();
      setNews(data.news);
      setTotalPages(data.totalPages);
      setFeaturedNews(data.featuredNews);
    } catch (err) {
      setError('Erro ao carregar notícias');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Notícia em Destaque */}
      {featuredNews && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Destaque</h2>
          <Link href={`/news/${featuredNews._id}`} className="block">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative h-96">
                <Image
                  src={featuredNews.image}
                  alt={featuredNews.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">{featuredNews.title}</h3>
                <p className="text-gray-600 mb-4">
                  {featuredNews.content.substring(0, 200)}...
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {formatDate(featuredNews.createdAt)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {featuredNews.views} visualizações
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Lista de Notícias */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {news.map((item) => (
          <Link key={item._id} href={`/news/${item._id}`} className="block">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden h-full">
              <div className="relative h-48">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600 mb-4">
                  {item.content.substring(0, 100)}...
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {formatDate(item.createdAt)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {item.views} visualizações
                  </span>
                </div>
                {item.tags && item.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="mt-12 flex justify-center">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 rounded-md ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próxima
            </button>
          </nav>
        </div>
      )}
    </div>
  );
} 