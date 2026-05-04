/**
 * Script de inicialización de MongoDB
 * Ejecutar una vez después de configurar las variables de entorno
 * 
 * Usage: node scripts/init-db.js
 */

const { MongoClient } = require('mongodb');

if (!process.env.MONGODB_URI) {
  console.error('❌ Error: MONGODB_URI no está configurado en .env.local');
  process.exit(1);
}

const uri = process.env.MONGODB_URI;

async function initializeDatabase() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Conectado a MongoDB');

    const db = client.db();
    const apiUsageCollection = db.collection('api_usage');

    // Verificar si los índices ya existen
    const existingIndexes = await apiUsageCollection.indexes();
    console.log('\n📋 Índices existentes:', existingIndexes.map(idx => idx.name).join(', '));

    // Crear índice compuesto para búsquedas eficientes
    console.log('\n🔨 Creando índice: rate_limit_lookup...');
    await apiUsageCollection.createIndex(
      { userId: 1, endpoint: 1, resetAt: 1 },
      { name: 'rate_limit_lookup' }
    );
    console.log('✅ Índice rate_limit_lookup creado');

    // Crear índice TTL para limpiar registros antiguos automáticamente
    console.log('\n🔨 Creando índice TTL: auto_cleanup...');
    await apiUsageCollection.createIndex(
      { resetAt: 1 },
      { expireAfterSeconds: 604800, name: 'auto_cleanup' } // 7 días
    );
    console.log('✅ Índice auto_cleanup creado (elimina registros después de 7 días)');

    // Verificar índices creados
    const updatedIndexes = await apiUsageCollection.indexes();
    console.log('\n📋 Índices actualizados:', updatedIndexes.map(idx => idx.name).join(', '));

    // Estadísticas de la colección
    const stats = await db.command({ collStats: 'api_usage' });
    console.log('\n📊 Estadísticas de la colección api_usage:');
    console.log(`   - Documentos: ${stats.count}`);
    console.log(`   - Tamaño: ${(stats.size / 1024).toFixed(2)} KB`);
    console.log(`   - Índices: ${stats.nindexes}`);

    console.log('\n✨ Base de datos inicializada correctamente');
    console.log('🎉 ¡Listo para usar!');

  } catch (error) {
    console.error('❌ Error inicializando la base de datos:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n👋 Conexión cerrada');
  }
}

initializeDatabase();
