'use client';

import { useEffect, useState, use } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface News {
  _id: string;
  title: string;
  excerpt: string;
  image: string;
  createdAt: string;
  slug: string;
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
  news?: News[];
}

export default function UserProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/username/${username}`);
        if (!response.ok) throw new Error('Erro ao carregar perfil');
        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError('Erro ao carregar perfil');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [username, status, router]);

  if (status === 'loading' || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">{error || 'Erro ao carregar perfil'}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="relative h-64 w-full rounded-lg overflow-hidden mb-20">
        {user.coverImage && user.coverImage.trim() !== '' ? (
          <Image
            src={user.coverImage}
            alt={`${user.name}'s cover image`}
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
              {user.image && user.image.trim() !== '' ? (
                <Image
                  src={user.image}
                  alt={user.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-700 text-4xl">{user.name.charAt(0)}</div>
              )}
            </div>
            <div className="mt-4 text-center">
              <h3 className="text-2xl font-bold text-gray-900">
                {user.name}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                @{user.username}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {user.email}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-3">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Nível</dt>
              <dd className="mt-1 text-lg font-semibold text-gray-900">{user.level}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Pontos</dt>
              <dd className="mt-1 text-lg font-semibold text-gray-900">{user.points}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Função</dt>
              <dd className="mt-1 text-lg font-semibold text-gray-900">
                {user.role === 'admin' ? 'Administrador' : 'Usuário'}
              </dd>
            </div>
          </dl>
        </div>

        {user.achievements && user.achievements.length > 0 && (
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Conquistas
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {user.achievements.map((achievement) => (
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

        {user.news && user.news.length > 0 && (
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Notícias Publicadas
            </h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {user.news.map((news) => (
                <Link
                  key={news._id}
                  href={`/news/${news.slug}`}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className="relative h-48 w-full">
                    {news.image && news.image.trim() !== '' ? (
                      <Image
                        src={news.image}
                        alt={news.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                        Sem imagem
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h4 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {news.title}
                    </h4>
                    <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                      {news.excerpt}
                    </p>
                    <p className="mt-2 text-xs text-gray-400">
                      {new Date(news.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 