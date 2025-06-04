'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import EditProfileModal from './EditProfileModal';

interface News {
  _id: string;
  title: string;
  excerpt: string;
  image: string;
  createdAt: string;
  slug: string;
  category: {
    _id: string;
    name: string;
    color: string;
    slug: string;
  };
}

interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  image: string;
  role: string;
  points: number;
  level: number;
  achievements: Array<{
    _id: string;
    name: string;
    description: string;
    image: string;
  }>;
  coverImage?: string;
}

interface ProfileProps {
  user: User;
  news: News[];
}

export default function Profile({ user, news }: ProfileProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);

  const handleSaveProfile = async (updatedUser: { name: string; username: string; image?: string; coverImage?: string }) => {
    try {
      const response = await fetch(`/api/users/${currentUser.username}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar perfil');
      }

      const updatedUserData = await response.json();
      setCurrentUser(prev => ({
        ...prev,
        ...updatedUserData
      }));
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      throw error;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="relative h-64 w-full rounded-lg overflow-hidden mb-20">
        {currentUser.coverImage && currentUser.coverImage.trim() !== '' ? (
          <Image
            src={currentUser.coverImage}
            alt={`${currentUser.name}'s cover image`}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600">Sem capa</div>
        )}
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex flex-col items-center">
            <div className="relative h-32 w-32 rounded-full overflow-hidden -mt-24 border-4 border-white bg-gray-400 shadow-lg">
              {currentUser.image && currentUser.image.trim() !== '' ? (
                <Image
                  src={currentUser.image}
                  alt={currentUser.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-700 text-4xl">{currentUser.name.charAt(0)}</div>
              )}
            </div>
            <div className="mt-4 text-center">
              <h3 className="text-2xl font-bold text-gray-900">
                {currentUser.name}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                @{currentUser.username}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {currentUser.email}
              </p>
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Editar Perfil
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-3">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Nível</dt>
              <dd className="mt-1 text-lg font-semibold text-gray-900">{currentUser.level}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Pontos</dt>
              <dd className="mt-1 text-lg font-semibold text-gray-900">{currentUser.points}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Função</dt>
              <dd className="mt-1 text-lg font-semibold text-gray-900">
                {currentUser.role === 'admin' ? 'Administrador' : 'Usuário'}
              </dd>
            </div>
          </dl>
        </div>

        {currentUser.achievements && currentUser.achievements.length > 0 && (
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Conquistas
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {currentUser.achievements.map((achievement) => (
                <div
                  key={achievement._id}
                  className="bg-gray-50 rounded-lg p-4 flex items-center hover:bg-gray-100 transition-colors"
                >
                  <div className="relative h-16 w-16 flex-shrink-0">
                    {achievement.image && achievement.image.trim() !== '' && (
                      <Image
                        src={achievement.image}
                        alt={achievement.name}
                        fill
                        className="object-cover rounded"
                      />
                    )}
                  </div>
                  <div className="ml-4">
                    <h4 className="text-base font-medium text-gray-900">
                      {achievement.name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {news && news.length > 0 && (
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Notícias Publicadas
            </h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {news.map((newsItem) => (
                <div key={newsItem._id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  <div className="relative h-48 w-full">
                    <Link href={`/news/${newsItem.slug}`}>
                      {newsItem.image && newsItem.image.trim() !== '' ? (
                        <Image
                          src={newsItem.image}
                          alt={newsItem.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                          Sem imagem
                        </div>
                      )}
                    </Link>
                  </div>
                  <div className="p-4">
                    <Link href={`/news/${newsItem.slug}`} className="block">
                      <h4 className="text-lg font-semibold text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors">
                        {newsItem.title}
                      </h4>
                      <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                        {newsItem.excerpt}
                      </p>
                    </Link>
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-xs text-gray-400">
                        {new Date(newsItem.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                      {newsItem.category && (
                        <Link
                          href={`/categories/${newsItem.category.slug}`}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium hover:opacity-90 transition-opacity"
                          style={{ backgroundColor: `${newsItem.category.color}20`, color: newsItem.category.color }}
                        >
                          {newsItem.category.name}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <EditProfileModal
        user={currentUser}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveProfile}
      />
    </div>
  );
} 