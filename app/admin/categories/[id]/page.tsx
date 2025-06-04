import { notFound } from 'next/navigation';
import { connectDB } from '@/app/lib/mongodb';
import Category from '@/app/models/Category';

interface PageProps {
  params: any;
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function EditCategoryPage({ params }: PageProps) {
  await connectDB();
  const category = await Category.findById(params.id);

  if (!category) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Editar Categoria</h1>
      <form className="max-w-lg">
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nome
          </label>
          <input
            type="text"
            id="name"
            name="name"
            defaultValue={category.name}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
            Slug
          </label>
          <input
            type="text"
            id="slug"
            name="slug"
            defaultValue={category.slug}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Descrição
          </label>
          <textarea
            id="description"
            name="description"
            defaultValue={category.description}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Salvar Alterações
        </button>
      </form>
    </div>
  );
} 