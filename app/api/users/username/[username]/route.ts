import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/auth';
import { connectDB } from '@/app/lib/mongodb';
import mongoose from 'mongoose';
import User from '@/app/models/User';
import News from '@/app/models/News';

interface UserDocument {
  _id: string;
  name: string;
  email: string;
  username: string;
  image: string;
  role: string;
  points: number;
  level: number;
}

export async function GET(
  request: NextRequest,
  { params }: any
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response(JSON.stringify({ error: 'Não autorizado' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('Iniciando busca de usuário por username...');
    console.log('Username:', params.username);

    await connectDB();

    const user = await User.findOne({ username: params.username }) as UserDocument | null;

    if (!user) {
      console.log('Usuário não encontrado');
      return new Response(JSON.stringify({ error: 'Usuário não encontrado' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('Usuário encontrado:', user._id);

    // Buscar notícias do usuário
    const news = await News.find({ author: user._id })
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    console.log('Notícias encontradas:', news.length);

    return new Response(JSON.stringify({
      ...user,
      news
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return new Response(JSON.stringify({ error: 'Erro ao buscar usuário' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 