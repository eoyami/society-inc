import { Metadata } from 'next';
import { headers } from 'next/headers';

interface Props {
  params: {
    id: string;
  };
}

async function getNews(id: string) {
  try {
    const headersList = await headers();
    const host = headersList.get('host');
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    
    const response = await fetch(`${protocol}://${host}/api/news/${id}`, {
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const news = await getNews(params.id);

  if (!news) {
    return {
      title: 'Notícia não encontrada | Society Inc',
      description: 'A notícia que você está procurando não foi encontrada.',
    };
  }

  return {
    title: `${news.title} | Society Inc`,
    description: news.content.substring(0, 160), // Primeiros 160 caracteres do conteúdo
    openGraph: {
      title: news.title,
      description: news.content.substring(0, 160),
      images: [news.image],
      type: 'article',
      publishedTime: news.createdAt,
      authors: [news.author.name],
    },
    twitter: {
      card: 'summary_large_image',
      title: news.title,
      description: news.content.substring(0, 160),
      images: [news.image],
    },
  };
}

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 