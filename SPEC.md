# Especificación de Implementación: Autenticación + Rate Limiting

## 🎯 Objetivo
Proteger el endpoint `/api/extract-menu` de uso excesivo implementando autenticación con Google OAuth y rate limiting por usuario (5 requests/día).

## 📋 Arquitectura

### Stack Tecnológico
- **Autenticación**: Better Auth v1
- **Base de Datos**: MongoDB (Atlas o local)
- **OAuth Provider**: Google
- **Compresión de Imágenes**: Sharp
- **Framework**: Next.js 16 (App Router)

### Flujo de Usuario
```
1. Usuario accede a la app → Muestra botón "Iniciar sesión con Google"
2. Usuario se autentica → Sesión guardada en MongoDB
3. Usuario sube imágenes del menú
4. Sistema valida:
   - Tamaño máximo por imagen: 5MB
   - Cantidad máxima de imágenes: 5
   - Límite de requests diarios: 5/día
5. Si pasa validaciones → Comprime imágenes (si >1MB) → Procesa con API
6. Si excede límite → Muestra mensaje "Has alcanzado tu límite diario (5/5)"
```

---

## 🔧 Implementación Detallada

### 1. Dependencias Necesarias

```bash
npm install better-auth mongodb sharp
npm install -D @types/better-auth
```

**Paquetes:**
- `better-auth`: Librería de autenticación moderna y type-safe
- `mongodb`: Driver oficial de MongoDB
- `sharp`: Procesamiento y compresión de imágenes (high-performance)

---

### 2. Variables de Entorno

**Archivo `.env.local` (añadir estas variables):**

```env
# OpenRouter API (existente)
OPENROUTER_API_KEY=tu_api_key_aqui

# MongoDB
MONGODB_URI=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
# O para MongoDB local:
# MONGODB_URI=mongodb://localhost:27017/ruleta-comelon

# Better Auth
BETTER_AUTH_SECRET=<genera_con_openssl_rand_base64_32>
BETTER_AUTH_URL=http://localhost:3000
# En producción cambiar a: https://tu-dominio.com

# Google OAuth
GOOGLE_CLIENT_ID=<tu_client_id>.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=<tu_client_secret>
```

**Cómo obtener Google OAuth credentials:**
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Ve a "APIs & Services" → "Credentials"
4. Clic en "Create Credentials" → "OAuth 2.0 Client ID"
5. Tipo: Web application
6. Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (desarrollo)
   - `https://tu-dominio.com/api/auth/callback/google` (producción)
7. Copia Client ID y Client Secret

**Generar BETTER_AUTH_SECRET:**
```bash
openssl rand -base64 32
```

---

### 3. Estructura de Base de Datos

**Colecciones MongoDB:**

#### `users`
```typescript
{
  _id: ObjectId,
  email: string,
  name: string,
  image?: string,
  emailVerified: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### `sessions`
```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  expiresAt: Date,
  token: string,
  ipAddress?: string,
  userAgent?: string,
  createdAt: Date
}
```

#### `accounts`
```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  accountId: string, // Google ID
  providerId: string, // "google"
  accessToken?: string,
  refreshToken?: string,
  expiresAt?: Date,
  createdAt: Date
}
```

#### `api_usage` (nueva colección para rate limiting)
```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  endpoint: string, // "/api/extract-menu"
  requestCount: number,
  lastRequestAt: Date,
  resetAt: Date, // Fecha de reset (medianoche del día siguiente)
  createdAt: Date,
  updatedAt: Date
}

// Índices
db.api_usage.createIndex({ userId: 1, endpoint: 1, resetAt: 1 })
db.api_usage.createIndex({ resetAt: 1 }, { expireAfterSeconds: 86400 }) // TTL de 24h
```

---

### 4. Archivos a Crear/Modificar

#### **Estructura de Carpetas:**
```
/Users/drago/code/ruleta-comelon/
├── lib/
│   ├── auth.ts                    # Configuración de Better Auth
│   ├── db.ts                      # Cliente MongoDB singleton
│   ├── rate-limit.ts              # Lógica de rate limiting
│   └── image-processor.ts         # Compresión con Sharp
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...auth]/
│   │   │       └── route.ts       # Endpoints de Better Auth
│   │   └── extract-menu/
│   │       └── route.ts           # ✏️ Modificar (añadir validaciones)
│   └── page.tsx                   # ✏️ Modificar (añadir UI de auth)
├── components/
│   └── AuthButton.tsx             # Nuevo componente
├── middleware.ts                  # ✏️ Crear (proteger rutas)
└── .env.local                     # ✏️ Actualizar
```

---

### 5. Validaciones de Imágenes

**Límites configurables:**

```typescript
// lib/config.ts
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
```

**Validaciones a implementar:**
1. ✅ Tipo de archivo (solo JPEG, PNG, WEBP)
2. ✅ Tamaño máximo por archivo (5MB)
3. ✅ Cantidad máxima de archivos (5)
4. ✅ Dimensiones máximas (2048x2048)
5. ✅ Compresión automática si excede 1MB
6. ✅ Rate limiting (5 requests/día por usuario autenticado)

---

### 6. Compresión de Imágenes con Sharp

**Lógica de compresión:**

```typescript
// Si imagen > 1MB → Comprimir
// - Redimensionar si algún lado > 2048px (mantener aspect ratio)
// - Convertir a JPEG (más eficiente para fotos de menús)
// - Calidad: 85%
// - Optimizar metadata

