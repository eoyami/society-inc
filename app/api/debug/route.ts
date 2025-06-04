import { NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/mongodb';
import News from '@/app/models/News';

export async function GET() {
  try {
    console.log('Conectando ao banco de dados...');
    await connectDB();
    console.log('Conexão estabelecida');

    console.log('Buscando notícias...');
    const news = await News.find()
      .populate('author', 'name username image')
      .populate('category', 'name color')
      .lean();
    console.log('Total de notícias:', news.length);

    if (news.length === 0) {
      console.log('Nenhuma notícia encontrada no banco de dados');
      return NextResponse.json({ 
        message: 'Nenhuma notícia encontrada', 
        count: 0,
        news: []
      });
    }

    console.log('Primeira notícia:', {
      id: news[0]._id,
      title: news[0].title,
      category: news[0].category,
      author: news[0].author
    });

    return NextResponse.json({
      message: 'Notícias encontradas',
      count: news.length,
      news: news.map((item: any) => ({
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
      }))
    });
  } catch (error) {
    console.error('Erro:', error);
    return NextResponse.json(
      { 
        error: 'Erro ao buscar notícias', 
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
} 