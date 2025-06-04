import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { connectDB } from '@/app/lib/mongodb';
import User from '@/app/models/User';
import Profile from '@/app/components/Profile';
import { getNewsByAuthor } from '@/app/lib/news';

type Params = {
  params: { username: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const user = await User.findOne({ username: params.username });

  if (!user) {
    return {
      title: 'Usuário não encontrado',
      description: 'O usuário que você está procurando não existe.'
    };
  }

  return {
    title: `${user.name} (@${user.username})`,
    description: `Perfil de ${user.name}`
  };
}

export default async function UserPage({ params }: Params) {
  await connectDB();
  const user = await User.findOne({ username: params.username });

  if (!user) {
    notFound();
  }

  const news = await getNewsByAuthor(user._id);

  return <Profile user={user} news={news} />;
} 