import mongoose, { Document } from 'mongoose';

export interface INotificationDocument extends Document {
  recipient: mongoose.Schema.Types.ObjectId;
  sender: mongoose.Schema.Types.ObjectId;
  type: 'comment' | 'reply' | 'like' | 'follow';
  content: string;
  read: boolean;
  relatedNews?: mongoose.Schema.Types.ObjectId;
  relatedComment?: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new mongoose.Schema<INotificationDocument>({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['comment', 'reply', 'like', 'follow'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  relatedNews: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'News'
  },
  relatedComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }
}, {
  timestamps: true
});

// Criar índices para busca
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ read: 1 });
notificationSchema.index({ type: 1 });

const Notification = mongoose.models.Notification || mongoose.model<INotificationDocument>('Notification', notificationSchema);

export default Notification; 