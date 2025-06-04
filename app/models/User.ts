import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for the user document
export interface IUserDocument extends Document {
  name: string;
  email: string;
  username: string;
  password?: string; // password might be optional
  image?: string;
  coverImage?: string;
  role: 'user' | 'admin';
  points: number;
  level: number;
  achievements: mongoose.Schema.Types.ObjectId[];
  news: mongoose.Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUserDocument>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  coverImage: {
    type: String,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  points: {
    type: Number,
    default: 0,
  },
  level: {
    type: Number,
    default: 1,
  },
  achievements: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Achievement',
  }],
  news: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'News',
    default: [],
  }],
}, {
  timestamps: true,
});

// Verifica se o modelo já existe antes de criar um novo
const User = mongoose.models.User || mongoose.model<IUserDocument>('User', userSchema);

export default User; 