import { MongoClient, Db } from 'mongodb';
import { createRateLimitIndexes } from './rate-limit';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MONGODB_URI to .env.local');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClient: MongoClient | undefined;
}

if (process.env.NODE_ENV === 'development') {
  // En desarrollo, usa una variable global para preservar el cliente
  // a través de module reloads causados por HMR (Hot Module Replacement).
  if (!global._mongoClient) {
    global._mongoClient = new MongoClient(uri, options);
  }
  client = global._mongoClient;
  clientPromise = client.connect();
} else {
  // En producción, es mejor no usar una variable global.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Inicializar índices en segundo plano
clientPromise.then(() => {
  createRateLimitIndexes().catch(console.error);
});

// Instancia de la base de datos
const db = client.db();

// Export standard promise for compatibility
export default clientPromise;

export { client, db, clientPromise };

// Helper para obtener la base de datos directamente (asíncrono para asegurar conexión)
export async function getDb(): Promise<Db> {
  await clientPromise;
  return db;
}
