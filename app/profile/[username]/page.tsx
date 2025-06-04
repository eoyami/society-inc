import { notFound } from 'next/navigation';
import { connectDB } from '@/app/lib/mongodb';
import User from '@/app/models/User';
import News from '@/app/models/News';
import Profile from '@/app/components/Profile';

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

interface ProfilePageProps {
  params: {
    username: string;
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  try {
    await connectDB();
    
    const user = await User.findOne({ username: params.username })
      .select('-password')
      .lean();

    if (!user) {
      notFound();
    }

    const news = await News.find({ author: user._id })
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    // Serializar os dados do usuário
    const serializedUser = {
      ...user,
      _id: user._id.toString(),
      createdAt: user.createdAt?.toISOString(),
      updatedAt: user.updatedAt?.toISOString(),
      achievements: user.achievements?.map(achievement => ({
        ...achievement,
        _id: achievement._id.toString()
      }))
    };

    // Serializar as notícias
    const serializedNews = news.map(newsItem => ({
      ...newsItem,
      _id: newsItem._id.toString(),
      category: newsItem.category.toString(),
      author: newsItem.author.toString(),
      createdAt: newsItem.createdAt.toISOString(),
      updatedAt: newsItem.updatedAt?.toISOString()
    }));

    return <Profile user={serializedUser} news={serializedNews} />;
  } catch (error) {
    console.error('Erro ao carregar perfil:', error);
    throw new Error('Erro ao carregar perfil do usuário');
  }
} 