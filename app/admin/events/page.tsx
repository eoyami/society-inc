"use client";

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';

interface Event {
  _id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  location: string;
  organizer: {
    name: string;
    image: string;
  };
  participants: number;
}

export default function EventsPage() {
  const { data: session } = useSession();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`/api/events?page=${page}&limit=10`);
        if (!response.ok) throw new Error('Erro ao carregar eventos');
        const data = await response.json();
        setEvents(data.events);
        setTotalPages(Math.ceil(data.total / 10));
      } catch (err) {
        setError('Erro ao carregar eventos');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [page]);

  const deleteEvent = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este evento?')) return;

    try {
      const response = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Erro ao excluir evento');

      setEvents(events.filter(item => item._id !== id));
    } catch (err) {
      setError('Erro ao excluir evento');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Gerenciar Eventos</h1>
        <Link
          href="/admin/events/new"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Novo Evento
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {events.map((item) => (
            <li key={item._id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12 relative">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="rounded-md object-cover"
                      />
                    </div>
                    <div className="ml-4">
                      <h2 className="text-lg font-medium text-gray-900">
                        {item.title}
                      </h2>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <p>
                          {new Date(item.date).toLocaleDateString()} •{' '}
                          {item.location} • {item.participants} participantes
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Link
                      href={`/admin/events/${item._id}/edit`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => deleteEvent(item._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              Anterior
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              Próxima
            </button>
          </nav>
        </div>
      )}
    </div>
  );
} 