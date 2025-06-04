'use client';

import Link from 'next/link';
import Image from 'next/image';
import { News } from '@/app/lib/news';

interface NewsCardProps {
  news: News;
}

export default function NewsCard({ news }: NewsCardProps) {
  return (
    <Link href={`/news/${news.slug}`} className="group">
      <article className="bg-white rounded-lg shadow-sm overflow-hidden h-full flex flex-col">
        <div className="relative h-48 w-full overflow-hidden">
          {news.image ? (
            <div className="relative w-full h-full">
              <Image
                src={news.image}
                alt={news.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
              Sem imagem
            </div>
          )}
        </div>
        
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 line-clamp-2 mb-2">
            {news.title}
          </h3>
          
          <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-grow">
            {news.excerpt}
          </p>
          
          <div className="mt-auto pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>
                {new Date(news.createdAt).toLocaleDateString('pt-BR')}
              </span>
              {news.category && (
                <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                  {news.category}
                </span>
              )}
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
} 