import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/auth';
import { connectDB } from '@/app/lib/mongodb';
import News from '@/app/models/News';
import Category from '@/app/models/Category';
import { slugify } from '@/app/lib/utils';

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const categorySlug = searchParams.get('category');
    const search = searchParams.get('search');

    await connectDB();

    const query: any = {};
    if (categorySlug) {
      const category = await Category.findOne({ slug: categorySlug });
      if (category) {
        query.category = category._id;
      }
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    const [news, total] = await Promise.all([
      News.find(query)
        .populate('author', 'name username image')
        .populate('category', 'name color')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      News.countDocuments(query),
    ]);

    return NextResponse.json({
      news,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error('Erro ao buscar notícias:', error);
    return new NextResponse('Erro interno do servidor', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    console.log('Sessão:', session);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const data = await request.json();
    console.log('Dados recebidos:', data);
    
    const { title, content, image, categoryId, excerpt, featured, tags } = data;

    // Validação detalhada dos campos
    const missingFields = [];
    if (!title) missingFields.push('título');
    if (!content) missingFields.push('conteúdo');
    if (!categoryId) missingFields.push('categoria');

    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          error: 'Campos obrigatórios faltando',
          missingFields,
          message: `Por favor, preencha os seguintes campos: ${missingFields.join(', ')}`
        },
        { status: 400 }
      );
    }

    await connectDB();

    // Verificar se a categoria existe
    const category = await Category.findById(categoryId);
    if (!category) {
      return NextResponse.json(
        { error: 'Categoria não encontrada' },
        { status: 400 }
      );
    }

    // Criar slug a partir do título
    const slug = slugify(title);
    console.log('Slug gerado:', slug);

    // Verificar se já existe uma notícia com o mesmo slug
    const existingNews = await News.findOne({ slug });
    if (existingNews) {
      return NextResponse.json(
        { error: 'Já existe uma notícia com este título' },
        { status: 400 }
      );
    }

    const newsData = {
      title,
      slug,
      content,
      image,
      category: categoryId,
      author: session.user.id,
      excerpt: excerpt || content.substring(0, 200) + '...',
      featured: featured || false,
      tags: tags || []
    };

    console.log('Criando notícia com dados:', newsData);

    const news = await News.create(newsData);
    console.log('Notícia criada com sucesso:', news._id);

    return NextResponse.json(news, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar notícia:', error);
    return NextResponse.json(
      { 
        error: 'Erro ao criar notícia',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
} 