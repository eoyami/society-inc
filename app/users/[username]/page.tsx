import { connectDB } from '@/app/lib/mongodb';
import User from '@/app/models/User';
import NewsCard from '@/app/components/NewsCard';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { News } from '@/app/types';

interface Achievement {
  _id: string;
  name: string;
  description: string;
  image: string;
}

interface UserPageProps {
  params: {
    username: string;
  };
}

export default async function UserPage({ params }: UserPageProps) {
  console.log('Parâmetros recebidos:', params);

  if (!params?.username) {
    console.log('Username não fornecido');
    notFound();
  }

  try {
    await connectDB();
    console.log('Buscando usuário com username:', params.username);

    const user = await User.findOne({ username: params.username })
      .select('-password -email')
      .populate<{ news: News[] }>({
        path: 'news',
        options: { strictPopulate: false }
      });
    
    console.log('Usuário encontrado:', user ? 'Sim' : 'Não');
    
    if (!user) {
      console.log('Usuário não encontrado');
      notFound();
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
                {user.achievements.map((achievement: Achievement) => (
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
                Últimas Notícias
              </h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {user.news.map((news: News) => (
                  <NewsCard key={news._id} news={news} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Erro ao carregar perfil do usuário:', error);
    notFound();
  }
} 