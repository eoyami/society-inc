import { NextRequest } from 'next/server';
import { connectDB } from '@/app/lib/mongodb';
import mongoose from 'mongoose';

export async function POST(
  request: NextRequest,
  { params }: { params: any }
) {
  try {
    await connectDB();
    const result = await mongoose.model('News').updateOne(
      { slug: params.slug },
      { $inc: { views: 1 } }
    );

    if (result.matchedCount === 0) {
      return new Response(JSON.stringify({ error: 'Notícia não encontrada' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const news = await mongoose.model('News').findOne({ slug: params.slug });
    return new Response(JSON.stringify({ views: news.views }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Erro ao registrar visualização' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 