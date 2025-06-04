import { NextRequest } from 'next/server';
import { connectDB } from '@/app/lib/mongodb';
import mongoose from 'mongoose';

interface Author {
  _id: mongoose.Types.ObjectId;
  name: string;
  username: string;
  image?: string;
}

interface News {
  _id: mongoose.Types.ObjectId;
  title: string;
  content: string;
  image?: string;
  category: string;
  author: Author;
  views: number;
  createdAt: Date;
  updatedAt?: Date;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();
    const news = await mongoose.model<News>('News').findOne({
      slug: params.slug
    })
    .populate('author', 'name username image')
    .lean();

    if (!news) {
      return new Response(JSON.stringify({ error: 'Notícia não encontrada' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Serializar os dados
    const serializedNews = {
      ...news,
      _id: news._id.toString(),
      author: {
        _id: news.author._id.toString(),
        name: news.author.name,
        username: news.author.username,
        image: news.author.image
      },
      createdAt: news.createdAt.toISOString(),
      updatedAt: news.updatedAt?.toISOString()
    };

    return new Response(JSON.stringify(serializedNews), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Erro ao buscar notícia:', error);
    return new Response(JSON.stringify({ error: 'Erro ao buscar notícia' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();
    const body = await request.json();

    const result = await mongoose.model('News').updateOne(
      { slug: params.slug },
      { $set: body }
    );

    if (result.matchedCount === 0) {
      return new Response(JSON.stringify({ error: 'Notícia não encontrada' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ message: 'Notícia atualizada com sucesso' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Erro ao atualizar notícia' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();
    const result = await mongoose.model('News').deleteOne({
      slug: params.slug
    });

    if (result.deletedCount === 0) {
      return new Response(JSON.stringify({ error: 'Notícia não encontrada' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ message: 'Notícia excluída com sucesso' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Erro ao excluir notícia' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 