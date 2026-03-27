"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface MenuImage {
  id: string;
  url: string;
  file: File;
}

interface ExtractionResult {
  comida: string[];
  bebidas: string[];
}

const LOADING_MESSAGES = [
  "Leyendo los jeroglíficos del chef...",
  "Traduciendo manchas de grasa a comida...",
  "Sobornando al mesero para el menú secreto...",
  "Afilando los cubiertos virtuales...",
  "Oliendo los píxeles para identificar ingredientes..."
];

export default function Home() {
  const [images, setImages] = useState<MenuImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MESSAGES[0]);
  const [result, setResult] = useState<ExtractionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cleanup blob URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.url));
    };
  }, [images]);

  // Rotate loading messages
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isProcessing) {
      interval = setInterval(() => {
        setLoadingMsg((prev) => {
          const currentIndex = LOADING_MESSAGES.indexOf(prev);
          return LOADING_MESSAGES[(currentIndex + 1) % LOADING_MESSAGES.length];
        });
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isProcessing]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const newImages = selectedFiles.map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        url: URL.createObjectURL(file),
        file,
      }));
      setImages((prev) => [...prev, ...newImages]);
      setError(null);
    }
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const imgToRemove = prev.find((img) => img.id === id);
      if (imgToRemove) URL.revokeObjectURL(imgToRemove.url);
      return prev.filter((img) => img.id !== id);
    });
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const processMenu = async () => {
    if (images.length === 0) return;
    setIsProcessing(true);
    setError(null);
    
    try {
      const base64Images = await Promise.all(images.map(img => fileToBase64(img.file)));
      
      const response = await fetch('/api/extract-menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ images: base64Images })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error en la petición');
      }

      const resultData: ExtractionResult = await response.json();
      
      if ((!resultData.comida || resultData.comida.length === 0) && (!resultData.bebidas || resultData.bebidas.length === 0)) {
          throw new Error('No se detectaron platos ni bebidas.');
      }

      setResult({
        comida: resultData.comida || [],
        bebidas: resultData.bebidas || []
      });
    } catch (err: any) {
      console.error(err);
      if (err.message === 'API key no configurada') {
        setError("¡Falta la API Key! Agrega OPENROUTER_API_KEY a tu .env.local y reinicia el servidor.");
      } else {
        setError("¡Rayos! El chef no entiende tu letra (o la IA se empachó). Reintenta.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-yellow-400 flex flex-col items-center justify-center p-8 text-center">
        <div className="animate-bounce mb-8">
           <span className="text-9xl">🤤</span>
        </div>
        <h2 className="text-4xl font-black text-red-700 uppercase animate-pulse mb-4">
          {loadingMsg}
        </h2>
        <div className="w-64 h-4 bg-red-900/20 rounded-full overflow-hidden relative">
          <div className="h-full bg-red-600 absolute inset-0 animate-loading-bar"></div>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="min-h-screen bg-yellow-400 p-8 flex flex-col items-center">
        <header className="mb-12 text-center">
          <h1 className="text-6xl font-black text-red-600 uppercase italic mb-2 tracking-tighter">
            Menú Decodificado
          </h1>
          <p className="text-xl font-bold text-red-800">El destino tiene hambre...</p>
        </header>
        
        <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl p-6 border-4 border-red-600 shadow-xl">
            <h2 className="text-3xl font-black text-red-600 mb-4 border-b-4 border-red-100 pb-2 flex items-center gap-2">
              🍕 COMIDAS
            </h2>
            <ul className="space-y-2">
              {result.comida.map((item, idx) => (
                <li key={idx} className="text-xl font-bold text-red-900 bg-red-50 p-3 rounded-xl border-2 border-red-100">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-3xl p-6 border-4 border-blue-600 shadow-xl">
            <h2 className="text-3xl font-black text-blue-600 mb-4 border-b-4 border-blue-100 pb-2 flex items-center gap-2">
              🥤 BEBIDAS
            </h2>
            <ul className="space-y-2">
              {result.bebidas.map((item, idx) => (
                <li key={idx} className="text-xl font-bold text-blue-900 bg-blue-50 p-3 rounded-xl border-2 border-blue-100">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <button 
          onClick={() => setResult(null)}
          className="mt-12 bg-red-600 text-white text-3xl font-black py-6 px-12 rounded-full border-b-8 border-red-900 shadow-2xl hover:scale-105 active:translate-y-1 transition-all uppercase"
        >
          ¡A las Ruletas! 🎡
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yellow-400 font-sans p-8 flex flex-col items-center">
      <header className="mb-12 text-center">
        <h1 className="text-6xl font-black text-red-600 drop-shadow-[0_5px_0_rgba(0,0,0,0.2)] uppercase italic tracking-tighter mb-2">
          La Ruleta Tragona 3000
        </h1>
        <p className="text-xl font-bold text-red-800">¡Deja que el destino elija tu banquete!</p>
      </header>

      <main className="w-full max-w-4xl flex flex-col items-center gap-12">
        {/* Error Message */}
        {error && (
          <div className="bg-red-600 text-white font-black p-4 rounded-2xl shadow-lg animate-shake">
            ⚠️ {error}
          </div>
        )}

        {/* Upload Button Section */}
        <div className="flex flex-col items-center gap-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            accept="image/png, image/jpeg, image/webp"
            className="hidden"
          />
          <button
            onClick={triggerUpload}
            className="bg-red-600 hover:bg-red-700 active:translate-y-1 transition-all text-white text-4xl font-black py-8 px-16 rounded-full border-b-8 border-red-900 shadow-2xl uppercase tracking-widest hover:scale-105 transform cursor-pointer"
          >
            Subir Menú
          </button>
          <p className="text-red-900 font-bold animate-pulse text-lg">
            ¡Sube las fotos de lo que hay para tragar! 📸
          </p>
        </div>

        {/* Thumbnail Previews Section */}
        {images.length > 0 && (
          <div className="w-full bg-white/50 rounded-3xl p-8 border-4 border-dashed border-red-400">
            <h2 className="text-2xl font-black text-red-700 mb-6 uppercase">Tu Menú Visual:</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {images.map((img) => (
                <div key={img.id} className="relative group aspect-square">
                  <div className="w-full h-full rounded-2xl overflow-hidden border-4 border-white shadow-lg transform group-hover:rotate-2 transition-transform">
                    <Image
                      src={img.url}
                      alt="Thumbnail del menú"
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                  <button
                    onClick={() => removeImage(img.id)}
                    className="absolute -top-3 -right-3 bg-red-600 text-white w-8 h-8 rounded-full font-bold shadow-md hover:bg-red-800 transition-colors z-10"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-12 flex justify-center">
                <button 
                  onClick={processMenu}
                  className="bg-green-500 hover:bg-green-600 text-white text-2xl font-black py-4 px-12 rounded-2xl border-b-4 border-green-800 transition-all uppercase"
                >
                    ¡Listo para Procesar! 🍕
                </button>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-auto pt-16 text-red-900/50 font-bold">
        © 2026 La Ruleta Tragona 3000 - El que no elige, no come.
      </footer>
    </div>
  );
}
