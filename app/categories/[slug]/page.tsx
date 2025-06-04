import { getNewsByCategory } from '@/app/lib/news';
import NewsCard from '@/app/components/NewsCard';
import { notFound } from 'next/navigation';
import { connectDB } from '@/app/lib/mongodb';
import Category from '@/app/models/Category';
import Image from 'next/image';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  await connectDB();
  const category = await Category.findOne({ slug: params.slug });
  
  if (!category) {
    notFound();
  }

  const news = await getNewsByCategory(params.slug);

  if (!news || news.length === 0) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="relative h-64 w-full mb-8 rounded-lg overflow-hidden">
        <Image
          src={category.image}
          alt={category.name}
          fill
          className="object-cover"
        />
        <div 
          className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
          style={{ backgroundColor: `${category.color}40` }}
        />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <h1 className="text-4xl font-bold text-white capitalize mb-2">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-white/90 text-lg max-w-2xl">
              {category.description}
            </p>
          )}
          <p className="mt-4 text-white/80">
            {news.length} {news.length === 1 ? 'notícia' : 'notícias'} nesta categoria
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {news.map((newsItem) => (
          <NewsCard key={newsItem._id} news={newsItem} />
        ))}
      </div>
    </div>
  );
} 