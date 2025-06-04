import { connectDB } from '@/app/lib/mongodb';
import News from '../models/News';

export interface News {
  updatedAt: string;
  _id: string;
  title: string;
  content: string;
  image: string;
  author: {
    _id: string;
    name: string;
    image: string;
    username: string;
  };
  views: number;
  featured: boolean;
  createdAt: string;
  category: string;
  slug: string;
}

export async function getNews(limit?: number) {
  try {
    await connectDB();
    const query = News.find().sort({ createdAt: -1 });
    
    if (limit) {
      query.limit(limit);
    }

    const news = await query.exec();
    const serializedNews = JSON.parse(JSON.stringify(news));
    console.log('Notícias encontradas:', serializedNews.length);
    return serializedNews;
  } catch (error) {
    console.error('Erro ao buscar notícias:', error);
    return [];
  }
}

export async function getPopularNews(limit: number = 5) {
  try {
    await connectDB();
    const query = News.find().sort({ views: -1 }).limit(limit);
    const news = await query.exec();
    return JSON.parse(JSON.stringify(news));
  } catch (error) {
    console.error('Erro ao buscar notícias populares:', error);
    return [];
  }
}

export async function getNewsBySlug(slug: string) {
  try {
    await connectDB();
    const news = await News.findOne({ slug });
    return news ? JSON.parse(JSON.stringify(news)) : null;
  } catch (error) {
    console.error('Erro ao buscar notícia por slug:', error);
    return null;
  }
}

export async function getNewsByCategory(category: string, limit?: number) {
  try {
    await connectDB();
    const query = News.find({ category }).sort({ createdAt: -1 });
    
    if (limit) {
      query.limit(limit);
    }

    const news = await query.exec();
    return JSON.parse(JSON.stringify(news));
  } catch (error) {
    console.error('Erro ao buscar notícias por categoria:', error);
    return [];
  }
} 