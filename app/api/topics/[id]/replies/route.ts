import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import connectDB from '@/app/lib/mongodb';
import Topic from '@/app/models/Topic';
import { addPoints } from '@/app/lib/gamification';

export async function POST(
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

    topic.replies.push({
      ...data,
      author: session.user.id,
    });

    await topic.save();

    // Adicionar pontos por responder ao tópico
    const updatedUser = await addPoints(session.user.id, 'REPLY_TOPIC');

    return NextResponse.json({
      topic,
      user: updatedUser,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao adicionar resposta' }, { status: 500 });
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
    const { replyId, content } = await request.json();
    const topic = await Topic.findById(params.id);

    if (!topic) {
      return NextResponse.json({ error: 'Tópico não encontrado' }, { status: 404 });
    }

    const reply = topic.replies.id(replyId);
    if (!reply) {
      return NextResponse.json({ error: 'Resposta não encontrada' }, { status: 404 });
    }

    if (reply.author.toString() !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    reply.content = content;
    await topic.save();

    const updatedTopic = await Topic.findById(params.id)
      .populate('author', 'name image')
      .populate('replies.author', 'name image');

    return NextResponse.json(updatedTopic);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar resposta' }, { status: 500 });
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
    const { replyId } = await request.json();
    const topic = await Topic.findById(params.id);

    if (!topic) {
      return NextResponse.json({ error: 'Tópico não encontrado' }, { status: 404 });
    }

    const reply = topic.replies.id(replyId);
    if (!reply) {
      return NextResponse.json({ error: 'Resposta não encontrada' }, { status: 404 });
    }

    if (reply.author.toString() !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    reply.remove();
    await topic.save();

    const updatedTopic = await Topic.findById(params.id)
      .populate('author', 'name image')
      .populate('replies.author', 'name image');

    return NextResponse.json(updatedTopic);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao remover resposta' }, { status: 500 });
  }
} 