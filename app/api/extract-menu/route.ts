import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('images') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No images provided' }, { status: 400 });
    }

    // Mock response for development environment to save API credits
    if (process.env.NODE_ENV === 'development') {
      console.log('--- MODO DESARROLLO ACTIVADO: Usando respuesta mock ---');
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simular latencia
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
        ]
      });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey || apiKey === 'tu_api_key_aqui') {
      return NextResponse.json({ error: 'API key no configurada' }, { status: 500 });
    }

    // Convert files to base64 format for OpenRouter
    const images = await Promise.all(
      files.map(async (file) => {
        const buffer = await file.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        return `data:${file.type};base64,${base64}`;
      })
    );

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

    const imageMessages = images.map((b64Img: string) => ({
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
        'HTTP-Referer': 'http://localhost:3000',
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

        return NextResponse.json(parsedResult);
    } catch(e) {
        console.error("Failed to parse JSON:", textResult);
        return NextResponse.json({ error: 'La respuesta de la IA no fue un JSON válido.' }, { status: 500 });
    }

  } catch (error) {
    console.error('Error en /api/extract-menu:', error);
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
  }
}
