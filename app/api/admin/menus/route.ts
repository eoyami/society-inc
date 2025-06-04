import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { connectDB } from '../../../lib/mongodb';
import MenuItem from '../../../models/MenuItem';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return new NextResponse('Não autorizado', { status: 401 });
  }

  try {
    await connectDB();
    const menuItems = await MenuItem.find().sort({ order: 1 });
    return NextResponse.json(menuItems);
  } catch (error) {
    return new NextResponse('Erro interno do servidor', { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return new NextResponse('Não autorizado', { status: 401 });
  }

  try {
    const body = await request.json();
    const { label, url, order, parentId } = body;

    await connectDB();
    const menuItem = await MenuItem.create({
      label,
      url,
      order,
      parentId: parentId || null,
    });

    return NextResponse.json(menuItem);
  } catch (error) {
    return new NextResponse('Erro interno do servidor', { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return new NextResponse('Não autorizado', { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, label, url, order, parentId } = body;

    await connectDB();
    const menuItem = await MenuItem.findByIdAndUpdate(
      id,
      {
        label,
        url,
        order,
        parentId: parentId || null,
      },
      { new: true }
    );

    return NextResponse.json(menuItem);
  } catch (error) {
    return new NextResponse('Erro interno do servidor', { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return new NextResponse('Não autorizado', { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return new NextResponse('ID não fornecido', { status: 400 });
    }

    await connectDB();
    await MenuItem.findByIdAndDelete(id);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return new NextResponse('Erro interno do servidor', { status: 500 });
  }
} 