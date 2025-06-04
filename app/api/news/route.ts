import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { connectDB } from '@/app/lib/mongodb';
import News from '@/app/models/News';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    if (!session.user.id) {
      return NextResponse.json(
        { error: 'ID do usuário não encontrado' },
        { status: 401 }
      );
    }

    const { title, content, image, category = 'Geral', tags = [], excerpt } = await request.json();

    if (!title || !content || !image || !excerpt) {
      return NextResponse.json(
        { error: 'Título, conteúdo, imagem e resumo são obrigatórios' },
        { status: 400 }
      );
    }

    await connectDB();

    // Gera o slug baseado no título
    const baseSlug = generateSlug(title);
    let slug = baseSlug;
    let counter = 1;

    // Verifica se já existe uma notícia com o mesmo slug
    while (await News.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const news = await News.create({
      title,
      content,
      image,
      excerpt,
      author: session.user.id,
      views: 0,
      featured: false,
      category,
      tags,
      slug
    });

    return NextResponse.json(news, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar notícia:', error);
    return NextResponse.json(
      { error: 'Erro ao criar notícia' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    await connectDB();

    // Busca a notícia em destaque
    const featuredNews = await News.findOne({ featured: true })
      .sort({ createdAt: -1 })
      .populate('author', 'name image');

    // Busca as notícias normais
    const [news, total] = await Promise.all([
      News.find({ featured: false })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('author', 'name image'),
      News.countDocuments({ featured: false })
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      news,
      featuredNews,
      totalPages,
      currentPage: page
    });
  } catch (error) {
    console.error('Erro ao buscar notícias:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar notícias' },
      { status: 500 }
    );
  }
} 