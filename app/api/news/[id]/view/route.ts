import { NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/mongodb';
import News from '@/app/models/News';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { error: 'Slug da notícia não fornecido' },
        { status: 400 }
      );
    }

    await connectDB();
    
    const news = await News.findOneAndUpdate(
      { slug: id },
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!news) {
      return NextResponse.json(
        { error: 'Notícia não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({ views: news.views });
  } catch (error) {
    console.error('Erro ao registrar visualização:', error);
    return NextResponse.json(
      { error: 'Erro ao registrar visualização' },
      { status: 500 }
    );
  }
} 