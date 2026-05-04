import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate-limit';
import { processImage, bufferToDataUrl, isValidImageType, isValidImageSize } from '@/lib/image-processor';
import { IMAGE_CONSTRAINTS, ERROR_MESSAGES } from '@/lib/config';
import { headers } from 'next/headers';

export async function POST(request: Request) {
  try {
    // 1. Verificar autenticación
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.NOT_AUTHENTICATED },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // 2. Verificar rate limit
    const rateLimitResult = await checkRateLimit(userId);
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: ERROR_MESSAGES.RATE_LIMIT_EXCEEDED,
          remaining: rateLimitResult.remaining,
          resetAt: rateLimitResult.resetAt,
          current: rateLimitResult.current,
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': '5',
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.resetAt.toISOString(),
          }
        }
      );
    }

    // 3. Validar imágenes
    const formData = await request.formData();
    const files = formData.getAll('images') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No images provided' }, { status: 400 });
    }

    // Validar cantidad de imágenes
    if (files.length > IMAGE_CONSTRAINTS.MAX_FILES_COUNT) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.TOO_MANY_IMAGES },
        { status: 400 }
      );
    }

    // Validar tipo y tamaño de cada imagen
    for (const file of files) {
      if (!isValidImageType(file.type)) {
        return NextResponse.json(
          { error: ERROR_MESSAGES.INVALID_IMAGE_TYPE },
          { status: 400 }
        );
      }

      if (!isValidImageSize(file.size)) {
        return NextResponse.json(
          { error: ERROR_MESSAGES.IMAGE_TOO_LARGE },
          { status: 400 }
        );
      }
    }

    // Mock response para desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log('--- MODO DESARROLLO ACTIVADO: Usando respuesta mock ---');
      console.log(`Usuario: ${session.user.email} | Requests restantes: ${rateLimitResult.remaining}`);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simular latencia reducida
      return NextResponse.json({
        comida: [
          "Tacos de Pastor (MOCK)",
          "Enchiladas Suizas (MOCK)",
          "Chilaquiles Rojos (MOCK)",
          "Hamburguesa Especial (MOCK)",
          "Pizza Peperoni (MOCK)",
          "Ensalada César (MOCK)"
        ],
        bebidas: [
          "Agua de Jamaica (MOCK)",
          "Refresco de Cola (MOCK)",
          "Cerveza Artesanal (MOCK)",
          "Margarita de Limón (MOCK)",
          "Café Americano (MOCK)"
        ],
        meta: {
          remaining: rateLimitResult.remaining,
          resetAt: rateLimitResult.resetAt,
        }
      });
    }

    // 4. Procesar y comprimir imágenes
    const processedImages = await Promise.all(
      files.map(async (file) => {
        try {
          const processed = await processImage(file);
          console.log(
            `Image processed: ${file.name} | Original: ${(processed.originalSize / 1024).toFixed(2)}KB | ` +
            `Compressed: ${(processed.compressedSize / 1024).toFixed(2)}KB | ` +
            `Saved: ${((1 - processed.compressedSize / processed.originalSize) * 100).toFixed(1)}%`
          );
          return bufferToDataUrl(processed.buffer, processed.mimeType);
        } catch (error) {
          console.error('Error processing image:', file.name, error);
          throw new Error(ERROR_MESSAGES.COMPRESSION_FAILED);
        }
      })
    );

    // 5. Llamar a la API de OpenRouter
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey || apiKey === 'tu_api_key_aqui') {
      return NextResponse.json({ error: 'API key no configurada' }, { status: 500 });
    }

    const promptMessage = {
      type: "text",
      text: `Eres un asistente experto en reconocimiento y extracción de texto de menús de comida.
Tu tarea es leer las imágenes del menú que se te proporcionan y extraer ÚNICAMENTE los nombres de los platos de comida y las bebidas.
Reglas IMPORTANTES:
1. IGNORA SIEMPRE TODOS LOS PRECIOS o números.
2. IGNORA descripciones cortas, enfócate en el nombre principal del platillo o bebida.
3. Importante: ¡Sin importar cuántas imágenes recibas, debes devolver un ÚNICO objeto JSON combinando todo! No devuelvas un array de objetos.
4. Devuelve los resultados STRICTAMENTE en formato JSON con la siguiente estructura:
{
  "comida": ["nombre del plato 1", "nombre del plato 2"],
  "bebidas": ["nombre de bebida 1", "nombre de bebida 2"]
}
Si no encuentras bebidas o comida, devuelve el array vacío. Devuelve SOLO JSON válido sin texto adicional.`
    };

    const imageMessages = processedImages.map((b64Img: string) => ({
      type: "image_url",
      image_url: {
        url: b64Img
      }
    }));

    const contentArray = [promptMessage, ...imageMessages];

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.BETTER_AUTH_URL || 'http://localhost:3000',
        'X-Title': 'La Ruleta Tragona 3000',
      },
      body: JSON.stringify({
        model: 'google/gemini-3.1-flash-lite-preview',
        messages: [
          {
            role: 'user',
            content: contentArray
          }
        ],
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API Error:', errorText);
      return NextResponse.json({ error: 'Error del API externo.' }, { status: response.status });
    }

    const data = await response.json();
    let textResult = data.choices?.[0]?.message?.content || "{}";
    
    // Clean up if it contains markdown JSON blocks
    textResult = textResult.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    try {
      let parsedResult = JSON.parse(textResult);
      
      // Handle array of results from buggy LLM responses
      if (Array.isArray(parsedResult)) {
        const combinedResult = { comida: [] as string[], bebidas: [] as string[] };
        for (const item of parsedResult) {
          if (item.comida && Array.isArray(item.comida)) {
            combinedResult.comida.push(...item.comida);
          }
          if (item.bebidas && Array.isArray(item.bebidas)) {
            combinedResult.bebidas.push(...item.bebidas);
          }
        }
        // Remove duplicates
        parsedResult = {
          comida: Array.from(new Set(combinedResult.comida)),
          bebidas: Array.from(new Set(combinedResult.bebidas))
        };
      }

      // Agregar metadata de rate limit a la respuesta
      return NextResponse.json(
        {
          ...parsedResult,
          meta: {
            remaining: rateLimitResult.remaining,
            resetAt: rateLimitResult.resetAt,
          }
        },
        {
          headers: {
            'X-RateLimit-Limit': '5',
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.resetAt.toISOString(),
          }
        }
      );
    } catch(e) {
      console.error("Failed to parse JSON:", textResult);
      return NextResponse.json({ error: 'La respuesta de la IA no fue un JSON válido.' }, { status: 500 });
    }

  } catch (error) {
    console.error('Error en /api/extract-menu:', error);
    
    // Manejar errores específicos
    if (error instanceof Error) {
      if (error.message === 'COMPRESSION_FAILED') {
        return NextResponse.json(
          { error: ERROR_MESSAGES.COMPRESSION_FAILED },
          { status: 400 }
        );
      }
    }
    
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
  }
}
