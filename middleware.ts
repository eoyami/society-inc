import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import { getToken, JWT } from 'next-auth/jwt';

interface Token extends JWT {
  role: string;
}

export default withAuth(
  async function middleware(req) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET }) as unknown as Token | null;
    // Verifica se a rota é uma rota de admin
    const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');
    console.log('Middleware - URL:', req.nextUrl.pathname);
    console.log('Middleware - Token:', token);
    console.log('Middleware - Is Admin Route:', isAdminRoute);

    if (isAdminRoute) {
      if (!token) {
        console.log('Middleware: Token não encontrado, redirecionando para login');
        return NextResponse.redirect(new URL('/login', req.url));
      }

      if (token.role !== 'admin') {
        console.log('Middleware: Usuário não é admin, redirecionando para home');
        return NextResponse.redirect(new URL('/', req.url));
      }

      console.log('Middleware: Acesso permitido à rota admin');
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Permitir que requisições do Socket.IO passem sem autenticação
        if (req.nextUrl.pathname.startsWith('/api/socket')) {
          return true;
        }
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    '/admin/:path*',
  ],
}; 