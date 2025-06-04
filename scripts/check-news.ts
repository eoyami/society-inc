import { connectDB } from '../app/lib/mongodb';
import News from '../app/models/News';

async function checkNews() {
  try {
    console.log('Conectando ao banco de dados...');
    await connectDB();
    console.log('Conexão estabelecida');

    console.log('Buscando notícias...');
    const news = await News.find().lean();
    console.log('Total de notícias:', news.length);

    if (news.length === 0) {
      console.log('Nenhuma notícia encontrada no banco de dados');
      return;
    }

    console.log('Primeira notícia:', {
      id: news[0]._id,
      title: news[0].title,
      category: news[0].category,
      author: news[0].author
    });
  } catch (error) {
    console.error('Erro:', error);
  } finally {
    process.exit(0);
  }
}

checkNews(); 