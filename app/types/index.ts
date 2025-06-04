export interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  password?: string;
  avatar?: string;
  bio?: string;
  role: 'user' | 'admin';
  news?: News[];
  createdAt: string;
  updatedAt: string;
}

export interface News {
  _id: string;
  title: string;
  slug: string;
  content: string;
  image: string;
  category: string;
  author: {
    _id: string;
    name: string;
    username: string;
    avatar?: string;
  };
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image: string;
  color: string;
  createdAt: string;
  updatedAt: string;
} 