import { NextRequest } from 'next/server';
import { connectDB } from '@/app/lib/mongodb';
import News from '@/app/models/News';

type Params = {
  params: { slug: string };
};

export async function POST(request: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const news = await News.findOne({ slug: params.slug });

    if (!news) {
      return new Response(JSON.stringify({ error: 'Notícia não encontrada' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    news.views += 1;
    await news.save();

    return new Response(JSON.stringify({ views: news.views }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Erro ao registrar visualização:', error);
    return new Response(JSON.stringify({ error: 'Erro ao registrar visualização' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 