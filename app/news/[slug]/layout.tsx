import { Metadata } from 'next';
import { headers } from 'next/headers';

type Params = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

async function getNews(slug: string) {
  try {
    const headersList = await headers();
    const host = headersList.get('host');
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    
    const response = await fetch(`${protocol}://${host}/api/news/${slug}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.error('Erro na resposta da API:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar notícia:', error);
    return null;
  }
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const news = await getNews(params.slug);

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

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 