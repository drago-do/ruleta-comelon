# 🎲 La Ruleta Tragona 3000

Una aplicación web divertida que te ayuda a decidir qué comer usando IA para extraer opciones de fotos de menús y una ruleta 3D para elegir al azar.

## 🚀 Características

- 📸 Sube fotos de menús y extrae automáticamente platos y bebidas con IA
- 🔐 Autenticación con Google OAuth
- 🛡️ Rate limiting (5 extracciones por día por usuario)
- 🗜️ Compresión automática de imágenes grandes
- 🎰 Ruleta 3D interactiva para elegir tu comida
- 📊 Contador de uso en tiempo real

## 🛠️ Tecnologías

- **Framework**: Next.js 16 (App Router)
- **Autenticación**: Better Auth
- **Base de Datos**: MongoDB
- **IA**: OpenRouter (Gemini Flash Lite)
- **Procesamiento de Imágenes**: Sharp
- **3D**: Three.js + React Three Fiber
- **Estilos**: Tailwind CSS v4

## 📋 Prerequisitos

- Node.js 20+
- MongoDB (Atlas o local)
- Cuenta de Google Cloud (para OAuth)
- API Key de OpenRouter

## 🔧 Configuración

### 1. Clonar el repositorio e instalar dependencias

\`\`\`bash
git clone <tu-repo>
cd ruleta-comelon
npm install
\`\`\`

### 2. Configurar MongoDB

**Opción A: MongoDB Atlas (Recomendado para producción)**

1. Ve a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crea un cluster gratuito
3. Crea un usuario de base de datos
4. Obtén tu connection string
5. Whitelist tu IP o permite acceso desde cualquier lugar (0.0.0.0/0)

**Opción B: MongoDB Local**

\`\`\`bash
# macOS (con Homebrew)
brew install mongodb-community
brew services start mongodb-community

# Linux
sudo apt-get install mongodb
sudo systemctl start mongodb

# Windows
# Descargar desde: https://www.mongodb.com/try/download/community
\`\`\`

### 3. Configurar Google OAuth

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita "Google+ API"
4. Ve a "APIs & Services" → "Credentials"
5. Clic en "Create Credentials" → "OAuth 2.0 Client ID"
6. Tipo: **Web application**
7. Authorized redirect URIs:
   - Desarrollo: \`http://localhost:3000/api/auth/callback/google\`
   - Producción: \`https://tu-dominio.com/api/auth/callback/google\`
8. Copia **Client ID** y **Client Secret**

### 4. Obtener API Key de OpenRouter

1. Ve a [OpenRouter](https://openrouter.ai/)
2. Crea una cuenta
3. Ve a "Keys" y genera una nueva API key
4. Añade créditos (el modelo usado es muy barato: ~$0.10 por 1000 extracciones)

### 5. Configurar variables de entorno

Copia el archivo de ejemplo y edítalo:

\`\`\`bash
cp .env.example .env.local
\`\`\`

Edita \`.env.local\` con tus credenciales:

\`\`\`env
# OpenRouter API
OPENROUTER_API_KEY=tu_api_key_de_openrouter

# MongoDB
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/ruleta-comelon?retryWrites=true&w=majority

# Better Auth (genera el secret con: openssl rand -base64 32)
BETTER_AUTH_SECRET=tu_secret_aleatorio_de_32_chars
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=123456789.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=tu_client_secret_de_google
\`\`\`

**Generar BETTER_AUTH_SECRET:**

\`\`\`bash
openssl rand -base64 32
\`\`\`

### 6. Inicializar la base de datos

Ejecuta el script de inicialización para crear los índices necesarios:

\`\`\`bash
node scripts/init-db.js
\`\`\`

Deberías ver:

\`\`\`
✅ Conectado a MongoDB
🔨 Creando índice: rate_limit_lookup...
✅ Índice rate_limit_lookup creado
🔨 Creando índice TTL: auto_cleanup...
✅ Índice auto_cleanup creado
✨ Base de datos inicializada correctamente
🎉 ¡Listo para usar!
\`\`\`

### 7. Ejecutar en desarrollo

\`\`\`bash
npm run dev
\`\`\`

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🎯 Uso

1. **Inicia sesión** con tu cuenta de Google (botón en la esquina superior derecha)
2. **Sube fotos** del menú (máximo 5 imágenes, 5MB cada una)
3. **Espera** a que la IA extraiga los platos y bebidas
4. **Edita** la lista si es necesario (añadir/eliminar opciones)
5. **Gira la ruleta** y deja que el destino elija por ti

## 🔒 Límites y Seguridad

- **5 extracciones por día** por usuario autenticado
- Máximo **5 imágenes** por extracción
- Máximo **5MB** por imagen
- Compresión automática de imágenes >1MB
- Rate limiting por usuario (no por IP)
- Autenticación obligatoria para usar la API

## 📂 Estructura del Proyecto

\`\`\`
ruleta-comelon/
├── app/
│   ├── api/
│   │   ├── auth/[...auth]/    # Endpoints de Better Auth
│   │   └── extract-menu/      # API de extracción de menús
│   ├── layout.tsx
│   └── page.tsx               # Página principal
├── components/
│   ├── AuthButton.tsx         # Botón de autenticación
│   ├── RateLimitBadge.tsx     # Indicador de uso
│   ├── ExtractionResults.tsx
│   ├── MenuImagePreview.tsx
│   ├── Roulette3D.tsx
│   └── LoadingSpinner.tsx
├── lib/
│   ├── auth.ts                # Configuración de Better Auth
│   ├── auth-client.ts         # Cliente de auth para frontend
│   ├── db.ts                  # Cliente MongoDB
│   ├── rate-limit.ts          # Lógica de rate limiting
│   ├── image-processor.ts     # Compresión con Sharp
│   └── config.ts              # Configuración y constantes
├── scripts/
│   └── init-db.js             # Script de inicialización
├── public/
├── SPEC.md                    # Especificación técnica detallada
└── .env.local                 # Variables de entorno (no commitear)
\`\`\`

## 🚀 Deploy a Producción

### Vercel (Recomendado)

1. Push tu código a GitHub
2. Importa el proyecto en [Vercel](https://vercel.com)
3. Añade las variables de entorno en el dashboard
4. **Importante:** Actualiza las URLs:
   - \`BETTER_AUTH_URL\`: tu dominio de producción
   - \`NEXT_PUBLIC_BETTER_AUTH_URL\`: tu dominio de producción
   - Google OAuth redirect URI: \`https://tu-dominio.com/api/auth/callback/google\`
5. Deploy

### Otras plataformas

El proyecto es compatible con cualquier plataforma que soporte Next.js:
- Railway
- Render
- DigitalOcean App Platform
- AWS Amplify

## 🐛 Troubleshooting

### "Cannot connect to MongoDB"

- Verifica que \`MONGODB_URI\` esté correctamente configurado
- Si usas MongoDB Atlas, verifica que tu IP esté whitelisted
- Verifica que el usuario tenga permisos de lectura/escritura

### "Google OAuth redirect_uri_mismatch"

- Verifica que la redirect URI en Google Cloud Console coincida exactamente
- Formato: \`http://localhost:3000/api/auth/callback/google\` (desarrollo)
- No olvides actualizar para producción

### "BETTER_AUTH_SECRET not found"

- Genera un secret: \`openssl rand -base64 32\`
- Añádelo a \`.env.local\`
- Reinicia el servidor

### "Rate limit exceeded" en desarrollo

- El rate limit también aplica en desarrollo
- Borra el registro en MongoDB: \`db.api_usage.deleteMany({})\`
- O espera hasta medianoche para el reset automático

### Imágenes no se comprimen

- Verifica que Sharp se instaló correctamente: \`npm list sharp\`
- En algunos sistemas necesitas dependencias adicionales
- macOS: \`xcode-select --install\`
- Linux: \`sudo apt-get install libvips-dev\`

## 📊 Monitoreo

En desarrollo, los logs muestran:
- Usuario que hace el request
- Cantidad de requests restantes
- Tamaño original y comprimido de imágenes
- Tiempo de procesamiento

En producción, revisa los logs en tu plataforma de hosting.

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama: \`git checkout -b feature/nueva-funcionalidad\`
3. Commit: \`git commit -m 'Añade nueva funcionalidad'\`
4. Push: \`git push origin feature/nueva-funcionalidad\`
5. Abre un Pull Request

## 📝 Licencia

MIT

## 👨‍💻 Autor

Tu Nombre - [@tu_twitter](https://twitter.com/tu_twitter)

## 🙏 Agradecimientos

- [Better Auth](https://www.better-auth.com/) - Autenticación moderna
- [OpenRouter](https://openrouter.ai/) - API de IA asequible
- [Vercel](https://vercel.com/) - Hosting y deployment

---

**¿Tienes dudas?** Abre un issue en GitHub o consulta [SPEC.md](./SPEC.md) para más detalles técnicos.
