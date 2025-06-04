import { NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/mongodb';
import News from '../../../../models/News';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await connectDB();

    // Buscar a notícia
    const news = await News.findById(id);
    if (!news) {
      return NextResponse.json(
        { error: 'Notícia não encontrada' },
        { status: 404 }
      );
    }

    // Incrementar visualizações
    news.views += 1;
    await news.save();

    return NextResponse.json({ views: news.views });
  } catch (error) {
    console.error('Erro ao registrar visualização:', error);
    return NextResponse.json(
      { error: 'Erro ao registrar visualização' },
      { status: 500 }
    );
  }
} 