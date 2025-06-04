import { NextRequest } from 'next/server';
import { connectDB } from '@/app/lib/mongodb';
import News from '@/app/models/News';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';

type Params = {
  params: { slug: string };
};

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Não autorizado' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await connectDB();
    const news = await News.findOne({ slug: params.slug });

    if (!news) {
      return new Response(JSON.stringify({ error: 'Notícia não encontrada' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    news.featured = true;
    await news.save();

    return new Response(JSON.stringify({ message: 'Notícia destacada com sucesso' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Erro ao destacar notícia:', error);
    return new Response(JSON.stringify({ error: 'Erro ao destacar notícia' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Não autorizado' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await connectDB();
    const news = await News.findOne({ slug: params.slug });

    if (!news) {
      return new Response(JSON.stringify({ error: 'Notícia não encontrada' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    news.featured = false;
    await news.save();

    return new Response(JSON.stringify({ message: 'Notícia removida dos destaques com sucesso' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Erro ao remover notícia dos destaques:', error);
    return new Response(JSON.stringify({ error: 'Erro ao remover notícia dos destaques' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 