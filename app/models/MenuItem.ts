import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    required: true,
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',
    default: null,
  },
}, {
  timestamps: true,
});

export default mongoose.models.MenuItem || mongoose.model('MenuItem', menuItemSchema); 