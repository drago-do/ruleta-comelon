📄 Documento de Contexto: "La Ruleta Tragona 3000"

## 1. Descripción General del Proyecto

**La Ruleta Tragona 3000** es una aplicación web interactiva y humorística que utiliza inteligencia artificial para ayudar a usuarios indecisos a elegir qué comer y beber. Los usuarios suben fotos de menús de restaurantes, la IA extrae automáticamente las opciones, y dos ruletas 3D giran para que el "destino" decida el combo perfecto.

## 2. Stack Tecnológico

### Frontend
- **Framework**: Next.js 16.2.1 con App Router
- **Lenguaje**: TypeScript 5
- **UI/Estilos**: Tailwind CSS v4
- **3D Graphics**: 
  - Three.js 0.183.2
  - React Three Fiber 9.5.0
  - @react-three/drei 10.7.7
- **Efectos Visuales**: react-confetti 6.4.0
- **Estado**: React Hooks (useState, useRef, useEffect)

### Backend
- **Runtime**: Next.js API Routes (Edge/Node)
- **IA**: OpenRouter API (proxy para múltiples modelos)
- **Modelo**: google/gemini-3.1-flash-lite-preview
  - Multimodal (acepta imágenes)
  - Respuestas en JSON estructurado
  - Extracción de texto y clasificación en una sola llamada

### Infraestructura
- **Deployment**: Compatible con Vercel
- **Assets**: Archivos estáticos en `/public`
- **Modelos 3D**: GLB/GLTF format

## 3. Arquitectura de la Aplicación

### Estructura de Archivos Principal
```
/app
  ├── page.tsx                    # Página principal (cliente)
  ├── layout.tsx                  # Layout raíz
  └── /api
      └── /extract-menu
          └── route.ts            # Endpoint para extracción con IA

/components
  ├── BackgroundMusic.tsx         # Audio ambiente
  ├── ExtractionResults.tsx       # Vista de resultados de extracción
  ├── LoadingSpinner.tsx          # Animación de carga
  ├── MenuImagePreview.tsx        # Preview de imágenes subidas
  ├── Roulette3D.tsx              # Escena 3D con ruletas
  └── VictoryScreen.tsx           # Pantalla de celebración

/public
  ├── /models
  │   ├── ruleta.glb              # Modelo 3D de la ruleta
  │   └── flecha.glb              # Modelo 3D del puntero
  ├── /audio
  │   └── clack.mp3               # SFX de clack
  └── /images
      └── Mantel.jpg              # Fondo decorativo
```

### Flujo de Datos

1. **Subida de Imágenes** (app/page.tsx)
   - Usuario selecciona 1+ imágenes (JPG, PNG, WebP)
   - Se crean URLs temporales con `URL.createObjectURL()`
   - Se muestran previews en `MenuImagePreview` component

2. **Procesamiento IA** (app/api/extract-menu/route.ts)
   - Conversión de imágenes a Base64
   - Envío a OpenRouter API con prompt estructurado
   - Respuesta esperada: `{ comida: string[], bebidas: string[] }`
   - Manejo de errores y respuestas malformadas

3. **Vista de Resultados** (components/ExtractionResults.tsx)
   - Muestra listas extraídas
   - Botón "Proceder a las Ruletas"

4. **Escena 3D** (components/Roulette3D.tsx)
   - Renderiza 2 ruletas (comida y bebidas)
   - Física de giro con easing (easeOutCubic)
   - Sonido de clack sincronizado
   - Selección aleatoria de ganador

5. **Pantalla Victoria** (components/VictoryScreen.tsx)
   - Confeti animado
   - Resultado final ("Comerás X con Y")
   - Opciones: volver a girar o nuevo menú

## 4. Componentes Clave

### Roulette3D.tsx
**Responsabilidades:**
- Renderizado de Canvas Three.js
- Gestión de estado de giro (isSpinning)
- Cálculo de ángulo ganador
- Animación con easing cubic
- Reproducción de audio sincronizado

**Algoritmo de Giro:**
```typescript
// Calcula el ángulo de la sección ganadora
const angleStep = (Math.PI * 2) / items.length;
const winningAngle = targetItemIndex * angleStep;

// Añade 5-8 vueltas completas extra para suspenso
const fullSpins = 5 + Math.random() * 3;

// Normaliza el ángulo final con offset del puntero
const targetRotation = pointerAngleOffset - winningAngle + (fullSpins * Math.PI * 2);
```

**Easing:**
- Función: `easeOutCubic(x) = 1 - (1 - x)³`
- Proporciona aceleración rápida y desaceleración suave

### API Route (extract-menu/route.ts)
**Configuración del Prompt:**
```typescript
const prompt = `
Eres un asistente experto en reconocimiento de menús.
Extrae SOLO nombres de platos y bebidas.
IGNORA precios y descripciones.
Devuelve un ÚNICO objeto JSON:
{
  "comida": ["plato 1", "plato 2"],
  "bebidas": ["bebida 1", "bebida 2"]
}
`;
```

