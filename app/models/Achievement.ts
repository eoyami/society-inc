import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  criteria: {
    type: {
      type: String,
      enum: ['points', 'news', 'topics', 'replies', 'events'],
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
  },
  points: {
    type: Number,
    default: 0,
  },
  unlockedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
}, {
  timestamps: true,
});

export default mongoose.models.Achievement || mongoose.model('Achievement', achievementSchema); 