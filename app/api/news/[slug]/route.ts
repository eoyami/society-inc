import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/mongodb';
import News from '@/app/models/News';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/auth';
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
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;

    await connectDB();
    const news = await News.findOne({ slug })
      .populate('author', 'name username image')
      .populate('category', 'name color slug');

    if (!news) {
      return NextResponse.json({ error: 'Notícia não encontrada' }, { status: 404 });
    }

    return NextResponse.json(news);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao buscar notícia' }, { status: 500 });
  }
}



export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;

    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    const data = await request.json();
    const news = await News.findOneAndUpdate(
      { slug },
      data,
      { new: true }
    );
    if (!news) {
      return NextResponse.json({ error: 'Notícia não encontrada' }, { status: 404 });
    }
    return NextResponse.json(news);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao atualizar notícia' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;

    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    const news = await News.findOneAndDelete({ slug });
    if (!news) {
      return NextResponse.json({ error: 'Notícia não encontrada' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Notícia excluída com sucesso' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao excluir notícia' }, { status: 500 });
  }
} 