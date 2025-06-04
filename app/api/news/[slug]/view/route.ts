import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/mongodb';
import News from '@/app/models/News';

export async function POST(request: NextRequest, { params }: { params: any }) {
  try {
    await connectDB();
    const news = await News.findOneAndUpdate(
      { slug: params.slug },
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!news) {
      return NextResponse.json({ error: 'Notícia não encontrada' }, { status: 404 });
    }
    return NextResponse.json({ views: news.views });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao registrar visualização' }, { status: 500 });
  }
} 