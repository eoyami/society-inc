import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/auth';
import { connectDB } from '@/app/lib/mongodb';
import User from '@/app/models/User';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse('Não autorizado', { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return new NextResponse('Username não fornecido', { status: 400 });
    }

    await connectDB();
    const existingUser = await User.findOne({ username }).lean();

    return NextResponse.json({ available: !existingUser });
  } catch (error) {
    console.error('Erro ao verificar username:', error);
    return new NextResponse('Erro interno do servidor', { status: 500 });
  }
} 