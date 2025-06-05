import { DefaultSession } from 'next-auth';
import NextAuth from 'next-auth';
import { authOptions } from '@/app/lib/auth';

// Extend the User type to include the role
declare module 'next-auth' {
  interface User {
    role: string;
  }

  interface Session extends DefaultSession {
    user: {
      level: number;
      points: number;
      id?: string | null;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
  }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 