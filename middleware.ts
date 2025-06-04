import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import { JWT } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

interface Token extends JWT {
  role: string;
}

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token as Token;
    const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');
    const isSocketRoute = req.nextUrl.pathname.startsWith('/api/socket');

    console.log('Middleware - URL:', req.nextUrl.pathname);
    console.log('Middleware - Token:', token);
    console.log('Middleware - Is Admin Route:', isAdminRoute);
    console.log('Middleware - Is Socket Route:', isSocketRoute);

    // Permitir que as requisições do Socket.IO passem sem autenticação
    if (isSocketRoute) {
      return NextResponse.next();
    }

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
    '/api/socket/:path*',
    '/admin/:path*',
  ],
}; 