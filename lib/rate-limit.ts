import { getDb } from './db';
import { RATE_LIMIT } from './config';
import { ObjectId } from 'mongodb';

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
  current: number;
}

/**
 * Verifica y actualiza el rate limit para un usuario
 * @param userId - ID del usuario autenticado
 * @returns Resultado del rate limit
 */
export async function checkRateLimit(userId: string): Promise<RateLimitResult> {
  const db = await getDb();
  const collection = db.collection('api_usage');

  // Calcular fechas de reset (medianoche del día siguiente)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  try {
    // Buscar o crear registro de uso para hoy
    const result = await collection.findOneAndUpdate(
      {
        userId: new ObjectId(userId),
        endpoint: RATE_LIMIT.ENDPOINT,
        resetAt: tomorrow,
      },
      {
        $inc: { requestCount: 1 },
        $set: { 
          lastRequestAt: new Date(),
          updatedAt: new Date(),
        },
        $setOnInsert: { 
          createdAt: new Date(),
          resetAt: tomorrow,
          endpoint: RATE_LIMIT.ENDPOINT,
          userId: new ObjectId(userId),
        }
      },
      { 
        upsert: true, 
        returnDocument: 'after',
      }
    );

    const usage = result;
    const requestCount = usage?.requestCount || 0;

    return {
      allowed: requestCount <= RATE_LIMIT.MAX_REQUESTS_PER_DAY,
      remaining: Math.max(0, RATE_LIMIT.MAX_REQUESTS_PER_DAY - requestCount),
      resetAt: tomorrow,
      current: requestCount,
    };
  } catch (error) {
    console.error('Error checking rate limit:', error);
    // En caso de error, permitir la solicitud pero loggear
    return {
      allowed: true,
      remaining: RATE_LIMIT.MAX_REQUESTS_PER_DAY,
      resetAt: tomorrow,
      current: 0,
    };
  }
}

/**
 * Obtiene el estado actual del rate limit sin incrementarlo
 * @param userId - ID del usuario autenticado
 * @returns Estado actual del rate limit
 */
export async function getRateLimitStatus(userId: string): Promise<RateLimitResult> {
  const db = await getDb();
  const collection = db.collection('api_usage');

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  try {
    const usage = await collection.findOne({
      userId: new ObjectId(userId),
      endpoint: RATE_LIMIT.ENDPOINT,
      resetAt: tomorrow,
    });

    const requestCount = usage?.requestCount || 0;

    return {
      allowed: requestCount < RATE_LIMIT.MAX_REQUESTS_PER_DAY,
      remaining: Math.max(0, RATE_LIMIT.MAX_REQUESTS_PER_DAY - requestCount),
      resetAt: tomorrow,
      current: requestCount,
    };
  } catch (error) {
    console.error('Error getting rate limit status:', error);
    return {
      allowed: true,
      remaining: RATE_LIMIT.MAX_REQUESTS_PER_DAY,
      resetAt: tomorrow,
      current: 0,
    };
  }
}

/**
 * Crea los índices necesarios para la colección api_usage
 * Ejecutar una vez al inicializar la base de datos
 */
export async function createRateLimitIndexes(): Promise<void> {
  const db = await getDb();
  const collection = db.collection('api_usage');

  try {
    // Índice compuesto para búsquedas eficientes
    await collection.createIndex(
      { userId: 1, endpoint: 1, resetAt: 1 },
      { name: 'rate_limit_lookup' }
    );

    // Índice TTL para limpiar registros antiguos automáticamente (después de 7 días)
    await collection.createIndex(
      { resetAt: 1 },
      { expireAfterSeconds: 604800, name: 'auto_cleanup' } // 7 días
    );

    console.log('✅ Rate limit indexes created successfully');
  } catch (error) {
    console.error('Error creating rate limit indexes:', error);
  }
}
