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
    const event = await mongoose.model('Event').findOne({
      _id: new ObjectId(params.id)
    });

    if (!event) {
      return new Response(JSON.stringify({ error: 'Evento não encontrado' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(event), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Erro ao buscar evento' }), {
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
    await connectDB();
    const body = await request.json();

    const result = await mongoose.model('Event').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: body }
    );

    if (result.matchedCount === 0) {
      return new Response(JSON.stringify({ error: 'Evento não encontrado' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ message: 'Evento atualizado com sucesso' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Erro ao atualizar evento' }), {
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
    const result = await mongoose.model('Event').deleteOne({
      _id: new ObjectId(params.id)
    });

    if (result.deletedCount === 0) {
      return new Response(JSON.stringify({ error: 'Evento não encontrado' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ message: 'Evento excluído com sucesso' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Erro ao excluir evento' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 