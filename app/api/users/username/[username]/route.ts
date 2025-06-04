import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/app/lib/db';
import User from '@/app/models/User';
import News from '@/app/models/News';
import { authOptions } from '../../../auth/[...nextauth]/route';

export async function GET(
  request: Request,
  context: { params: { username: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    console.log('Iniciando busca de usuário por username...');
    console.log('Username:', context.params.username);

    await connectDB();

    const user = await User.findOne({ username: context.params.username })
      .select('-password')
      .lean();

    if (!user) {
      console.log('Usuário não encontrado');
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    console.log('Usuário encontrado:', user._id);

    // Buscar notícias do usuário
    const news = await News.find({ author: user._id })
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    console.log('Notícias encontradas:', news.length);

    return NextResponse.json({
      ...user,
      news
    });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar usuário' },
      { status: 500 }
    );
  }
} 