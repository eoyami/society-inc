import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { connectDB } from '@/app/lib/mongodb';
import User from '@/app/models/User';

export async function GET(request: Request) {
  try {
    const session = await getServerSession();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    return NextResponse.json({
      users,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar usuários' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    await connectDB();
    const data = await request.json();
    const { id, role } = data;

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar usuário' }, { status: 500 });
  }
} 