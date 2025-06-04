'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface MenuItem {
  _id: string;
  label: string;
  url: string;
  order: number;
  parentId: string | null;
}

export default function MenusPage() {
  const { data: session } = useSession();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('/api/admin/menus');
      if (!response.ok) throw new Error('Erro ao carregar menus');
      const data = await response.json();
      setMenuItems(data);
    } catch (err) {
      setError('Erro ao carregar menus');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMenuItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const form = e.currentTarget;
    const formData = new FormData(form);
    const newItem = {
      label: formData.get('label') as string,
      url: formData.get('url') as string,
      order: menuItems.length,
      parentId: formData.get('parentId') as string || null,
    };

    try {
      const response = await fetch('/api/admin/menus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Erro ao adicionar item');
      }

      await fetchMenuItems();
      setSuccess('Item adicionado com sucesso!');
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar item ao menu');
    }
  };

  const handleDeleteMenuItem = async (id: string) => {
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`/api/admin/menus?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Erro ao excluir item');
      }

      await fetchMenuItems();
      setSuccess('Item excluído com sucesso!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir item do menu');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Gerenciar Menus</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Adicionar Item ao Menu</h2>
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600">{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-600">{success}</p>
            </div>
          )}
          <form onSubmit={handleAddMenuItem} className="space-y-4">
            <div>
              <label htmlFor="label" className="block text-sm font-medium text-gray-700">
                Nome do Item
              </label>
              <input
                type="text"
                name="label"
                id="label"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                URL
              </label>
              <input
                type="text"
                name="url"
                id="url"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="parentId" className="block text-sm font-medium text-gray-700">
                Item Pai (opcional)
              </label>
              <select
                name="parentId"
                id="parentId"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Nenhum</option>
                {menuItems.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Adicionar Item
            </button>
          </form>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Itens do Menu</h2>
          <div className="space-y-2">
            {menuItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
              >
                <div>
                  <span className="font-medium">{item.label}</span>
                  <span className="text-sm text-gray-500 ml-2">{item.url}</span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDeleteMenuItem(item._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 