// Resultado esperado:
// Imagen original: 3.5MB (4000x3000) 
// Imagen comprimida: ~500KB (2048x1536)
```

---

### 7. Mensajes de Error User-Friendly

```typescript
// Errores de validación
{
  "IMAGE_TOO_LARGE": "🍕 ¡Esa imagen está más grande que una pizza familiar! Máximo 5MB por favor.",
  "TOO_MANY_IMAGES": "🌮 ¡Calma campeón! Máximo 5 imágenes a la vez.",
  "INVALID_IMAGE_TYPE": "🚫 Solo acepto fotos (JPG, PNG, WEBP). Nada de memes.",
  "RATE_LIMIT_EXCEEDED": "⏰ ¡Ya usaste tus 5 intentos del día! Vuelve mañana a las 00:00.",
  "NOT_AUTHENTICATED": "🔐 Necesitas iniciar sesión con Google para usar esta función.",
  "COMPRESSION_FAILED": "😅 No pude comprimir la imagen. Intenta con otra más pequeña."
}
```

---

### 8. Flujo de Rate Limiting

```typescript
async function checkRateLimit(userId: string): Promise<RateLimitResult> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  // Buscar o crear registro de uso
  const usage = await db.collection('api_usage').findOneAndUpdate(
    {
      userId: new ObjectId(userId),
      endpoint: '/api/extract-menu',
      resetAt: { $gte: tomorrow }
    },
    {
      $inc: { requestCount: 1 },
      $set: { lastRequestAt: new Date(), updatedAt: new Date() },
      $setOnInsert: { 
        createdAt: new Date(),
        resetAt: tomorrow 
      }
    },
    { upsert: true, returnDocument: 'after' }
  );
  
  if (usage.requestCount > MAX_REQUESTS_PER_DAY) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: usage.resetAt
    };
  }
  
  return {
    allowed: true,
    remaining: MAX_REQUESTS_PER_DAY - usage.requestCount,
    resetAt: usage.resetAt
  };
}
```

---

### 9. Componentes UI

#### **AuthButton.tsx**
- Mostrar avatar + nombre si está autenticado
- Mostrar "Iniciar sesión con Google" si no está autenticado
- Badge con contador "X/5 requests hoy"
- Dropdown con opción "Cerrar sesión"

#### **Modificaciones en page.tsx**
- Añadir `AuthButton` en el header
- Deshabilitar botón "Subir Menú" si no está autenticado
- Mostrar tooltip: "Inicia sesión para usar la app"

---

### 10. Seguridad Adicional

**Headers de seguridad:**
```typescript
// next.config.ts
headers: async () => [
  {
    source: '/api/extract-menu',
    headers: [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-XSS-Protection', value: '1; mode=block' },
    ],
  },
],
```

**CORS:**
- Solo permitir requests desde el mismo dominio
- Validar referer header

---

### 11. Monitoring y Logs

**Logs a implementar:**
```typescript
// Cada request a /api/extract-menu
{
  timestamp: new Date(),
  userId: string,
  endpoint: '/api/extract-menu',
  imagesCount: number,
  totalSizeMB: number,
  compressed: boolean,
  rateLimitRemaining: number,
  processingTimeMs: number,
  success: boolean,
  error?: string
}
```

---

## 🧪 Testing Checklist

- [ ] Usuario puede iniciar sesión con Google
- [ ] Sesión persiste después de recargar
- [ ] Usuario autenticado puede subir imágenes
- [ ] Usuario NO autenticado no puede usar el endpoint
- [ ] Validación de tamaño funciona (rechaza >5MB)
- [ ] Validación de cantidad funciona (rechaza >5 imágenes)
- [ ] Compresión funciona para imágenes >1MB
- [ ] Rate limiting funciona (bloquea después de 5 requests)
- [ ] Contador se resetea a medianoche
- [ ] Cerrar sesión funciona correctamente

---

## 📦 Deployment Checklist

- [ ] Variables de entorno configuradas en Vercel/producción
- [ ] MongoDB Atlas configurado y accesible
- [ ] Google OAuth redirect URI actualizado para producción
- [ ] BETTER_AUTH_URL apuntando al dominio de producción
- [ ] Índices de MongoDB creados
- [ ] Headers de seguridad configurados

---

## 🔄 Próximos Pasos Opcionales (Post-MVP)

1. **Dashboard de usuario:**
   - Ver historial de requests
   - Ver tiempo hasta reset
   - Estadísticas de uso

2. **Sistema de planes:**
   - Free: 5 requests/día
   - Premium: 50 requests/día (hipotético)

3. **Analytics:**
   - Platos más sorteados
   - Horas pico de uso
   - Tasa de conversión (upload → ruleta)

4. **Notificaciones:**
   - Email cuando se alcanza el límite
   - Recordatorio cuando se resetea el contador

---

## 📚 Referencias

- [Better Auth Docs](https://www.better-auth.com/docs)
- [MongoDB Node.js Driver](https://www.mongodb.com/docs/drivers/node/current/)
- [Sharp Documentation](https://sharp.pixelplumbing.com/)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)

---

**Generado el:** 2026-05-04  
**Versión:** 1.0  
**Estado:** Listo para implementación
