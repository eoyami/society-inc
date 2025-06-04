import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

interface Notification {
  _id: string;
  type: 'comment' | 'reply' | 'like' | 'follow';
  content: string;
  read: boolean;
  sender: {
    _id: string;
    name: string;
    username: string;
    image?: string;
  };
  relatedNews?: {
    _id: string;
    title: string;
    slug: string;
  };
  createdAt: string;
}

export function useNotifications() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  const connectSSE = useCallback(() => {
    if (!session) return;

    const eventSource = new EventSource('/api/notifications/stream');

    eventSource.addEventListener('connected', (event) => {
      console.log('SSE conectado:', event.data);
      setIsConnected(true);
      setError('');
    });

    eventSource.addEventListener('notifications', (event) => {
      try {
        const data = JSON.parse(event.data);
        if (Array.isArray(data)) {
          setNotifications(prev => [...data, ...prev]);
          setUnreadCount(data.length);
        }
      } catch (error) {
        console.error('Erro ao processar notificações:', error);
      }
    });

    eventSource.addEventListener('notification', (event) => {
      try {
        const data = JSON.parse(event.data);
        setNotifications(prev => [data, ...prev]);
        setUnreadCount(prev => prev + 1);
      } catch (error) {
        console.error('Erro ao processar notificação:', error);
      }
    });

    eventSource.addEventListener('error', (event) => {
      try {
        const data = JSON.parse(event.data);
        console.error('Erro no SSE:', data);
        setError(data.message || 'Erro na conexão');
        setIsConnected(false);
      } catch (error) {
        console.error('Erro ao processar mensagem de erro:', error);
      }
    });

    eventSource.addEventListener('ping', () => {
      // Manter a conexão viva
      console.log('Ping recebido');
    });

    return eventSource;
  }, [session]);

  // Inicializar SSE
  useEffect(() => {
    let eventSource: EventSource | null = null;
    let reconnectTimeout: NodeJS.Timeout;

    const setupSSE = () => {
      eventSource = connectSSE();
    };

    setupSSE();

    // Reconexão automática em caso de erro
    const handleError = () => {
      if (eventSource) {
        eventSource.close();
      }
      reconnectTimeout = setTimeout(setupSSE, 5000);
    };

    if (eventSource) {
      eventSource.addEventListener('error', handleError);
    }

    return () => {
      if (eventSource) {
        eventSource.removeEventListener('error', handleError);
        eventSource.close();
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
    };
  }, [connectSSE]);

  // Carregar notificações iniciais
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('/api/notifications');
        if (!response.ok) throw new Error('Erro ao carregar notificações');
        const data = await response.json();
        setNotifications(data);
        setUnreadCount(data.filter((n: Notification) => !n.read).length);
      } catch (error) {
        console.error('Erro ao buscar notificações:', error);
        setError('Não foi possível carregar as notificações');
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchNotifications();
    }
  }, [session]);

  // Marcar notificações como lidas
  const markAsRead = async (notificationIds: string[]) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notificationIds }),
      });

      if (!response.ok) throw new Error('Erro ao marcar notificações como lidas');

      setNotifications(prev =>
        prev.map(notification =>
          notificationIds.includes(notification._id)
            ? { ...notification, read: true }
            : notification
        )
      );

      setUnreadCount(prev => Math.max(0, prev - notificationIds.length));
    } catch (error) {
      console.error('Erro ao marcar notificações como lidas:', error);
      setError('Não foi possível marcar as notificações como lidas');
    }
  };

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    isConnected,
    markAsRead,
  };
} 