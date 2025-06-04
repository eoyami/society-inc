import { Server as NetServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: NetServer & {
      io?: SocketIOServer;
    };
  };
};

export const initSocket = (res: NextApiResponseWithSocket) => {
  if (!res.socket.server.io) {
    const io = new SocketIOServer(res.socket.server, {
      path: '/api/socket',
      addTrailingSlash: false,
    });

    // Middleware para autenticação
    io.use(async (socket, next) => {
      try {
        const session = await getSession({ req: socket.request });
        if (session) {
          socket.data.user = session.user;
          next();
        } else {
          next(new Error('Não autorizado'));
        }
      } catch (error) {
        next(new Error('Erro de autenticação'));
      }
    });

    // Gerenciamento de conexões
    io.on('connection', (socket) => {
      const userId = socket.data.user.id;
      
      // Entrar na sala do usuário
      socket.join(`user:${userId}`);

      // Desconexão
      socket.on('disconnect', () => {
        socket.leave(`user:${userId}`);
      });
    });

    res.socket.server.io = io;
  }
  return res.socket.server.io;
}; 