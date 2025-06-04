import mongoose from 'mongoose';

const replySchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

const topicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  replies: [replySchema],
  tags: [{
    type: String,
  }],
}, {
  timestamps: true,
});

export default mongoose.models.Topic || mongoose.model('Topic', topicSchema); 