# Prompts para Generar Assets - La Ruleta Tragona 3000

> Contexto del proyecto: App web humoristica estilo "casino de comida rapida" / game show exagerado. Estetica caricaturesca, colores dominantes: amarillo mostaza, rojo ketchup, blanco, con acentos azul y verde. Estilo visual tipo Pixar-meets-fast-food. Cultura culinaria mexicana/latina. Tono irreverente y over-the-top.

---

## PARTE 1: Prompts para Imagenes 2D

---

### 1. Sprites de Comida para Confeti

Estas imagenes se usan como particulas de confeti en la pantalla de victoria. Deben ser pequenas, con fondo transparente, y muy legibles a tamanos reducidos.

#### `pizza.png` - Sprite de Pizza

**Prompt (Generador de imagenes 2D - ej. Midjourney, DALL-E, Ideogram):**

```
A single cartoon pizza slice, 2D flat illustration, bright saturated colors with warm yellows and reds, melted cheese dripping slightly, pepperoni toppings visible, thick black outline like a comic book sticker, exaggerated and playful proportions, cute chibi food style, transparent background, PNG with alpha channel, simple clean design optimized for small sizes, fast-food mascot aesthetic, no shadows on background, isolated object on pure transparent background
```

#### `burger.png` - Sprite de Hamburguesa

**Prompt:**

```
A single cartoon hamburger, 2D flat illustration, bright saturated colors, sesame seed bun with golden brown top, visible layers of lettuce tomato cheese and patty, thick black outline like a comic book sticker, exaggerated bouncy proportions with slightly oversized bun, cute chibi food style, transparent background, PNG with alpha channel, simple clean design optimized for small sizes, fast-food mascot aesthetic, no shadows on background, isolated object on pure transparent background
```

#### `soda.png` - Sprite de Refresco

**Prompt:**

```
A single cartoon soda cup with straw, 2D flat illustration, bright red cup with white lid and yellow bendy straw, condensation drops on the cup, thick black outline like a comic book sticker, exaggerated playful proportions, cute chibi food style, transparent background, PNG with alpha channel, simple clean design optimized for small sizes, fast-food mascot aesthetic, no shadows on background, isolated object on pure transparent background
```

---

### 2. Iconos de Carga (Loading Faces)

Se usan durante la animacion de carga cuando la IA lee el menu. Deben ser caras exageradas y comicas.

#### `babeando.png` - Cara Babeando

**Prompt:**

```
A single cartoon face drooling with extreme hunger, 2D flat illustration, round yellow face like a food emoji, eyes half-closed in ecstasy, huge open mouth with exaggerated drool waterfall, rosy cheeks, thick black outline like a comic sticker, over-the-top silly expression, bright saturated colors yellow and red tones, cute and funny style, transparent background, PNG with alpha channel, isolated on pure transparent background, no text, simple bold design readable at small sizes
```

#### `hambre.png` - Cara con Hambre

**Prompt:**

```
A single cartoon face showing extreme desperate hunger, 2D flat illustration, round yellow face like a food emoji, wide crazy eyes with spiral pupils, biting its own lip dramatically, tiny fork and knife held in small hands on each side, thick black outline like a comic sticker, over-the-top comical desperation expression, bright saturated colors yellow and red tones, cute and funny style, transparent background, PNG with alpha channel, isolated on pure transparent background, no text, simple bold design readable at small sizes
```

---

### 3. Textura de Mantel

Se usa como fondo del escenario 3D donde giran las ruletas. Debe ser seamless/tileable.

#### `mantel.jpg` - Textura de Mantel a Cuadros

**Prompt:**

```
Seamless tileable checkered picnic tablecloth pattern, top-down view, classic red and white gingham check pattern, slightly worn fabric texture with subtle cloth weave detail, warm lighting, bright saturated red (#DC2626) alternating with creamy white squares, soft fabric folds barely visible for depth, cartoon-stylized not photorealistic, clean repeating pattern suitable for 3D texture mapping, high resolution 1024x1024, no perspective distortion, perfectly tileable on all edges
```

