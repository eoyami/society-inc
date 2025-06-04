import { connectDB } from '@/app/lib/mongodb';
import Category from '@/app/models/Category';
import Link from 'next/link';
import Image from 'next/image';

export default async function CategoriesPage() {
  await connectDB();
  const categories = await Category.find().sort({ name: 1 });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Categorias
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link
            key={category._id}
            href={`/categories/${category.slug}`}
            className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
          >
            <div className="relative h-48 w-full">
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div 
                className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
                style={{ backgroundColor: `${category.color}40` }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h2 className="text-xl font-semibold text-white mb-2">
                  {category.name}
                </h2>
                {category.description && (
                  <p className="text-white/90 text-sm line-clamp-2">
                    {category.description}
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 