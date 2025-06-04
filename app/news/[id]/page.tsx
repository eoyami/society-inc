"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

interface News {
  _id: string;
  title: string;
  content: string;
  image: string;
  author: {
    _id: string;
    name: string;
    image: string;
  };
  views: number;
  featured: boolean;
  createdAt: string;
  category: string;
  slug: string;
}

export default function NewsPage() {
  const params = useParams();
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useSession();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        if (!params.id) {
          throw new Error('Slug da notícia não fornecido');
        }

        const response = await fetch(`/api/news/${params.id}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erro ao carregar notícia');
        }

        const data = await response.json();
        setNews(data);

        // Registrar visualização
        const viewResponse = await fetch(`/api/news/${params.id}/view`, { 
          method: 'POST' 
        });
        
        if (!viewResponse.ok) {
          console.error('Erro ao registrar visualização:', viewResponse.status);
        }
      } catch (err) {
        console.error('Erro ao carregar notícia:', err);
        setError(err instanceof Error ? err.message : 'Erro ao carregar notícia');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">{error || 'Notícia não encontrada'}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <Link href="/" className="nav-link flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Voltar para a página inicial
        </Link>
      </div>

      <article className="max-w-4xl mx-auto card">
        <div className="relative h-[500px] w-full">
          {news.image && news.image.trim() !== '' && (
            <Image
              src={news.image}
              alt={news.title}
              fill
              className="object-cover"
              priority
            />
          )}
        </div>

        <div className="p-8">
          <h1 className="text-4xl font-bold mb-6 leading-tight text-gray-900">{news.title}</h1>
          
          <div className="flex flex-wrap items-center gap-4 mb-8 pb-6 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <div className="relative h-12 w-12 rounded-full overflow-hidden">
                {news.author?.image && news.author.image.trim() !== '' && (
                  <Image
                    src={news.author.image}
                    alt={news.author.name}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{news.author.name}</p>
                <p className="text-gray-600 text-sm">
                  {new Date(news.createdAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 ml-auto">
              <div className="badge badge-primary flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>{news.views} visualizações</span>
              </div>

              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors" title="Compartilhar no Facebook">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z"/>
                  </svg>
                </button>
                <button className="p-2 text-gray-600 hover:text-blue-400 transition-colors" title="Compartilhar no Twitter">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.44 4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96 1.32-2.02-.88.52-1.86.9-2.9 1.1-.82-.88-2-1.43-3.3-1.43-2.5 0-4.55 2.04-4.55 4.54 0 .36.03.7.1 1.04-3.77-.2-7.12-2-9.36-4.75-.4.67-.6 1.45-.6 2.3 0 1.56.8 2.95 2 3.77-.74-.03-1.44-.23-2.05-.57v.06c0 2.2 1.56 4.03 3.64 4.44-.67.2-1.37.2-2.06.08.58 1.8 2.26 3.12 4.25 3.16C5.78 18.1 3.37 18.74 1 18.46c2 1.3 4.4 2.04 6.97 2.04 8.35 0 12.92-6.92 12.92-12.93 0-.2 0-.4-.02-.6.9-.63 1.96-1.22 2.56-2.14z"/>
                  </svg>
                </button>
                <button className="p-2 text-gray-600 hover:text-green-600 transition-colors" title="Compartilhar no WhatsApp">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.1 3.9C17.9 1.7 15 .5 12 .5 5.8.5.7 5.6.7 11.9c0 2 .5 3.9 1.5 5.6L.6 23.4l6-1.6c1.6.9 3.5 1.3 5.4 1.3 6.3 0 11.4-5.1 11.4-11.4-.1-2.8-1.2-5.7-3.3-7.8zM12 21.4c-1.7 0-3.3-.5-4.8-1.3l-.4-.2-3.5 1 1-3.4L4 17c-1-1.5-1.4-3.2-1.4-5.1 0-5.2 4.2-9.4 9.4-9.4 2.5 0 4.9 1 6.7 2.8 1.8 1.8 2.8 4.2 2.8 6.7-.1 5.2-4.3 9.4-9.5 9.4zm5.1-7.1c-.3-.1-1.7-.9-1.9-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.1-.2.2-.3.2-.6.1s-1.2-.5-2.3-1.4c-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6s.3-.3.4-.5c.2-.1.3-.3.4-.5.1-.2 0-.4 0-.5C10 9 9.3 7.6 9 7c-.1-.4-.4-.3-.5-.3h-.6s-.4.1-.7.3c-.3.3-1 1-1 2.4s1 2.8 1.1 3c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 1.9-1.3.2-.7.2-1.2.2-1.3-.1-.3-.3-.4-.6-.5-.5z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="prose">
            {news.content.split('\n').map((paragraph, index) => (
              <p key={index}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
} 