---

## PARTE 2: Prompts para Modelos 3D

> Nota: Estos prompts estan disenados para herramientas de generacion 3D como Meshy, Tripo3D, Luma Genie, Rodin, o similares que exportan a `.glb`/`.gltf`. Ajustar segun la herramienta.

---

### 1. Modelo de la Ruleta

#### `ruleta.glb` - Disco/Plato Gigante de Ruleta

**Prompt para generacion 3D:**

```
A giant cartoon dinner plate shaped like a game show roulette wheel, 3D model, stylized low-poly cartoon aesthetic, thick circular disc with raised rim like a colorful dinner plate or pot lid, the top surface is divided into 8 equal pie-slice segments separated by raised ridges, each segment is a different bright color (red, yellow, orange, green, blue, pink, purple, white), the rim has a decorative scalloped edge like a fancy plate, shiny glossy plastic material with subtle reflections like a toy, small decorative fork and knife icons embossed around the outer rim, overall style is playful exaggerated and cartoonish like a board game piece, centered on origin, Y-axis is the spin axis, clean topology suitable for web rendering
```

**Prompt alternativo (enfasis en plato mexicano):**

```
A giant cartoon Mexican cazuela plate transformed into a roulette wheel, 3D model, stylized cartoon aesthetic, thick ceramic-looking disc with traditional raised clay rim, the top surface divided into 8 colorful pie segments with raised dividers, each segment painted in bright fiesta colors (red, yellow, orange, green, blue, magenta, turquoise, white), glazed shiny ceramic material like painted Talavera pottery, decorative zigzag pattern around the rim, playful exaggerated proportions like a toy or board game piece, centered on origin, Y-axis is spin axis, optimized low-poly for web, GLB format
```

---

### 2. Modelo del Puntero/Flecha

#### `flecha.glb` - Tenedor/Mano Indicadora

**Prompt opcion A - Tenedor gigante:**

```
A giant cartoon fork pointing downward as an arrow indicator, 3D model, stylized cartoon aesthetic, oversized comedic proportions, shiny metallic silver chrome material with exaggerated reflections, the fork has 3 thick rounded prongs, the handle curves slightly and ends in a decorative ball, the fork points straight down like a roulette pointer arrow, clean smooth cartoon style not realistic, looks like a giant toy utensil, playful and humorous, centered at the pivot point for rotation, optimized low-poly mesh for web rendering, GLB format
```

**Prompt opcion B - Mano gordita senalando:**

```
A cartoon chubby hand with index finger pointing downward, 3D model, stylized cartoon aesthetic like a mascot glove, four fingers and thumb with rounded puffy proportions, white glove with a small red cuff at the wrist, the index finger extends straight down as a pointer indicator, exaggerated cute proportions like a cartoon character hand, smooth clean topology, shiny slightly glossy material, playful and humorous game show style, centered at the wrist for mounting as a roulette pointer, optimized low-poly for web rendering, GLB format
```

---

## PARTE 3: Prompts para Audio

> Nota: Para audio se recomienda usar herramientas como Suno, Udio (musica), ElevenLabs SFX, o Freesound/Pixabay para efectos. Los prompts estan adaptados a generadores de audio por IA.

---

### 1. Musica de Fondo

#### `elevator_jazz.mp3` - Bossa Nova Tonta

**Prompt para generador de musica IA (Suno/Udio):**

```
Silly lighthearted bossa nova elevator music, loopable background track, gentle acoustic guitar with soft brushed drums and walking bass line, slightly out-of-tune piano adding comedic charm, sounds like waiting room music at a quirky Mexican restaurant, playful and goofy mood, moderate tempo around 110 BPM, warm vintage lo-fi tone, no vocals, 60-90 seconds loopable seamlessly, light and airy with a hint of comedy, think hold music meets food court ambiance
```

**Tags/Estilo sugerido:** `bossa nova, elevator music, comedy, lounge, instrumental, quirky, lo-fi`

---

### 2. Efectos de Sonido (SFX)

