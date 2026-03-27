"use client";

import { useState, useRef, useEffect } from "react";
import LoadingSpinner, { LOADING_MESSAGES } from "@/components/LoadingSpinner";
import ExtractionResults from "@/components/ExtractionResults";
import MenuImagePreview, { MenuImage } from "@/components/MenuImagePreview";

export interface ExtractionResult {
  comida: string[];
  bebidas: string[];
}

export default function Home() {
  const [images, setImages] = useState<MenuImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MESSAGES[0]);
  const [result, setResult] = useState<ExtractionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.url));
    };
  }, [images]);

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

  const processMenu = async () => {
    if (images.length === 0) return;
    setIsProcessing(true);
    setError(null);
    
    try {
      const formData = new FormData();
      images.forEach(img => {
        formData.append('images', img.file);
      });
      
      const response = await fetch('/api/extract-menu', {
        method: 'POST',
        body: formData
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
    return <LoadingSpinner message={loadingMsg} />;
  }

  if (result) {
    return (
      <ExtractionResults 
        result={result} 
        onReset={() => setResult(null)} 
      />
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
        {error && (
          <div className="bg-red-600 text-white font-black p-4 rounded-2xl shadow-lg animate-shake">
            ⚠️ {error}
          </div>
        )}

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

        <MenuImagePreview 
          images={images} 
          onRemoveImage={removeImage} 
          onProcessOptions={processMenu} 
        />
      </main>

      <footer className="mt-auto pt-16 text-red-900/50 font-bold">
        © 2026 La Ruleta Tragona 3000 - El que no elige, no come.
      </footer>
    </div>
  );
}
