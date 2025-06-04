import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/mongodb';
import News from '@/app/models/News';
import Comment from '@/app/models/Comment';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/auth';

// GET - Buscar comentários de uma notícia
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params;
    const { slug } = resolvedParams;
    await connectDB();
    const news = await News.findOne({ slug });
    
    if (!news) {
      return NextResponse.json(
        { error: 'Notícia não encontrada' },
        { status: 404 }
      );
    }

    // Buscar comentários principais (não são respostas)
    const comments = await Comment.find({ 
      news: news._id,
      parentComment: null 
    })
      .populate('author', 'name username image')
      .sort({ createdAt: -1 });

    // Buscar respostas para cada comentário
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await Comment.find({ parentComment: comment._id })
          .populate('author', 'name username image')
          .sort({ createdAt: 1 });
        
        const commentObj = comment.toObject();
        return {
          ...commentObj,
          replies: replies.map(reply => reply.toObject())
        };
      })
    );

    return NextResponse.json(commentsWithReplies);
  } catch (error) {
    console.error('Erro ao buscar comentários:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar comentários' },
      { status: 500 }
    );
  }
}

// POST - Criar novo comentário ou resposta
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      );
    }

    await connectDB();
    const news = await News.findOne({ slug: params.slug });
    
    if (!news) {
      return NextResponse.json(
        { error: 'Notícia não encontrada' },
        { status: 404 }
      );
    }

    const { content, parentComment } = await request.json();

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Conteúdo do comentário é obrigatório' },
        { status: 400 }
      );
    }

    // Se for uma resposta, verificar se o comentário pai existe
    if (parentComment) {
      const parentCommentDoc = await Comment.findById(parentComment);
      if (!parentCommentDoc) {
        return NextResponse.json(
          { error: 'Comentário pai não encontrado' },
          { status: 404 }
        );
      }
    }

    const comment = await Comment.create({
      content,
      news: news._id,
      author: session.user.id,
      parentComment: parentComment || null
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'name username image');

    return NextResponse.json(populatedComment, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar comentário:', error);
    return NextResponse.json(
      { error: 'Erro ao criar comentário' },
      { status: 500 }
    );
  }
} 