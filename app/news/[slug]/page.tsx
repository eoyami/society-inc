import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { connectDB } from '@/app/lib/mongodb';
import News from '@/app/models/News';
import { formatDate } from '@/app/lib/utils';
import Comments from '@/app/components/Comments';

interface Author {
  _id: string;
  name: string;
  username: string;
  image?: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  color: string;
}

interface NewsType {
  _id: string;
  title: string;
  slug: string;
  content: string;
  image: string;
  author: Author;
  category: Category;
  views: number;
  excerpt: string;
  featured: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

type Params = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(context: Params): Promise<Metadata> {
  const { slug } = await context.params;
  const news = await News.findOne({ slug })
    .populate('author', 'name username image')
    .populate('category', 'name color')
    .lean() as NewsType | null;

  if (!news) {
    return {
      title: 'Notícia não encontrada',
      description: 'A notícia solicitada não foi encontrada.'
    };
  }

  return {
    title: news.title,
    description: news.excerpt,
    openGraph: {
      title: news.title,
      description: news.excerpt,
      images: news.image ? [news.image] : [],
      type: 'article',
      authors: [news.author.name]
    }
  };
}

export default async function NewsPage(context: Params) {
  const { slug } = await context.params;
  await connectDB();
  
  const news = await News.findOne({ slug })
    .populate('author', 'name username image')
    .populate('category', 'name color')
    .lean() as NewsType | null;

  if (!news) {
    return <div>Notícia não encontrada</div>;
  }

  // URL base para compartilhamento
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const shareUrl = `${baseUrl}/news/${news.slug}`;

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* Título */}
      <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-4">
        {news.title}
      </h1>

      {/* Categoria e Data */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href={`/categories/${news.category.slug}`}
          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
          style={{ backgroundColor: news.category.color, color: '#fff' }}
        >
          {news.category.name}
        </Link>
        <time className="text-sm text-gray-500">
          {formatDate(news.createdAt)}
        </time>
      </div>

      {/* Imagem principal */}
      {news.image && (
        <div className="relative h-[400px] w-full rounded-lg overflow-hidden mb-8">
          <Image
            src={news.image}
            alt={news.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Informações do autor e visualizações */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
        <Link 
          href={`/profile/${news.author.username}`}
          className="flex items-center hover:opacity-80 transition-opacity"
        >
          <div className="flex-shrink-0">
            {news.author.image ? (
              <Image
                src={news.author.image}
                alt={news.author.name}
                width={40}
                height={40}
                className="rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                {news.author.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">
              Por {news.author.name}
            </p>
          </div>
        </Link>

        <div className="text-sm text-gray-500">
          {news.views} {news.views === 1 ? 'visualização' : 'visualizações'}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="prose prose-lg max-w-none mb-8">
        <div dangerouslySetInnerHTML={{ __html: news.content }} />
      </div>

      {/* Tags e Compartilhamento */}
      <footer className="mt-8 pt-8 border-t border-gray-200">
        {news.tags && news.tags.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {news.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Compartilhamento */}
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-900">Compartilhar:</span>
          <div className="flex gap-2">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(news.title)}&url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-500 transition-colors"
            >
              Twitter
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Facebook
            </a>
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(news.title + ' ' + shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-green-500 transition-colors"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </footer>

      {/* Seção de Comentários */}
      <Comments newsSlug={news.slug} />
    </article>
  );
} 