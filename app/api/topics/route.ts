import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { connectDB } from '@/app/lib/mongodb';
import Topic from '@/app/models/Topic';
import { addPoints } from '@/app/lib/gamification';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const topics = await Topic.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'name image')
      .populate('replies.author', 'name image');

    const total = await Topic.countDocuments();

    return NextResponse.json({
      topics,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar tópicos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    await connectDB();
    const data = await request.json();
    const topic = await Topic.create({
      ...data,
      author: session.user.id,
    });

    // Adicionar pontos por criar tópico
    const updatedUser = await addPoints(session.user.id, 'CREATE_TOPIC');

    return NextResponse.json({
      topic,
      user: updatedUser,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar tópico' }, { status: 500 });
  }
} 