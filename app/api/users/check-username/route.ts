import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { connectDB } from '@/app/lib/mongodb';
import User from '@/app/models/User';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json({ error: 'Username não fornecido' }, { status: 400 });
    }

    await connectDB();

    // Verifica se o username já está em uso por outro usuário
    const existingUser = await User.findOne({ 
      username: username.toLowerCase(),
      _id: { $ne: session.user.id } // Exclui o usuário atual da verificação
    });

    return NextResponse.json({ available: !existingUser });
  } catch (error) {
    console.error('Erro ao verificar username:', error);
    return NextResponse.json({ error: 'Erro ao verificar username' }, { status: 500 });
  }
} 