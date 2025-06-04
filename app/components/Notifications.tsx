'use client';

import { useState, useRef, useEffect } from 'react';
import { useNotifications } from '@/app/hooks/useNotifications';
import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@/app/lib/utils';

export default function Notifications() {
  const { notifications, unreadCount, isLoading, error, markAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Marcar notificações como lidas ao abrir
  useEffect(() => {
    if (isOpen && unreadCount > 0) {
      const unreadIds = notifications
        .filter(n => !n.read)
        .map(n => n._id);
      if (unreadIds.length > 0) {
        markAsRead(unreadIds);
      }
    }
  }, [isOpen, unreadCount, notifications, markAsRead]);

  const renderNotificationContent = (notification: any) => {
    switch (notification.type) {
      case 'comment':
        return (
          <Link href={`/news/${notification.relatedNews.slug}`} className="hover:underline">
            comentou em "{notification.relatedNews.title}"
          </Link>
        );
      case 'reply':
        return (
          <Link href={`/news/${notification.relatedNews.slug}`} className="hover:underline">
            respondeu ao seu comentário em "{notification.relatedNews.title}"
          </Link>
        );
      case 'like':
        return (
          <Link href={`/news/${notification.relatedNews.slug}`} className="hover:underline">
            curtiu sua notícia "{notification.relatedNews.title}"
          </Link>
        );
      case 'follow':
        return (
          <Link href={`/profile/${notification.sender.username}`} className="hover:underline">
            começou a seguir você
          </Link>
        );
      default:
        return notification.content;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg overflow-hidden z-50">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Notificações</h3>
          </div>

          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Carregando...</div>
          ) : error ? (
            <div className="p-4 text-center text-red-500">{error}</div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              Nenhuma notificação
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-4 border-b border-gray-200 hover:bg-gray-50 ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {notification.sender.image ? (
                        <Image
                          src={notification.sender.image}
                          alt={notification.sender.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                          {notification.sender.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">
                          {notification.sender.name}
                        </span>{' '}
                        {renderNotificationContent(notification)}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {formatDate(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 