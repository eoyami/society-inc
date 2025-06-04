import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { connectDB } from '@/app/lib/mongodb';
import News from '@/app/models/News';
import { formatDate } from '@/app/lib/utils';
import Comments from '@/app/components/Comments';
import { getNewsBySlug } from '@/app/lib/news';

interface Author {
  _id: string;
  name: string;
  username: string;
  avatar?: string;
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
    .populate('author', 'name username avatar')
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

export default async function NewsPage({ params }: { params: Promise<{ slug: string }> }) {
  const paramsResolved = await params;
  const slug = paramsResolved.slug;
  const news = await getNewsBySlug(slug);
  
  if (!news) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{news.title}</h1>
      
      {news.image && news.image.trim() !== '' ? (
        <div className="relative w-full h-[400px] mb-8">
          <Image
            src={news.image}
            alt={news.title}
            fill
            className="object-cover rounded-lg"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      ) : (
        <div className="w-full h-[200px] bg-gray-100 rounded-lg mb-8 flex items-center justify-center">
          <span className="text-gray-500">Sem imagem</span>
        </div>
      )}

      <div className="flex items-center space-x-4 mb-8">
        <div className="relative w-10 h-10">
          <Image
            src={news.author.avatar || '/default-avatar.png'}
            alt={news.author.name}
            fill
            className="rounded-full object-cover"
            sizes="40px"
          />
        </div>
        <div>
          <p className="font-medium">{news.author.name}</p>
          <p className="text-sm text-gray-500">{formatDate(news.createdAt)}</p>
        </div>
      </div>

      <div 
        className="prose max-w-none mb-8"
        dangerouslySetInnerHTML={{ __html: news.content }}
      />

      <div className="mt-12">
        <Comments
          newsId={news._id}
          newsSlug={news.slug}
          newsTitle={news.title}
          newsAuthor={news.author}
        />
      </div>
    </div>
  );
} 