import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { connectDB } from '@/app/lib/mongodb';
import Achievement from '@/app/models/Achievement';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    await connectDB();
    const achievement = await Achievement.findById(params.id).lean();

    if (!achievement) {
      return NextResponse.json({ error: 'Conquista não encontrada' }, { status: 404 });
    }

    return NextResponse.json(achievement);
  } catch (error) {
    console.error('Erro ao buscar conquista:', error);
    return NextResponse.json({ error: 'Erro ao buscar conquista' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const data = await request.json();
    await connectDB();
    const achievement = await Achievement.findByIdAndUpdate(
      params.id,
      { $set: data },
      { new: true }
    ).lean();

    if (!achievement) {
      return NextResponse.json({ error: 'Conquista não encontrada' }, { status: 404 });
    }

    return NextResponse.json(achievement);
  } catch (error) {
    console.error('Erro ao atualizar conquista:', error);
    return NextResponse.json({ error: 'Erro ao atualizar conquista' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    await connectDB();
    const achievement = await Achievement.findByIdAndDelete(params.id).lean();

    if (!achievement) {
      return NextResponse.json({ error: 'Conquista não encontrada' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Conquista excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir conquista:', error);
    return NextResponse.json({ error: 'Erro ao excluir conquista' }, { status: 500 });
  }
} 