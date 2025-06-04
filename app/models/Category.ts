import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
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
  timestamps: true
});

// Criar índice para busca por slug
categorySchema.index({ slug: 1 });

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);

export default Category; 