import mongoose, { Document } from 'mongoose';

export interface ICommentDocument extends Document {
  content: string;
  news: mongoose.Schema.Types.ObjectId;
  author: mongoose.Schema.Types.ObjectId;
  parentComment?: mongoose.Schema.Types.ObjectId;
  replies: mongoose.Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new mongoose.Schema<ICommentDocument>({
  content: {
    type: String,
    required: true,
    trim: true
  },
  news: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'News',
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  },
  replies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }]
}, {
  timestamps: true
});

// Criar índices para busca
commentSchema.index({ news: 1 });
commentSchema.index({ author: 1 });
commentSchema.index({ parentComment: 1 });
commentSchema.index({ createdAt: -1 });

const Comment = mongoose.models.Comment || mongoose.model<ICommentDocument>('Comment', commentSchema);

export default Comment; 