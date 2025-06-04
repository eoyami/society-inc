import { getNews, getPopularNews, News } from './lib/news'
import NewsCard from './components/NewsCard'
import FeaturedCarousel from './components/FeaturedCarousel'
import PopularNews from './components/PopularNews'

export default async function Home() {
  try {
    console.log('Buscando notícias...');
    const news = await getNews();
    console.log('Total de notícias:', news.length);

    console.log('Buscando notícias populares...');
    const popularNews = await getPopularNews(5);
    console.log('Notícias populares:', popularNews.length);

    // Pegando as 5 primeiras notícias para o carrossel
    const featuredNews = news.slice(0, 5);
    console.log('Notícias em destaque:', featuredNews.length);

    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Carrossel de Destaque */}
        {featuredNews.length > 0 && (
          <div className="mb-12">
            <FeaturedCarousel news={featuredNews} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Lista Principal de Notícias */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                Últimas Notícias
              </h2>
              {news.length > 0 ? (
                <div className="space-y-6">
                  {news.map((newsItem: News) => (
                    <NewsCard 
                      key={newsItem._id} 
                      news={newsItem}
                      alt={`Imagem da notícia: ${newsItem.title}`}
                      layout="list"
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">Nenhuma notícia encontrada</p>
              )}
            </div>
          </div>

          {/* Menu Lateral */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                Notícias Populares
              </h2>
              <PopularNews popularNews={popularNews} />
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Erro ao carregar a página:', error);
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-800 mb-2">
            Erro ao carregar notícias
          </h2>
          <p className="text-red-600">
            Ocorreu um erro ao carregar as notícias. Por favor, tente novamente mais tarde.
          </p>
        </div>
      </div>
    );
  }
}
