import NextAuth from 'next-auth';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectDB } from '@/app/lib/mongodb';
import User from '../models/User';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('Credenciais ausentes');
          throw new Error('Email e senha são obrigatórios');
        }

        try {
          console.log('Tentando conectar ao MongoDB...');
          await connectDB();
          console.log('Conexão com MongoDB estabelecida');

          console.log('Buscando usuário...');
          const user = await User.findOne({ email: credentials.email });

          if (!user) {
            console.log('Usuário não encontrado');
            throw new Error('Usuário não encontrado');
          }

          console.log('Verificando senha...');
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

          if (!isPasswordValid) {
            console.log('Senha inválida');
            throw new Error('Senha inválida');
          }

          console.log('Autenticação bem-sucedida');
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            username: user.username,
            level: user.level,
            points: user.points,
          };
        } catch (error) {
          console.error('Erro detalhado na autenticação:', error);
          throw new Error('Erro ao autenticar usuário');
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.username = user.username;
        token.level = user.level;
        token.points = user.points;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).username = token.username;
        (session.user as any).level = token.level;
        (session.user as any).points = token.points;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
  logger: {
    error(code, metadata) {
      console.error('NextAuth Error:', code, metadata);
    },
    warn(code) {
      console.warn('NextAuth Warning:', code);
    },
    debug(code, metadata) {
      console.debug('NextAuth Debug:', code, metadata);
    }
  }
};

export default NextAuth(authOptions); 