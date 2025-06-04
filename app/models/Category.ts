import mongoose, { Document } from 'mongoose';

export interface ICategoryDocument extends Document {
  name: string;
  slug: string;
  description?: string;
  image: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new mongoose.Schema<ICategoryDocument>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: '#3B82F6' // Cor padrão azul
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Criar índice para busca por slug
categorySchema.index({ slug: 1 });

// Relação virtual com as notícias
categorySchema.virtual('news', {
  ref: 'News',
  localField: '_id',
  foreignField: 'category'
});

// Verifica se o modelo já existe antes de criar um novo
const Category = mongoose.models.Category || mongoose.model<ICategoryDocument>('Category', categorySchema);

export default Category; 