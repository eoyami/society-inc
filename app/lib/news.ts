import { connectDB } from '@/app/lib/mongodb';
import News from '../models/News';
import User from '../models/User';
import Category from '../models/Category';
import { Types } from 'mongoose';

interface NewsDocument {
  _id: Types.ObjectId;
  title: string;
  slug: string;
  content: string;
  image: string;
  category: {
    _id: Types.ObjectId;
    name: string;
    color: string;
  };
  author: {
    _id: Types.ObjectId;
    name: string;
    username: string;
    image?: string;
  };
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface News {
  _id: string;
  title: string;
  slug: string;
  content: string;
  image: string;
  category: {
    _id: string;
    name: string;
    color: string;
  };
  author: {
    _id: string;
    name: string;
    username: string;
    avatar?: string;
  };
  views: number;
  createdAt: string;
  updatedAt: string;
}

export async function getNews(limit?: number): Promise<News[]> {
  try {
    console.log('Conectando ao banco de dados...');
    await connectDB();
    console.log('Conexão estabelecida');

    console.log('Buscando notícias...');
    const query = News.find()
      .populate('author', 'name username image')
      .populate('category', 'name color')
      .sort({ createdAt: -1 });
    
    if (limit) {
      query.limit(limit);
    }

    const news = (await query.lean() as unknown) as NewsDocument[];
    console.log('Notícias encontradas:', news.length);

    if (news.length === 0) {
      console.log('Nenhuma notícia encontrada no banco de dados');
      return [];
    }

    console.log('Primeira notícia:', {
      id: news[0]._id,
      title: news[0].title,
      author: news[0].author,
      category: news[0].category
    });

    const formattedNews = news.map(item => ({
      ...item,
      _id: item._id.toString(),
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
      author: {
        ...item.author,
        _id: item.author._id.toString(),
        avatar: item.author.image
      },
      category: {
        ...item.category,
        _id: item.category._id.toString()
      }
    }));

    console.log('Notícias formatadas:', formattedNews.length);
    return formattedNews;
  } catch (error) {
    console.error('Erro ao buscar notícias:', error);
    return [];
  }
}

export async function getPopularNews(limit: number = 5): Promise<News[]> {
  try {
    await connectDB();
    const query = News.find()
      .populate('author', 'name username image')
      .populate('category', 'name color')
      .sort({ views: -1 })
      .limit(limit);
    
    const news = (await query.lean() as unknown) as NewsDocument[];
    return news.map(item => ({
      ...item,
      _id: item._id.toString(),
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
      author: {
        ...item.author,
        _id: item.author._id.toString(),
        avatar: item.author.image
      },
      category: {
        ...item.category,
        _id: item.category._id.toString()
      }
    }));
  } catch (error) {
    console.error('Erro ao buscar notícias populares:', error);
    return [];
  }
}

export async function getNewsBySlug(slug: string): Promise<News | null> {
  try {
    await connectDB();
    const news = (await News.findOne({ slug })
      .populate('author', 'name username image')
      .populate('category', 'name color')
      .lean() as unknown) as NewsDocument | null;

    if (!news) return null;

    return {
      ...news,
      _id: news._id.toString(),
      createdAt: news.createdAt.toISOString(),
      updatedAt: news.updatedAt.toISOString(),
      author: {
        ...news.author,
        _id: news.author._id.toString(),
        avatar: news.author.image
      },
      category: {
        ...news.category,
        _id: news.category._id.toString()
      }
    };
  } catch (error) {
    console.error('Erro ao buscar notícia por slug:', error);
    return null;
  }
}

export async function getNewsByCategory(categorySlug: string, limit?: number): Promise<News[]> {
  try {
    await connectDB();
    
    // Primeiro, encontre a categoria pelo slug
    const category = await Category.findOne({ slug: categorySlug });
    if (!category) {
      console.error('Categoria não encontrada:', categorySlug);
      return [];
    }

    const query = News.find({ category: category._id })
      .populate('author', 'name username image')
      .populate('category', 'name color')
      .sort({ createdAt: -1 });
    
    if (limit) {
      query.limit(limit);
    }

    const news = (await query.lean() as unknown) as NewsDocument[];
    return news.map(item => ({
      ...item,
      _id: item._id.toString(),
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
      author: {
        ...item.author,
        _id: item.author._id.toString(),
        avatar: item.author.image
      },
      category: {
        ...item.category,
        _id: item.category._id.toString()
      }
    }));
  } catch (error) {
    console.error('Erro ao buscar notícias por categoria:', error);
    return [];
  }
} 