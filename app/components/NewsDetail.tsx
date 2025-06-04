import Image from 'next/image';
import Link from 'next/link';

interface NewsDetailProps {
  news: {
    _id: string;
    title: string;
    content: string;
    image: string;
    createdAt: string;
    author: {
      name: string;
      image: string;
    };
    category: {
      name: string;
      color: string;
    };
  };
}

export default function NewsDetail({ news }: NewsDetailProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="relative h-96 w-full rounded-lg overflow-hidden mb-8">
        {news.image && news.image.trim() !== '' ? (
          <Image
            src={news.image}
            alt={news.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
            Sem imagem
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative h-12 w-12 rounded-full overflow-hidden">
            {news.author.image && news.author.image.trim() !== '' ? (
              <Image
                src={news.author.image}
                alt={news.author.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600">
                {news.author.name.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <p className="font-medium text-gray-900">{news.author.name}</p>
            <p className="text-sm text-gray-500">
              {new Date(news.createdAt).toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {news.title}
        </h1>

        <div className="prose lg:prose-xl max-w-none">
          <div dangerouslySetInnerHTML={{ __html: news.content }} />
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <Link
            href={`/categories/${news.category.name.toLowerCase()}`}
            className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium"
            style={{ backgroundColor: `${news.category.color}20`, color: news.category.color }}
          >
            {news.category.name}
          </Link>
        </div>
      </div>
    </div>
  );
} 