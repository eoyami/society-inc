import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/auth';
import { connectDB } from '@/app/lib/mongodb';
import User from '@/app/models/User';

// Helper function to parse multipart/form-data
// NOTE: Parsing multipart/form-data directly in Next.js API routes
// can be complex. Consider using a library like 'formidable'
// or adapting Next.js's experimental body parsing options.
// This is a simplified example and might need adjustments
// based on how the request body is actually structured when sent.
// For this to work, you might need to disable body parsing for this route
// in a `route.config.js` file in the same directory:
/*
export const config = {
  api: {
    bodyParser: false,
  },
};
*/

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse('Não autorizado', { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new NextResponse('Nenhum arquivo enviado', { status: 400 });
    }

    // Aqui você implementaria a lógica de upload para seu serviço de armazenamento
    // Por exemplo, usando o Cloudinary, AWS S3, etc.
    // Por enquanto, vamos apenas simular um upload bem-sucedido

    const imageUrl = 'https://via.placeholder.com/150';

    // Atualiza o avatar do usuário
    await connectDB();
    await User.findByIdAndUpdate(session.user.id, { image: imageUrl });

    return NextResponse.json({ url: imageUrl });
  } catch (error) {
    console.error('Erro ao fazer upload da imagem:', error);
    return new NextResponse('Erro interno do servidor', { status: 500 });
  }
} 