#### `clack.mp3` - Sonido de Giro de Ruleta

**Prompt para generador de SFX:**

```
A single short mechanical click or clack sound, like a roulette wheel tick passing a peg, crisp and sharp, slightly plasticky and toy-like not metallic, cartoonish clicky sound, very short duration under 0.2 seconds, clean with no reverb, suitable for rapid repetition during a spinning wheel animation
```

**Alternativa:** Buscar en librerias de SFX gratuitas: "roulette tick", "wheel click", "game show spinner click"

---

#### `ta_da.mp3` - Sonido Triunfal de Victoria

**Prompt para generador de SFX:**

```
A triumphant cartoon ta-da fanfare sound effect, brass instruments playing a short victorious jingle, over-the-top celebratory like a game show winning moment, bright and flashy with maybe a cymbal crash at the end, comedic and exaggerated not serious, 2-3 seconds long, think prize reveal on a silly TV game show, sparkle and shine sound layered on top
```

**Alternativa:** Buscar: "game show winner", "ta-da fanfare", "comedy victory sting"

---

#### `womp_womp.mp3` - Trombon Triste

**Prompt para generador de SFX:**

```
A sad trombone womp womp womp descending three-note failure sound effect, classic comedy disappointment sting, exaggerated and dramatic like a cartoon losing moment, low brass trombone sliding down in pitch three times, comedic and silly not actually sad, 2-3 seconds long, the classic fail sound from game shows and sitcoms
```

**Alternativa:** Buscar: "sad trombone", "womp womp", "fail sound effect", "game show loser"

---

## Resumen de Assets y Rutas

| Asset | Archivo | Ruta | Herramienta sugerida |
|---|---|---|---|
| Sprite pizza | `pizza.png` | `public/images/pizza.png` | DALL-E / Midjourney / Ideogram |
| Sprite hamburguesa | `burger.png` | `public/images/burger.png` | DALL-E / Midjourney / Ideogram |
| Sprite refresco | `soda.png` | `public/images/soda.png` | DALL-E / Midjourney / Ideogram |
| Cara babeando | `babeando.png` | `public/images/babeando.png` | DALL-E / Midjourney / Ideogram |
| Cara con hambre | `hambre.png` | `public/images/hambre.png` | DALL-E / Midjourney / Ideogram |
| Textura mantel | `mantel.jpg` | `public/images/mantel.jpg` | DALL-E / Midjourney (tile mode) |
| Modelo ruleta | `ruleta.glb` | `public/models/ruleta.glb` | Meshy / Tripo3D / Rodin |
| Modelo puntero | `flecha.glb` | `public/models/flecha.glb` | Meshy / Tripo3D / Rodin |
| Musica fondo | `elevator_jazz.mp3` | `public/audio/elevator_jazz.mp3` | Suno / Udio |
| SFX giro | `clack.mp3` | `public/audio/clack.mp3` | ElevenLabs SFX / Freesound |
| SFX victoria | `ta_da.mp3` | `public/audio/ta_da.mp3` | ElevenLabs SFX / Freesound |
| SFX decepcion | `womp_womp.mp3` | `public/audio/womp_womp.mp3` | ElevenLabs SFX / Freesound |

---

## Notas Importantes

1. **Todas las imagenes PNG** deben tener fondo transparente (alpha channel).
2. **La textura del mantel** debe ser tileable/seamless para repetirse en el plano 3D.
3. **Los modelos 3D** deben exportarse en formato `.glb` optimizado para web (bajo poligonaje, texturas embebidas).
4. **El audio de fondo** debe ser loopable sin cortes perceptibles.
5. **Los SFX** deben ser cortos y limpios, sin ruido de fondo.
6. **Estilo consistente:** Todos los assets deben mantener la estetica caricaturesca, colorida y exagerada del proyecto. Nada fotorrealista.
7. **Paleta de colores principal:** Amarillo (#FACC15), Rojo (#DC2626), Blanco (#FFFFFF), con acentos en azul (#2563EB) y verde (#22C55E).
