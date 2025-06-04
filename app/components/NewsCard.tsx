'use client';

import Link from 'next/link';
import Image from 'next/image';
import { News } from '@/app/types';
import { formatDate } from '@/app/lib/utils';

interface NewsCardProps {
  news: News;
  alt?: string;
  layout?: 'grid' | 'list';
}

export default function NewsCard({ news, alt, layout = 'grid' }: NewsCardProps) {
  // Função para remover tags HTML usando regex
  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, '');
  };

  const excerpt = stripHtml(news.content).substring(0, 150) + '...';

  return (
    <Link href={`/news/${news.slug}`} className="group block mb-8">
      <article className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg ${
        layout === 'list' ? 'flex flex-col md:flex-row' : ''
      }`}>
        {/* Container da Imagem */}
        <div className={`relative ${layout === 'list' ? 'h-32 sm:h-40 md:h-auto md:w-1/3' : 'h-40 sm:h-48'}`}>
          <div className="relative w-full h-full overflow-hidden">
            <Image
              src={news.image}
              alt={alt || news.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </div>

        {/* Container do Conteúdo */}
        <div className={`p-3 sm:p-4 md:p-6 ${layout === 'list' ? 'md:w-2/3' : ''}`}>
          {/* Título e Resumo */}
          <div>
            <time className="text-xs sm:text-sm text-gray-400 block">
              {formatDate(news.updatedAt)}
            </time>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold line-clamp-2 group-hover:text-blue-600 transition-colors">
              {news.title}
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 line-clamp-2">
              {excerpt}
            </p>
          </div>

          {/* Tags e Interações */}
          <div className="mt-2 sm:mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4 text-gray-500">
              <button className="hover:text-blue-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </button>
              <button className="hover:text-red-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
} 