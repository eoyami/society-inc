import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/auth';
import { connectDB } from '@/app/lib/mongodb';
import Notification from '@/app/models/Notification';

export const runtime = 'edge';

const clients = new Map();

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const userId = session.user.id;

    // Criar um novo WebSocket
    const { socket, response } = new WebSocketPair();

    // Armazenar o cliente
    clients.set(userId, socket);

    // Configurar o WebSocket
    socket.accept();

    // Lidar com mensagens
    socket.addEventListener('message', async (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'notification') {
          // Não enviar notificação se o remetente for o mesmo que o destinatário
          if (data.sender === data.recipient) {
            return;
          }

          await connectDB();
          
          const notification = new Notification({
            recipient: data.recipient,
            sender: data.sender,
            type: data.type,
            content: data.content,
            relatedNews: data.relatedNews._id,
            read: false,
          });

          await notification.save();

          // Enviar notificação para o destinatário
          const recipientSocket = clients.get(data.recipient);
          if (recipientSocket) {
            recipientSocket.send(JSON.stringify({
              type: 'newNotification',
              data: {
                ...notification.toObject(),
                sender: {
                  _id: session.user.id,
                  name: session.user.name || '',
                  username: (session.user as any).username || '',
                  image: session.user.image
                },
                relatedNews: data.relatedNews
              }
            }));
          }
        }
      } catch (error) {
        console.error('Erro ao processar mensagem:', error);
      }
    });

    // Lidar com desconexão
    socket.addEventListener('close', () => {
      clients.delete(userId);
    });

    return response;
  } catch (error) {
    console.error('Erro ao inicializar WebSocket:', error);
    return NextResponse.json(
      { error: 'Erro ao inicializar WebSocket' },
      { status: 500 }
    );
  }
} 