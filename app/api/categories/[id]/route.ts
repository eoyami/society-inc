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
    const category = await mongoose.model('Category').findOne({
      _id: new ObjectId(params.id)
    });

    if (!category) {
      return new Response(JSON.stringify({ error: 'Categoria não encontrada' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(category), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Erro ao buscar categoria' }), {
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

    const result = await mongoose.model('Category').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: body }
    );

    if (result.matchedCount === 0) {
      return new Response(JSON.stringify({ error: 'Categoria não encontrada' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ message: 'Categoria atualizada com sucesso' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Erro ao atualizar categoria' }), {
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
    const result = await mongoose.model('Category').deleteOne({
      _id: new ObjectId(params.id)
    });

    if (result.deletedCount === 0) {
      return new Response(JSON.stringify({ error: 'Categoria não encontrada' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ message: 'Categoria excluída com sucesso' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Erro ao excluir categoria' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 