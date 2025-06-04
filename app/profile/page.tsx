'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import EditProfileModal from '@/app/components/EditProfileModal';

interface User {
  _id: string;
  name: string;
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

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!session) {
      router.push('/login');
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${session.user.id}`);
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
  }, [session, router]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveProfile = async (updatedUser: { name: string; image?: string; coverImage?: string }) => {
    if (!session?.user?.id) return;

    try {
      const response = await fetch(`/api/users/${session.user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) throw new Error('Erro ao atualizar perfil');

      const updatedUserData = await response.json();
      setUser(updatedUserData);
      console.log('Perfil atualizado com sucesso!');

    } catch (err) {
      console.error('Erro ao salvar perfil:', err);
      throw err;
    }
  };

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
      <div className="relative h-48 w-full rounded-lg overflow-hidden mb-6">
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
        <button 
          className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 z-10"
          onClick={openModal}
        >
          Editar Perfil
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex items-center">
            <div className="relative h-20 w-20 rounded-full overflow-hidden -mt-10 border-4 border-white bg-gray-400">
              {user.image && user.image.trim() !== '' ? (
                <Image
                  src={user.image}
                  alt={user.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-700 text-2xl">{user.name.charAt(0)}</div>
              )}
            </div>
            <div className="ml-4 pt-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {user.name}
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {user.email}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Nível</dt>
              <dd className="mt-1 text-sm text-gray-900">{user.level}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Pontos</dt>
              <dd className="mt-1 text-sm text-gray-900">{user.points}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Função</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {user.role === 'admin' ? 'Administrador' : 'Usuário'}
              </dd>
            </div>
          </dl>
        </div>

        {user.achievements.length > 0 && (
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Conquistas
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {user.achievements.map((achievement) => (
                <div
                  key={achievement._id}
                  className="bg-gray-50 rounded-lg p-4 flex items-center"
                >
                  <div className="relative h-12 w-12 flex-shrink-0">
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
                    <h4 className="text-sm font-medium text-gray-900">
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
      </div>

      {user && (
        <EditProfileModal 
          user={user} 
          isOpen={isModalOpen} 
          onClose={closeModal} 
          onSave={handleSaveProfile} 
        />
      )}
    </div>
  );
} 