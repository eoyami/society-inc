'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { News } from '../lib/news';

interface FeaturedCarouselProps {
  featuredNews: News[];
}

export default function FeaturedCarousel({ featuredNews }: FeaturedCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredNews.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [featuredNews.length]);

  if (!featuredNews.length) return null;

  return (
    <div className="relative h-[500px] overflow-hidden rounded-lg">
      {featuredNews.map((news, index) => (
        <div
          key={news._id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Link href={`/news/${news.slug}`}>
            <div className="relative h-full w-full">
              {news.image && news.image.startsWith('http') ? (
                <Image
                  src={news.image}
                  alt={news.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">Sem imagem</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h2 className="text-3xl font-bold mb-2 line-clamp-2">{news.title}</h2>
                <p className="text-lg mb-4 line-clamp-2">{news.excerpt}</p>
                <div className="flex items-center text-sm">
                  <span className="mr-4">{new Date(news.createdAt).toLocaleDateString('pt-BR')}</span>
                  <span>{news.category}</span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      ))}

      {/* Indicadores */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {featuredNews.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
} 