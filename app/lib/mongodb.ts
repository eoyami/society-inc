import mongoose from 'mongoose';
import '../models/User';
import '../models/News';
import '../models/Category';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache;
}

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error('Por favor, defina a variável de ambiente MONGODB_URI');
}

let cached: MongooseCache = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB(): Promise<typeof mongoose> {
  console.log('Verificando conexão com o MongoDB...');
  
  if (cached.conn) {
    console.log('Usando conexão existente');
    return cached.conn;
  }

  if (!cached.promise) {
    console.log('Criando nova conexão com o MongoDB');
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts);
  }

  try {
    console.log('Aguardando conexão...');
    const mongoose = await cached.promise;
    console.log('Conexão estabelecida com sucesso');
    cached.conn = mongoose;
    return mongoose;
  } catch (e) {
    console.error('Erro ao conectar com o MongoDB:', e);
    cached.promise = null;
    throw e;
  }
} 