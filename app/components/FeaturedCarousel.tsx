'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { News } from '@/app/types';

interface FeaturedCarouselProps {
  news: News[];
}

export default function FeaturedCarousel({ news }: FeaturedCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Função para remover tags HTML e limitar o texto
  const stripHtml = (html: string) => {
    if (typeof window === 'undefined') {
      // Se estiver no servidor, usa uma abordagem mais simples
      return html.replace(/<[^>]*>/g, '');
    }
    // Se estiver no cliente, usa a abordagem com DOM
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  // Configuração do swipe
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      setCurrentIndex((prev) => (prev + 1) % news.length);
    }
    if (isRightSwipe) {
      setCurrentIndex((prev) => (prev - 1 + news.length) % news.length);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % news.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [news.length]);

  const nextSlide = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % news.length);
  };

  const prevSlide = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + news.length) % news.length);
  };

  if (!news.length) return null;

  return (
    <div 
      ref={carouselRef}
      className="relative h-[300px] sm:h-[400px] md:h-[500px] overflow-hidden rounded-lg group"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {news.map((news, index) => (
        <div
          key={news._id}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none'
          }`}
        >
          <Link 
            href={`/news/${news.slug}`}
            className="block h-full w-full cursor-pointer"
          >
            <div className="relative h-full w-full">
              {news.image ? (
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 text-white">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 line-clamp-2">{news.title}</h2>
                <p className="text-sm sm:text-base md:text-lg mb-4 line-clamp-2">{stripHtml(news.content).substring(0, 150)}...</p>
                <div className="flex items-center text-xs sm:text-sm">
                  <span className="mr-4">{new Date(news.createdAt).toLocaleDateString('pt-BR')}</span>
                  {news.category && (
                    <span
                      className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{ backgroundColor: `${news.category.color}20`, color: news.category.color }}
                    >
                      {news.category.name}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        </div>
      ))}

      {/* Setas de navegação */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-black/30 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/50 z-20"
        aria-label="Notícia anterior"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 sm:w-6 sm:h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-black/30 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/50 z-20"
        aria-label="Próxima notícia"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 sm:w-6 sm:h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>

      {/* Indicadores */}
      <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1 sm:space-x-2 z-20">
        {news.map((_, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setCurrentIndex(index);
            }}
            className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
} 