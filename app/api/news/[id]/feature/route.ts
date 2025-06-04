import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { connectDB } from '@/app/lib/mongodb';
import News from '@/app/models/News';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    await connectDB();
    const { featured } = await request.json();
    
    const news = await News.findByIdAndUpdate(
      params.id,
      { featured },
      { new: true }
    );

    if (!news) {
      return NextResponse.json({ error: 'Notícia não encontrada' }, { status: 404 });
    }

    return NextResponse.json(news);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar destaque' }, { status: 500 });
  }
} 