import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/auth';
import { connectDB } from '@/app/lib/mongodb';
import User from '@/app/models/User';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse('Não autorizado', { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      role: user.role,
      email: user.email,
      name: user.name,
    });
  } catch (error) {
    console.error('Erro ao verificar role:', error);
    return NextResponse.json(
      { error: 'Erro ao verificar role' },
      { status: 500 }
    );
  }
} 