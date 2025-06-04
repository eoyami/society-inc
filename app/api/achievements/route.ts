import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { connectDB } from '@/app/lib/mongodb';
import Achievement from '@/app/models/Achievement';

export async function GET(request: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    await connectDB();
    const achievements = await Achievement.find({
      unlockedBy: session.user.id,
    });

    return NextResponse.json(achievements);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar conquistas' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    await connectDB();
    const data = await request.json();
    const achievement = await Achievement.create(data);

    return NextResponse.json(achievement);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar conquista' }, { status: 500 });
  }
} 