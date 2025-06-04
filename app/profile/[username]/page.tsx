import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { connectDB } from '@/app/lib/mongodb';
import User from '@/app/models/User';
import Profile from '@/app/components/Profile';
import { getNewsByAuthor } from '@/app/lib/news';

type Params = {
  params: Promise<{ username: string }>;
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { username } = await params;
  const user = await User.findOne({ username });

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
  const { username } = await params;
  await connectDB();
  const user = await User.findOne({ username });

  if (!user) {
    notFound();
  }

  const news = await getNewsByAuthor(user._id);

  // Converter o objeto Mongoose para um objeto JavaScript simples
  const userData = {
    ...user.toObject(),
    _id: user._id.toString(),
    createdAt: user.createdAt instanceof Date ? user.createdAt.toISOString() : user.createdAt,
    updatedAt: user.updatedAt instanceof Date ? user.updatedAt.toISOString() : user.updatedAt
  };

  // Converter as notícias também
  const newsData = news.map(item => {
    const newsItem = typeof item.toObject === 'function' ? item.toObject() : item;
    
    return {
      ...newsItem,
      _id: newsItem._id.toString(),
      author: {
        ...(typeof newsItem.author.toObject === 'function' ? newsItem.author.toObject() : newsItem.author),
        _id: newsItem.author._id.toString()
      },
      category: newsItem.category ? {
        ...(typeof newsItem.category.toObject === 'function' ? newsItem.category.toObject() : newsItem.category),
        _id: newsItem.category._id.toString()
      } : null,
      createdAt: newsItem.createdAt instanceof Date ? newsItem.createdAt.toISOString() : newsItem.createdAt,
      updatedAt: newsItem.updatedAt instanceof Date ? newsItem.updatedAt.toISOString() : newsItem.updatedAt
    };
  });

  return <Profile user={userData} news={newsData} />;
} 