'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export default function EditCategoryPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    fetchCategory();
  }, [params.id]);

  const fetchCategory = async () => {
    try {
      const response = await fetch(`/api/categories/${params.id}`);
      if (!response.ok) throw new Error('Erro ao carregar categoria');
      const data = await response.json();
      setCategory(data);
      setPreviewImage(data.image);
    } catch (err) {
      setError('Erro ao carregar categoria');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/categories/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(category),
      });

      if (!response.ok) throw new Error('Erro ao atualizar categoria');
      
      router.push('/admin/categories');
    } catch (err) {
      setError('Erro ao atualizar categoria');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!category) return <div>Categoria não encontrada</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Editar Categoria</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nome
            </label>
            <input
              type="text"
              id="name"
              value={category.name}
              onChange={(e) => setCategory({ ...category, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Descrição
            </label>
            <textarea
              id="description"
              value={category.description}
              onChange={(e) => setCategory({ ...category, description: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
              URL da Imagem
            </label>
            <input
              type="url"
              id="image"
              value={category.image}
              onChange={(e) => {
                setCategory({ ...category, image: e.target.value });
                setPreviewImage(e.target.value);
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
            {previewImage && (
              <div className="mt-2 relative h-48 w-full">
                <Image
                  src={previewImage}
                  alt="Preview"
                  fill
                  className="object-cover rounded-md"
                />
              </div>
            )}
          </div>

          <div>
            <label htmlFor="color" className="block text-sm font-medium text-gray-700">
              Cor
            </label>
            <div className="mt-1 flex items-center gap-2">
              <input
                type="color"
                id="color"
                value={category.color}
                onChange={(e) => setCategory({ ...category, color: e.target.value })}
                className="h-10 w-20 rounded-md border-gray-300"
              />
              <input
                type="text"
                value={category.color}
                onChange={(e) => setCategory({ ...category, color: e.target.value })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push('/admin/categories')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSaving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 