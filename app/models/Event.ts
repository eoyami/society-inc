import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
  },
  link: {
    type: String,
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  image: {
    type: String,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Event || mongoose.model('Event', eventSchema); 