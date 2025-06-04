import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { connectDB } from '@/app/lib/mongodb';
import User from '@/app/models/User';
import Achievement from '@/app/models/Achievement';
import News from '@/app/models/News';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import mongoose from 'mongoose';

// Função para gerar um username único baseado no nome
async function generateUniqueUsername(name: string, userId: string) {
  // Remove acentos e caracteres especiais
  const baseUsername = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 20); // Limita a 20 caracteres

  let username = baseUsername;
  let counter = 1;
  let isUnique = false;

  while (!isUnique) {
    const existingUser = await User.findOne({ 
      username,
      _id: { $ne: userId }
    });

    if (!existingUser) {
      isUnique = true;
    } else {
      username = `${baseUsername}${counter}`;
      counter++;
    }
  }

  return username;
}

export async function GET(
  request: Request,
  params: { params: { id: string } }
) {
  try {
    const { id } = await params.params;

    console.log('Iniciando busca de usuário...');
    console.log('ID do usuário:', id);

    const session = await getServerSession(authOptions);
    if (!session) {
      console.log('Não autorizado: sessão ausente');
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    await connectDB();
    console.log('Conexão estabelecida');

    // Garantir que os modelos estão registrados
    if (!mongoose.models.Achievement) {
      mongoose.model('Achievement', Achievement.schema);
    }
    if (!mongoose.models.News) {
      mongoose.model('News', News.schema);
    }

    console.log('Buscando usuário no DB...', id);
    const user = await User.findById(id)
      .select('-password')
      .populate('achievements');

    if (!user) {
      console.log('Usuário não encontrado', id);
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    // Se o usuário não tem username, gera um baseado no nome
    if (!user.username) {
      user.username = await generateUniqueUsername(user.name, id);
      await user.save();
    }

    // Buscar as notícias do usuário
    const news = await News.find({ author: id })
      .select('title excerpt image createdAt slug')
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    console.log('Usuário encontrado:', user._id);
    console.log('Notícias encontradas:', news.length);

    const userData = user.toObject();
    return NextResponse.json({
      ...userData,
      news
    });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return NextResponse.json({ error: 'Erro ao buscar usuário' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { id } = params;
    const data = await request.json();

    await connectDB();

    // Busca o usuário atual
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    // Se o usuário não tem username, gera um baseado no nome
    if (!user.username) {
      data.username = await generateUniqueUsername(data.name || user.name, id);
    }

    // Atualiza o usuário
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { 
        ...data,
        username: data.username || user.username // Garante que o username não seja removido
      },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return NextResponse.json({ error: 'Erro ao atualizar usuário' }, { status: 500 });
    }

    // Busca as notícias do usuário
    const news = await News.find({ author: id })
      .select('title excerpt image createdAt slug')
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    return NextResponse.json({
      ...updatedUser.toObject(),
      news
    });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    return NextResponse.json({ error: 'Erro ao atualizar usuário' }, { status: 500 });
  }
} 