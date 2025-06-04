import { NextRequest } from 'next/server';
import { connectDB } from '@/app/lib/mongodb';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';

export async function GET(
  request: NextRequest,
  { params }: any
) {
  try {
    await connectDB();
    const topic = await mongoose.model('Topic').findOne({ _id: new ObjectId(params.id) });

    if (!topic) {
      return new Response(JSON.stringify({ error: 'Tópico não encontrado' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(topic), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Erro ao buscar tópico' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: any
) {
  try {
    const data = await request.json();
    await connectDB();

    const result = await mongoose.model('Topic').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: data }
    );

    if (result.matchedCount === 0) {
      return new Response(JSON.stringify({ error: 'Tópico não encontrado' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ message: 'Tópico atualizado com sucesso' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Erro ao atualizar tópico' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: any
) {
  try {
    await connectDB();
    const result = await mongoose.model('Topic').deleteOne({ _id: new ObjectId(params.id) });

    if (result.deletedCount === 0) {
      return new Response(JSON.stringify({ error: 'Tópico não encontrado' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ message: 'Tópico excluído com sucesso' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Erro ao excluir tópico' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 