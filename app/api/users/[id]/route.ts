import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/auth';
import { connectDB } from '@/app/lib/mongodb';
import User from '@/app/models/User';

// Função para gerar um username único baseado no nome
async function generateUniqueUsername(name: string, userId: string) {
  console.log('Gerando username para:', { name, userId });
  
  // Remove acentos e caracteres especiais
  const baseUsername = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 20); // Limita a 20 caracteres

  console.log('Username base gerado:', baseUsername);

  let username = baseUsername;
  let counter = 1;
  let isUnique = false;

  while (!isUnique) {
    console.log('Verificando disponibilidade do username:', username);
    
    const existingUser = await User.findOne({ 
      username,
      _id: { $ne: userId }
    });

    if (!existingUser) {
      isUnique = true;
      console.log('Username disponível:', username);
    } else {
      username = `${baseUsername}${counter}`;
      counter++;
      console.log('Username já existe, tentando:', username);
    }
  }

  return username;
}

export async function GET(request: NextRequest, { params }: { params: any }) {
  try {
    await connectDB();
    const user = await User.findById(params.id)
      .select('-password')
      .populate('achievements');
    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao buscar usuário' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: any }) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session || session.user.id !== params.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    const data = await request.json();
    const user = await User.findByIdAndUpdate(
      params.id,
      data,
      { new: true }
    ).select('-password');
    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao atualizar usuário' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: any }) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session || session.user.id !== params.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    const user = await User.findByIdAndDelete(params.id);
    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Usuário excluído com sucesso' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao excluir usuário' }, { status: 500 });
  }
} 