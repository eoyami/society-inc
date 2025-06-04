import { getNews, getPopularNews, News } from './lib/news'
import NewsCard from './components/NewsCard'
import FeaturedCarousel from './components/FeaturedCarousel'
import PopularNews from './components/PopularNews'

export default async function Home() {
  const news = await getNews()
  const popularNews = await getPopularNews(5)
  console.log('Total de notícias:', news.length)
  console.log('Notícias populares:', popularNews.length)

  // Pegando as 5 primeiras notícias para o carrossel
  const featuredNews = news.slice(0, 5)
  console.log('Notícias em destaque:', featuredNews.length)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Carrossel de Destaque */}
      <div className="mb-12">
        <FeaturedCarousel featuredNews={featuredNews} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Lista Principal de Notícias */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Últimas Notícias
            </h2>
            {news.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {news.map((newsItem: News) => (
                  <NewsCard 
                    key={newsItem._id} 
                    news={{
                      ...newsItem,
                      updatedAt: newsItem.updatedAt || new Date().toISOString()
                    }}
                    alt={`Imagem da notícia: ${newsItem.title}`}
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
  )
}
