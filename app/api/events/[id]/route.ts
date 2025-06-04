import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { connectDB } from '@/app/lib/mongodb';
import Event from '@/app/models/Event';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const event = await Event.findById(params.id).populate('organizer', 'name image');
    
    if (!event) {
      return NextResponse.json({ error: 'Evento não encontrado' }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar evento' }, { status: 500 });
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

    await connectDB();
    const data = await request.json();
    const event = await Event.findByIdAndUpdate(
      params.id,
      { ...data },
      { new: true }
    );

    if (!event) {
      return NextResponse.json({ error: 'Evento não encontrado' }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar evento' }, { status: 500 });
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
    const event = await Event.findByIdAndDelete(params.id);

    if (!event) {
      return NextResponse.json({ error: 'Evento não encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Evento removido com sucesso' });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao remover evento' }, { status: 500 });
  }
} 