import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import { JWT } from 'next-auth/jwt';

interface Token extends JWT {
  role: string;
}

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token as Token;
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
      authorized: ({ token }) => {
        console.log('Middleware - authorized callback - Token:', token);
        return true; // Permitir que o middleware principal faça a verificação
      },
    },
  }
);

export const config = {
  matcher: ['/admin/:path*'],
}; 