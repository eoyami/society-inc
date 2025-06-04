import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { connectDB } from '@/app/lib/mongodb';
import User from '@/app/models/User';
import Achievement from '@/app/models/Achievement';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import mongoose from 'mongoose';

export async function GET(
  request: Request,
  params: { params: { id: string } }
) {
  try {
    const { id } = await params.params;

    console.log('Iniciando busca de usuário...');
    console.log('ID do usuário:', id);

    const session = await getServerSession(authOptions);
    if (!session) {
      console.log('Não autorizado: sessão ausente');
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    await connectDB();
    console.log('Conexão estabelecida');

    // Garantir que o modelo Achievement está registrado
    if (!mongoose.models.Achievement) {
      mongoose.model('Achievement', Achievement.schema);
    }

    console.log('Buscando usuário no DB...', id);
    const user = await User.findById(id)
      .select('-password')
      .populate('achievements');

    if (!user) {
      console.log('Usuário não encontrado', id);
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    console.log('Usuário encontrado:', user._id);
    return NextResponse.json(user);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return NextResponse.json({ error: 'Erro ao buscar usuário' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  params: { params: { id: string } }
) {
  try {
    const { id } = await params.params;

    console.log('Iniciando atualização de usuário...');
    console.log('ID do usuário para atualizar:', id);

    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.id !== id) {
      console.log('Não autorizado: sessão inválida ou usuário tentando editar outro perfil', { sessionUser: session?.user?.id, paramsId: id });
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    await connectDB();
    console.log('Conexão estabelecida para atualização');

    const data = await request.json();
    console.log('Dados recebidos para atualização:', data);

    const updatePayload: any = {};
    if (data.name !== undefined) updatePayload.name = data.name;
    if (data.image !== undefined) updatePayload.image = data.image;
    if (data.coverImage !== undefined) updatePayload.coverImage = data.coverImage;

    // Adicionar updatedAt explicitamente para garantir que timestamps funcione
    updatePayload.updatedAt = new Date();

    console.log('Payload de atualização do DB:', updatePayload); // Log do payload final para o Mongoose

    console.log('Atualizando usuário no DB...', id, updatePayload);
    const user = await User.findByIdAndUpdate(
      id,
      { $set: updatePayload }, // Usar o payload construído
      { new: true }
    ).select('-password');

    if (!user) {
      console.log('Usuário não encontrado para atualizar', id);
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    console.log('Usuário atualizado com sucesso:', user._id);
    console.log('Dados do usuário atualizado (sem senha):', user);
    return NextResponse.json(user);
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    if (error instanceof Error) {
      console.error('Detalhes do erro:', error.message);
      console.error('Stack trace:', error.stack);
    } else {
      console.error('Erro desconhecido:', error);
    }
    return NextResponse.json({ error: 'Erro ao atualizar usuário' }, { status: 500 });
  }
} 