import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { connectDB } from '@/app/lib/mongodb';
import Event from '@/app/models/Event';
import { addPoints } from '@/app/lib/gamification';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const events = await Event.find()
      .sort({ date: 1 })
      .skip(skip)
      .limit(limit)
      .populate('organizer', 'name image');

    const total = await Event.countDocuments();

    return NextResponse.json({
      events,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar eventos' }, { status: 500 });
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
    const event = await Event.create({
      ...data,
      organizer: session.user.id,
    });

    // Adicionar pontos por criar evento
    const updatedUser = await addPoints(session.user.id, 'PARTICIPATE_EVENT');

    return NextResponse.json({
      event,
      user: updatedUser,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar evento' }, { status: 500 });
  }
} 