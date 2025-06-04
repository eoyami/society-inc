import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { connectDB } from '@/app/lib/mongodb';
import Topic from '@/app/models/Topic';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const topic = await Topic.findById(params.id)
      .populate('author', 'name image')
      .populate('replies.author', 'name image');
    
    if (!topic) {
      return NextResponse.json({ error: 'Tópico não encontrado' }, { status: 404 });
    }

    return NextResponse.json(topic);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar tópico' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    await connectDB();
    const data = await request.json();
    const topic = await Topic.findById(params.id);

    if (!topic) {
      return NextResponse.json({ error: 'Tópico não encontrado' }, { status: 404 });
    }

    if (topic.author.toString() !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const updatedTopic = await Topic.findByIdAndUpdate(
      params.id,
      { ...data },
      { new: true }
    );

    return NextResponse.json(updatedTopic);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar tópico' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    await connectDB();
    const topic = await Topic.findById(params.id);

    if (!topic) {
      return NextResponse.json({ error: 'Tópico não encontrado' }, { status: 404 });
    }

    if (topic.author.toString() !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    await Topic.findByIdAndDelete(params.id);

    return NextResponse.json({ message: 'Tópico removido com sucesso' });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao remover tópico' }, { status: 500 });
  }
} 