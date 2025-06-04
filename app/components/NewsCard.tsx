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
  return (
    <Link href={`/news/${news.slug}`} className="group">
      <article className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg">
        <div className="relative h-48">
          <Image
            src={news.image}
            alt={alt || news.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <span
              className="px-2 py-1 rounded-full text-xs font-medium"
              style={{ backgroundColor: `${news.category.color}20`, color: news.category.color }}
            >
              {news.category.name}
            </span>
            <span>{formatDate(news.updatedAt)}</span>
          </div>
          <h2 className="text-xl font-semibold mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {news.title}
          </h2>
          <p className="text-gray-600 line-clamp-3 mb-4">
            {news.content.substring(0, 150)}...
          </p>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Image
                src={news.author.avatar || '/images/default-avatar.png'}
                alt={news.author.name}
                width={24}
                height={24}
                className="rounded-full"
              />
              <span>{news.author.name}</span>
            </div>
            <span>{news.views} visualizações</span>
          </div>
        </div>
      </article>
    </Link>
  );
} 