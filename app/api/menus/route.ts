import { NextResponse } from 'next/server';
import { connectDB } from '../../lib/mongodb';
import MenuItem from '../../models/MenuItem';

export async function GET() {
  try {
    await connectDB();
    const menuItems = await MenuItem.find()
      .sort({ order: 1 })
      .lean();

    // Organiza os itens em uma estrutura hierárquica
    const menuMap = new Map();
    const rootItems: any[] = [];

    // Primeiro, mapeia todos os itens
    menuItems.forEach((item: any) => {
      menuMap.set(item._id.toString(), {
        ...item,
        _id: item._id.toString(),
        children: []
      });
    });

    // Depois, organiza a hierarquia
    menuItems.forEach((item: any) => {
      const menuItem = menuMap.get(item._id.toString());
      if (item.parentId) {
        const parent = menuMap.get(item.parentId.toString());
        if (parent) {
          parent.children.push(menuItem);
        }
      } else {
        rootItems.push(menuItem);
      }
    });

    return NextResponse.json(rootItems);
  } catch (error) {
    return new NextResponse('Erro interno do servidor', { status: 500 });
  }
} 