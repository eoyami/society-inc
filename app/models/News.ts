import mongoose, { Document } from 'mongoose';

export interface INewsDocument extends Document {
  title: string;
  slug: string;
  content: string;
  image: string;
  category: mongoose.Schema.Types.ObjectId;
  author: mongoose.Schema.Types.ObjectId;
  views: number;
  excerpt: string;
  featured: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const newsSchema = new mongoose.Schema<INewsDocument>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  content: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
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
  excerpt: {
    type: String,
    required: true,
    trim: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Criar índices para busca
newsSchema.index({ category: 1 });
newsSchema.index({ author: 1 });
newsSchema.index({ createdAt: -1 });

// Verifica se o modelo já existe antes de criar um novo
const News = mongoose.models.News || mongoose.model<INewsDocument>('News', newsSchema);

export default News; 