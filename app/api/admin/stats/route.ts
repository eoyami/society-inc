import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/app/lib/mongodb';
import User from '@/app/models/User';
import News from '@/app/models/News';
import Topic from '@/app/models/Topic';
import Event from '@/app/models/Event';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

interface Session {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
    id?: string;
  };
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.role || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    await connectDB();

    const [totalUsers, totalNews, totalTopics, totalEvents] = await Promise.all([
      User.countDocuments(),
      News.countDocuments(),
      Topic.countDocuments(),
      Event.countDocuments(),
    ]);

    return NextResponse.json({
      totalUsers,
      totalNews,
      totalTopics,
      totalEvents,
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar estatísticas' },
      { status: 500 }
    );
  }
} 