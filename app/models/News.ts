import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  views: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    default: 'Geral'
  },
  tags: [{
    type: String,
    trim: true
  }],
  slug: {
    type: String,
    required: true,
    unique: true
  }
}, {
  timestamps: true
});

// Criar índice para busca por slug
newsSchema.index({ slug: 1 });

// Criar índice para ordenação por data e visualizações
newsSchema.index({ createdAt: -1 });
newsSchema.index({ views: -1 });

const News = mongoose.models.News || mongoose.model('News', newsSchema);

export default News; 