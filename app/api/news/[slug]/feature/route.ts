import { NextRequest } from 'next/server';
import { connectDB } from '@/app/lib/mongodb';
import mongoose from 'mongoose';

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();
    const result = await mongoose.model('News').updateOne(
      { slug: params.slug },
      { $set: { featured: true } }
    );

    if (result.matchedCount === 0) {
      return new Response(JSON.stringify({ error: 'Notícia não encontrada' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ message: 'Notícia destacada com sucesso' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Erro ao destacar notícia' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();
    const result = await mongoose.model('News').updateOne(
      { slug: params.slug },
      { $set: { featured: false } }
    );

    if (result.matchedCount === 0) {
      return new Response(JSON.stringify({ error: 'Notícia não encontrada' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ message: 'Notícia removida dos destaques com sucesso' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Erro ao remover notícia dos destaques' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 