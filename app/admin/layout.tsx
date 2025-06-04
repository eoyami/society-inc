'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!session || session.user.role !== 'admin') {
    router.push('/');
    return null;
  }

  const isActive = (path: string) => pathname === path;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/admin" className="text-xl font-bold text-white">
                  Admin
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  href="/admin/news"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive('/admin/news')
                      ? 'border-blue-500 text-white'
                      : 'border-transparent text-gray-300 hover:text-white hover:border-gray-300'
                  }`}
                >
                  Notícias
                </Link>
                <Link
                  href="/admin/topics"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive('/admin/topics')
                      ? 'border-blue-500 text-white'
                      : 'border-transparent text-gray-300 hover:text-white hover:border-gray-300'
                  }`}
                >
                  Tópicos
                </Link>
                <Link
                  href="/admin/events"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive('/admin/events')
                      ? 'border-blue-500 text-white'
                      : 'border-transparent text-gray-300 hover:text-white hover:border-gray-300'
                  }`}
                >
                  Eventos
                </Link>
                <Link
                  href="/admin/menus"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive('/admin/menus')
                      ? 'border-blue-500 text-white'
                      : 'border-transparent text-gray-300 hover:text-white hover:border-gray-300'
                  }`}
                >
                  Menus
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 border border-gray-700 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
} 