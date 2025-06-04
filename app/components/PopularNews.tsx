'use client';

import Image from 'next/image';
import Link from 'next/link';
import { News } from '../lib/news';

interface PopularNewsProps {
  popularNews: News[];
}

export default function PopularNews({ popularNews }: PopularNewsProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Notícias Populares</h2>
      <div className="space-y-6">
        {popularNews.map((news) => (
          <Link
            key={news._id}
            href={`/news/${news.slug}`}
            className="block group"
          >
            <div className="flex space-x-4">
              <div className="flex-shrink-0 w-20 h-20 relative">
                {news.image && news.image.startsWith('http') ? (
                  <Image
                    src={news.image}
                    alt={news.title}
                    fill
                    className="object-cover rounded"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-gray-400 text-xs">Sem imagem</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 group-hover:text-red-600 line-clamp-2">
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
    </div>
  );
} 