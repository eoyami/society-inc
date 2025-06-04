'use client';

import Link from 'next/link';
import Image from 'next/image';
import { News } from '@/app/types';
import { formatDate } from '@/app/lib/utils';

interface NewsCardProps {
  news: News;
  alt?: string;
}

export default function NewsCard({ news, alt }: NewsCardProps) {
  // Função para remover tags HTML e limitar o texto
  const stripHtml = (html: string) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  // Função para truncar texto com limite de caracteres
  const truncateText = (text: string, limit: number) => {
    if (text.length <= limit) return text;
    return text.slice(0, limit) + '...';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Link href={`/news/${news.slug}`}>
        <div className="relative h-48">
          <Image
            src={news.image || '/placeholder.jpg'}
            alt={alt || `Imagem da notícia: ${news.title}`}
            fill
            className="object-cover"
          />
        </div>
      </Link>
      <div className="p-4">
        <div className="mb-2">
          <Link
            href={`/users/${news.author.username}`}
            className="text-sm text-gray-600 hover:underline"
          >
            {news.author.name}
          </Link>
        </div>
        <Link href={`/news/${news.slug}`}>
          <h2 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 line-clamp-2">
            {truncateText(news.title, 80)}
          </h2>
          <p className="text-gray-600 line-clamp-3">
            {truncateText(stripHtml(news.content), 150)}
          </p>
        </Link>
        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <span>
            {formatDate(news.updatedAt)}
          </span>
          <Link
            href={`/categories/${news.category}`}
            className="text-blue-600 hover:underline"
          >
            {news.category}
          </Link>
        </div>
      </div>
    </div>
  );
} 