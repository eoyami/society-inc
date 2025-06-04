'use client';

import Image from 'next/image';
import Link from 'next/link';
import { News } from '../lib/news';

interface PopularNewsProps {
  popularNews: News[];
}

export default function PopularNews({ popularNews }: PopularNewsProps) {
  return (
    <div className="space-y-6">
      {popularNews.map((news) => (
        <Link
          key={news._id}
          href={`/news/${news.slug}`}
          className="block group"
        >
          <div className="flex gap-4">
            <div className="relative h-20 w-20 flex-shrink-0">
              {news.image ? (
                <Image
                  src={news.image}
                  alt={news.title}
                  fill
                  className="object-cover rounded-md"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
                  Sem imagem
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 line-clamp-2">
                {news.title}
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                {new Date(news.createdAt).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
} 