// Configuración de límites y validaciones

export const IMAGE_CONSTRAINTS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024,      // 5MB por imagen
  MAX_FILES_COUNT: 5,                   // Máximo 5 imágenes
  COMPRESS_THRESHOLD: 1 * 1024 * 1024, // Comprimir si >1MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  MAX_DIMENSION: 2048,                  // Máximo 2048px por lado
  COMPRESS_QUALITY: 85,                 // Calidad JPEG después de comprimir
};

export const RATE_LIMIT = {
  MAX_REQUESTS_PER_DAY: 5,
  ENDPOINT: '/api/extract-menu',
};

export const ERROR_MESSAGES = {
  IMAGE_TOO_LARGE: "🍕 ¡Esa imagen está más grande que una pizza familiar! Máximo 5MB por favor.",
  TOO_MANY_IMAGES: "🌮 ¡Calma campeón! Máximo 5 imágenes a la vez.",
  INVALID_IMAGE_TYPE: "🚫 Solo acepto fotos (JPG, PNG, WEBP). Nada de memes.",
  RATE_LIMIT_EXCEEDED: "⏰ ¡Ya usaste tus 5 intentos del día! Vuelve mañana a las 00:00.",
  NOT_AUTHENTICATED: "🔐 Necesitas iniciar sesión con Google para usar esta función.",
  COMPRESSION_FAILED: "😅 No pude comprimir la imagen. Intenta con otra más pequeña.",
};
