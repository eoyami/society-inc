import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/auth';
import { connectDB } from '@/app/lib/mongodb';
import User from '@/app/models/User';
import Achievement from '@/app/models/Achievement';
import News from '@/app/models/News';
import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';

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

export async function GET(
  request: NextRequest,
  { params }: any
) {
  try {
    await connectDB();
    const user = await mongoose.model('User').findOne({ _id: new ObjectId(params.id) });

    if (!user) {
      return new Response(JSON.stringify({ error: 'Usuário não encontrado' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(user), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Erro ao buscar usuário' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: any
) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.id !== params.id && session.user.role !== 'admin')) {
    return new Response(JSON.stringify({ error: 'Não autorizado' }), { status: 401 });
  }

  try {
    const data = await request.json();
    await connectDB();

    const result = await mongoose.model('User').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: data }
    );

    if (result.matchedCount === 0) {
      return new Response(JSON.stringify({ error: 'Usuário não encontrado' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ message: 'Usuário atualizado com sucesso' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Erro ao atualizar usuário' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: any
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return new Response(JSON.stringify({ error: 'Não autorizado' }), { status: 401 });
  }

  try {
    await connectDB();
    const result = await mongoose.model('User').deleteOne({ _id: new ObjectId(params.id) });

    if (result.deletedCount === 0) {
      return new Response(JSON.stringify({ error: 'Usuário não encontrado' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ message: 'Usuário excluído com sucesso' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Erro ao excluir usuário' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 