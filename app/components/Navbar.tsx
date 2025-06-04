'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold text-red-600">
              Society Inc
            </Link>
          </div>

          {/* Menu Principal */}
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            <Link href="/news" className="text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium">
              Notícias
            </Link>
            <Link href="/topics" className="text-gray-500 hover:text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium">
              Tópicos
            </Link>
            <Link href="/events" className="text-gray-500 hover:text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium">
              Eventos
            </Link>
          </div>

          {/* Área de Autenticação */}
          <div className="flex items-center">
            {session ? (
              <div className="flex items-center space-x-4">
                <Link href="/profile" className="flex items-center space-x-2">
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || 'Avatar'}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-gray-500 text-sm">
                        {session.user?.name?.[0]?.toUpperCase() || 'U'}
                      </span>
                    </div>
                  )}
                  <span className="text-sm text-gray-700">{session.user?.name}</span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-sm text-gray-500 hover:text-gray-900"
                >
                  Sair
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-sm text-gray-500 hover:text-gray-900"
                >
                  Entrar
                </Link>
                <Link
                  href="/register"
                  className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
                >
                  Registrar
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 