**Manejo de Casos Edge:**
- Combina múltiples imágenes en una sola respuesta
- Detecta y corrige respuestas en formato array (bug de algunos LLMs)
- Elimina duplicados
- Limpia bloques markdown (```json)

### LoadingSpinner.tsx
**Mensajes Graciosos:**
- "Leyendo los jeroglíficos del chef..."
- "Traduciendo del idioma 'Menú Manchado'..."
- "Consultando con el oráculo de la fritanga..."
- (Rotación cada 2 segundos)

## 5. Estilos Visuales

### Paleta de Colores
- **Fondo Principal**: Amarillo brillante (#FBBF24 / yellow-400)
- **Acento Primario**: Rojo intenso (#DC2626 / red-600)
- **Acento Secundario**: Azul cobalto (#1D4ED8 / blue-700)
- **Texto**: Rojo oscuro (#7F1D1D / red-900)

### Tipografía
- **Fuente**: Sans-serif del sistema
- **Efectos**: Drop shadows, text outlines, italic uppercase
- **Estilo**: Caricaturesco, estilo "game show" exagerado

### Animaciones CSS
- Buttons: `active:translate-y-[12px]` (efecto de botón presionado)
- Shake: animación de error
- Pulse: mensajes importantes
- Confeti: react-confetti con físicas realistas

## 6. Assets Requeridos

### Modelos 3D (implementados)
✅ `/public/models/ruleta.glb` - Modelo de ruleta casino
✅ `/public/models/flecha.glb` - Puntero/flecha indicador

### Audio (parcial)
✅ `/public/audio/clack.mp3` - Sonido de clack al pasar secciones
⚠️ Música de fondo (BackgroundMusic.tsx existe pero sin implementar)
⚠️ SFX de celebración
⚠️ SFX de tambores

### Imágenes
✅ `/public/images/Mantel.jpg` - Textura de fondo

## 7. Variables de Entorno

Archivo `.env.local` requerido:
```bash
OPENROUTER_API_KEY=tu_api_key_aqui
```

**Obtención:**
1. Crear cuenta en https://openrouter.ai
2. Generar API key
3. Agregar al archivo `.env.local`
4. Reiniciar servidor de desarrollo

## 8. Comandos de Desarrollo

```bash
# Instalar dependencias
npm install

# Modo desarrollo (localhost:3000)
npm run dev

# Build para producción
npm run build

# Iniciar servidor de producción
npm start

# Linting
npm run lint
```

## 9. Flujo de Usuario Completo

1. **Pantalla Inicial**
   - Título gigante: "La Ruleta Tragona 3000"
   - Botón rojo grande: "Subir Menú"
   - Footer humorístico

2. **Subida de Imágenes**
   - Click en botón → selector de archivos
   - Previews aparecen con botones de eliminar
   - Botón "Procesar Menú" se habilita

3. **Procesamiento**
   - Pantalla de carga con mensajes rotativos
   - Llamada a API OpenRouter
   - Parsing de respuesta JSON

4. **Revisión de Resultados**
   - Listas de comidas y bebidas extraídas
   - Botón "¡A las Ruletas!"

5. **Escena 3D**
   - 2 ruletas con textos dinámicos
   - Botón gigante "¡GIRAR! 🎲"
   - Controles de cámara (OrbitControls)

6. **Animación de Giro**
   - Ruletas giran con easing
   - Sonido clack sincronizado
   - Comida termina primero (6s)
   - Bebidas terminan después (8s)

7. **Pantalla de Victoria**
   - Confeti animado
   - Resultado: "¡Comerás [X] con [Y]!"
   - Opciones: "Volver a Girar" o "Nuevo Menú"

## 10. Mejoras Futuras y TODOs

### Audio
- [ x ] Implementar música de fondo (Bossa Nova/Jazz)
- [ ] Añadir SFX de tambores durante últimos segundos
- [ ] SFX de celebración en VictoryScreen
- [ x ] Easter egg: sonido triste para "Ensalada verde" o "Agua simple"

### Visual
- [ x] Modelos 3D más temáticos (plato de comida, vaso)
- [ ] Mejores texturas para ruletas
- [  ] Partículas de comida en lugar de confeti genérico
- [ ] Animaciones de entrada/salida entre pantallas

### Funcionalidad
- [ ] Persistencia de menús guardados (mongodb)
- [ ] Compartir resultado en redes sociales
- [ ] Modo "dieta" o filtros (vegetariano, sin azúcar, etc.)
- [ ] Historial de combinaciones ganadas
- [ ] Soporte para menús multi-idioma

### Performance
- [ ] Lazy loading de modelos 3D
- [ ] Optimización de tamaño de assets
- [ ] Progressive Web App (PWA)
- [ ] Caching de respuestas de IA

## 11. Troubleshooting


### Error: "No se detectaron platos ni bebidas"
**Causas posibles:**
- Imagen borrosa o mal iluminada
- Menú en idioma no soportado
- Texto demasiado pequeño

**Solución:** Reintentar con mejor foto o menú más legible

### Modelos 3D no cargan
**Verificar:**
- Archivos existen en `/public/models/`
- Formato GLB válido
- Consola del navegador para errores de red

### Ruletas giran incorrectamente
**Revisar:**
- Cálculo de `angleStep` con división por cero
- Arrays vacíos en `comida` o `bebidas`
- Valores de `pointerAngleOffset`

## 12. Licencia y Créditos

**Proyecto:** La Ruleta Tragona 3000  
**Año:** 2026  
**Slogan:** "El que no elige, no come."

**Tecnologías Open Source:**
- Next.js (Vercel)
- Three.js (MIT)
- React Three Fiber (MIT)
- Tailwind CSS (MIT)

**IA Powered by:** OpenRouter + Google Gemini
