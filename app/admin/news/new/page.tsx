"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import NextImage from 'next/image';
import TiptapEditor from '@/app/components/TiptapEditor';

export default function NewNewsPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Geral');
  const [tags, setTags] = useState('');
  const [excerpt, setExcerpt] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !image || !content || !excerpt) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          image,
          category,
          excerpt,
          tags: tags.split(',').map(tag => tag.trim()).filter(Boolean)
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao criar notícia');
      }

      router.push('/admin/news');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar notícia');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4">
      <div className="max-w-4xl mx-auto py-8 px-6 bg-gray-800 rounded-lg shadow-xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Nova Notícia</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-gray-100 rounded-lg shadow-inner text-gray-900">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Título
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
              placeholder="Digite o título da notícia"
              required
            />
          </div>

          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
              Resumo
            </label>
            <textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
              placeholder="Digite um breve resumo da notícia"
              rows={3}
              required
            />
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
              URL da Imagem Principal
            </label>
            <input
              type="url"
              id="image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
              placeholder="Cole a URL da imagem aqui"
              required
            />
            {image && image.trim() !== '' && (
              <div className="mt-4 relative h-64 w-full rounded-lg overflow-hidden border border-gray-300">
                <NextImage
                  src={image}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Categoria
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            >
              <option value="Geral">Geral</option>
              <option value="Jogos">Jogos</option>
              <option value="Tecnologia">Tecnologia</option>
              <option value="Esports">Esports</option>
            </select>
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
              Tags (separadas por vírgula)
            </label>
            <input
              type="text"
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
              placeholder="jogos, tecnologia, esports"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Conteúdo</label>
            <TiptapEditor onChange={setContent} />
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-100 border border-red-400 p-2 rounded-md">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Criando...' : 'Criar Notícia'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 