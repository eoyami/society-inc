import { NextRequest } from 'next/server';
import { connectDB } from '@/app/lib/mongodb';
import News from '@/app/models/News';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';

type Params = {
  params: { slug: string };
};

interface Author {
  _id: mongoose.Types.ObjectId;
  name: string;
  username: string;
  image?: string;
}

interface News {
  _id: mongoose.Types.ObjectId;
  title: string;
  content: string;
  image?: string;
  category: string;
  author: Author;
  views: number;
  createdAt: Date;
  updatedAt?: Date;
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const news = await News.findOne({ slug: params.slug })
      .populate('author', 'name username image')
      .populate('category', 'name color')
      .lean();

    if (!news) {
      return new Response(JSON.stringify({ error: 'Notícia não encontrada' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Serializar os dados
    const serializedNews = {
      ...news,
      _id: news._id.toString(),
      author: {
        _id: news.author._id.toString(),
        name: news.author.name,
        username: news.author.username,
        image: news.author.image
      },
      createdAt: news.createdAt.toISOString(),
      updatedAt: news.updatedAt?.toISOString()
    };

    return new Response(JSON.stringify(serializedNews), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Erro ao buscar notícia:', error);
    return new Response(JSON.stringify({ error: 'Erro ao buscar notícia' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response(JSON.stringify({ error: 'Não autorizado' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await connectDB();
    const news = await News.findOne({ slug: params.slug });

    if (!news) {
      return new Response(JSON.stringify({ error: 'Notícia não encontrada' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (news.author.toString() !== session.user.id) {
      return new Response(JSON.stringify({ error: 'Não autorizado' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await request.json();
    const updatedNews = await News.findByIdAndUpdate(
      news._id,
      { $set: data },
      { new: true }
    )
      .populate('author', 'name username image')
      .populate('category', 'name color')
      .lean();

    return new Response(JSON.stringify(updatedNews), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Erro ao atualizar notícia:', error);
    return new Response(JSON.stringify({ error: 'Erro ao atualizar notícia' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response(JSON.stringify({ error: 'Não autorizado' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await connectDB();
    const news = await News.findOne({ slug: params.slug });

    if (!news) {
      return new Response(JSON.stringify({ error: 'Notícia não encontrada' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (news.author.toString() !== session.user.id) {
      return new Response(JSON.stringify({ error: 'Não autorizado' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await News.findByIdAndDelete(news._id);

    return new Response(JSON.stringify({ message: 'Notícia excluída com sucesso' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Erro ao excluir notícia:', error);
    return new Response(JSON.stringify({ error: 'Erro ao excluir notícia' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 