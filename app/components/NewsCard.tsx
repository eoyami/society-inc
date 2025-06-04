'use client';

import Image from 'next/image';
import Link from 'next/link';
import { News } from '@/app/lib/news';

interface NewsCardProps {
  news: News;
}

export default function NewsCard({ news }: NewsCardProps) {
  const isValidImageUrl = news.image && news.image.startsWith('http');

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Link href={`/news/${news.slug}`}>
        <div className="relative h-48 w-full">
          {isValidImageUrl ? (
            <Image
              src={news.image}
              alt={news.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">Sem imagem</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {news.title}
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {news.excerpt}
          </p>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{new Date(news.createdAt).toLocaleDateString('pt-BR')}</span>
            <span>{news.category}</span>
          </div>
        </div>
      </Link>
    </div>
  );
} 