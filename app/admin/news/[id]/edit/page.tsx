"use client";

import { useEffect, useState, use } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface News {
  _id: string;
  title: string;
  content: string;
  image: string;
  featured: boolean;
}

export default function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { data: session } = useSession();
  const router = useRouter();
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [featured, setFeatured] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`/api/news/${resolvedParams.id}`);
        if (!response.ok) throw new Error('Erro ao carregar notícia');
        const data = await response.json();
        setNews(data);
        setTitle(data.title);
        setContent(data.content);
        setImage(data.image);
        setFeatured(data.featured);
      } catch (err) {
        setError('Erro ao carregar notícia');
      } finally {
        setLoading(false);
      }
    };

    if (resolvedParams.id !== 'new') {
      fetchNews();
    } else {
      setLoading(false);
    }
  }, [resolvedParams.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(
        resolvedParams.id === 'new' ? '/api/news' : `/api/news/${resolvedParams.id}`,
        {
          method: resolvedParams.id === 'new' ? 'POST' : 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title,
            content,
            image,
            featured,
          }),
        }
      );

      if (!response.ok) throw new Error('Erro ao salvar notícia');

      router.push('/admin/news');
    } catch (err) {
      setError('Erro ao salvar notícia');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4">
      <div className="max-w-4xl mx-auto py-8 px-6 bg-gray-800 rounded-lg shadow-xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            {resolvedParams.id === 'new' ? 'Nova Notícia' : 'Editar Notícia'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-gray-100 rounded-lg shadow-inner text-gray-900">
          {error && (
            <div className="bg-red-200 border border-red-500 text-red-800 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Título
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
              placeholder="Digite o título da notícia"
            />
          </div>

          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Conteúdo
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={10}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
              placeholder="Digite o conteúdo da notícia"
            />
          </div>

          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              URL da Imagem
            </label>
            <input
              type="url"
              id="image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
              placeholder="Cole a URL da imagem aqui"
            />
            {image && image.trim() !== '' && (
              <div className="mt-4 relative h-64 w-full rounded-lg overflow-hidden border border-gray-300">
                <Image
                  src={image}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="featured"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="h-5 w-5 rounded border-gray-300 bg-white text-blue-600 focus:ring-blue-500 focus:ring-offset-gray-100"
            />
            <label
              htmlFor="featured"
              className="ml-3 block text-sm text-gray-900"
            >
              Destacar notícia
            </label>
          </div>

          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={() => router.push('/admin/news')}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-blue-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 