import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/auth';
import { connectDB } from '@/app/lib/mongodb';
import User from '@/app/models/User';
import News from '@/app/models/News';
import Category from '@/app/models/Category';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    await connectDB();

    const [
      totalUsers,
      totalNews,
      totalCategories,
      recentUsers,
      recentNews
    ] = await Promise.all([
      User.countDocuments(),
      News.countDocuments(),
      Category.countDocuments(),
      User.find().sort({ createdAt: -1 }).limit(5).select('name email role createdAt'),
      News.find().sort({ createdAt: -1 }).limit(5).select('title author createdAt')
    ]);

    return NextResponse.json({
      totalUsers,
      totalNews,
      totalCategories,
      recentUsers,
      recentNews
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar estatísticas' },
      { status: 500 }
    );
  }
} 