'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

interface MenuItem {
  _id: string;
  label: string;
  url: string;
  order: number;
  parentId: string | null;
  children: MenuItem[];
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch('/api/menus');
        if (!response.ok) throw new Error('Erro ao carregar menus');
        const data = await response.json();
        setMenuItems(data);
      } catch (err) {
        console.error('Erro ao carregar menus:', err);
      }
    };

    fetchMenuItems();
  }, []);

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
  };

  const renderMenuItem = (item: MenuItem) => {
    const hasChildren = item.children && item.children.length > 0;
    const isActive = pathname === item.url;

    return (
      <div key={item._id} className="relative group h-full flex items-center">
        <Link
          href={item.url}
          className={`border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-3 py-2 border-b-2 text-sm font-medium ${
            isActive ? 'border-blue-500 text-blue-600' : ''
          }`}
        >
          {item.label}
          {hasChildren && (
            <svg
              className="ml-1 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          )}
        </Link>
        {hasChildren && (
          <div className="absolute left-0 top-full mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <div className="py-1">
              {item.children.map((child) => (
                <Link
                  key={child._id}
                  href={child.url}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  {child.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Se estiver na rota admin, renderiza apenas o botão de voltar e o conteúdo
  if (isAdminRoute) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Voltar ao site
          </Link>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="text-xl font-bold text-gray-900">
                  Society
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {menuItems.map((item) => renderMenuItem(item))}
              </div>
            </div>

            {/* Menu mobile */}
            <div className="sm:hidden flex items-center">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <span className="sr-only">Abrir menu</span>
                <svg
                  className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                <svg
                  className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="hidden sm:flex sm:items-center sm:space-x-4">
              {session ? (
                <>
                  {session.user?.role === 'admin' && (
                    <Link
                      href="/admin"
                      className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Admin
                    </Link>
                  )}
                  <Link
                    href="/profile"
                    className={`text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium ${
                      pathname === '/profile' ? 'text-blue-600 font-medium' : ''
                    }`}
                  >
                    Perfil
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Sair
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Entrar
                  </Link>
                  <Link
                    href="/register"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Registrar
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Menu mobile expandido */}
        <div className={`${isMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
          <div className="pt-2 pb-3 space-y-1">
            {menuItems.map((item) => (
              <div key={item._id}>
                <Link
                  href={item.url}
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    pathname === item.url
                      ? 'border-blue-500 text-blue-700 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  {item.label}
                </Link>
                {item.children && item.children.length > 0 && (
                  <div className="pl-6">
                    {item.children.map((child) => (
                      <Link
                        key={child._id}
                        href={child.url}
                        className="block pl-3 pr-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            {session ? (
              <div className="space-y-1">
                {session.user?.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="block pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  href="/profile"
                  className={`block pl-3 pr-4 py-2 text-base font-medium ${
                    pathname === '/profile'
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  }`}
                >
                  Perfil
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left pl-3 pr-4 py-2 text-base font-medium text-red-600 hover:bg-gray-50"
                >
                  Sair
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                <Link
                  href="/login"
                  className="block pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                >
                  Entrar
                </Link>
                <Link
                  href="/register"
                  className="block pl-3 pr-4 py-2 text-base font-medium text-blue-600 hover:bg-gray-50"
                >
                  Registrar
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-grow">{children}</main>

      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Portal de Notícias. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
} 