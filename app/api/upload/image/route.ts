import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { writeFile } from 'fs/promises';
import path from 'path';
import crypto from 'crypto'; // To generate unique filenames

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
  console.log('Iniciando upload de imagem...');
  try {
    const session = await getServerSession(authOptions);
    console.log('Sessão:', session);

    // Check for admin session
    if (!session?.user || session.user.role !== 'admin') {
      console.log('Usuário não autorizado para upload');
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }

    // Attempt to get file from request body
    // This part requires careful handling of multipart/form-data.
    // The standard `request.json()` or `request.text()` won't work.
    // You typically read the stream or use a library.
    // Let's assume, for a simplified example, we can get a file object.
    // A real implementation would parse the 'request.body' stream.
    
    // --- Placeholder for parsing multipart/form-data ---
    // Example using formidable (you would need to install and configure)
    // const form = formidable();
    // const [fields, files] = await form.parse(request);
    // const file = files.image ? files.image[0] : null;
    // ---------------------------------------------------
    
    // --- Simplified example assuming direct file access (may not work as is) ---
    // You need to adapt this part based on how you parse the request body.
    const formData = await request.formData();
    const file = formData.get('image') as File | null;
    
    if (!file) {
      console.log('Nenhum arquivo encontrado na requisição');
      return NextResponse.json({ message: 'Nenhum arquivo enviado' }, { status: 400 });
    }

    console.log('Arquivo recebido:', file.name, file.size, file.type);

    // Generate a unique filename
    const fileExtension = path.extname(file.name);
    const uniqueSuffix = crypto.randomBytes(8).toString('hex');
    const baseName = path.basename(file.name, fileExtension);
    const filename = `${baseName}-${uniqueSuffix}${fileExtension}`;
    console.log('Nome do arquivo gerado:', filename);

    // Define the path to save the file in the public directory
    const publicDir = path.join(process.cwd(), 'public');
    const uploadDir = path.join(publicDir, 'uploads'); // Optional: save in an 'uploads' subdir
    const filePath = path.join(uploadDir, filename);
    console.log('Caminho para salvar o arquivo:', filePath);

     // Ensure the upload directory exists (optional but good practice)
    // await mkdir(uploadDir, { recursive: true }); // Requires 'fs/promises' mkdir

    // Convert file to Buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await writeFile(filePath, buffer);
    console.log('Arquivo salvo com sucesso!');

    // Return the public URL of the saved image
    const publicUrl = `/uploads/${filename}`; // Adjust if you saved directly in 'public'
    console.log('URL pública da imagem:', publicUrl);

    return NextResponse.json({ url: publicUrl }, { status: 201 });

  } catch (error) {
    console.error('Erro no upload de imagem:', error);
    return NextResponse.json(
      { 
        message: 'Erro no upload da imagem',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 