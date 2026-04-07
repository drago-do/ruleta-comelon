"use client";

import { useState, useRef, useEffect } from "react";
import LoadingSpinner, { LOADING_MESSAGES } from "@/components/LoadingSpinner";
import ExtractionResults from "@/components/ExtractionResults";
import MenuImagePreview, { MenuImage } from "@/components/MenuImagePreview";
import Roulette3D from "@/components/Roulette3D";
import Image from "next/image";

export interface ExtractionResult {
  comida: string[];
  bebidas: string[];
}

export default function Home() {
  const [images, setImages] = useState<MenuImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ExtractionResult | null>(null);
  const [showRoulette, setShowRoulette] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.url));
    };
  }, [images]);

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
      images.forEach((img) => {
        formData.append("images", img.file);
      });

      const response = await fetch("/api/extract-menu", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error en la petición");
      }

      const resultData: ExtractionResult = await response.json();

      if (
        (!resultData.comida || resultData.comida.length === 0) &&
        (!resultData.bebidas || resultData.bebidas.length === 0)
      ) {
        throw new Error("No se detectaron platos ni bebidas.");
      }

      setResult({
        comida: resultData.comida || [],
        bebidas: resultData.bebidas || [],
      });
    } catch (err: any) {
      console.error(err);
      if (err.message === "API key no configurada") {
        setError(
          "¡Falta la API Key! Agrega OPENROUTER_API_KEY a tu .env.local y reinicia el servidor.",
        );
      } else {
        setError(
          "¡Rayos! El chef no entiende tu letra (o la IA se empachó). Reintenta.",
        );
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (isProcessing) {
    return <LoadingSpinner />;
  }

  if (showRoulette && result) {
    return (
      <Roulette3D
        comida={result.comida}
        bebidas={result.bebidas}
        onBack={() => setShowRoulette(false)}
      />
    );
  }

  if (result) {
    return (
      <ExtractionResults
        result={result}
        onBack={() => setResult(null)}
        onProceed={(updatedResult) => {
          setResult(updatedResult);
          setShowRoulette(true);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen font-sans p-4 sm:p-8 flex flex-col items-center">
      <header className="mb-8 sm:mb-12 text-center mt-4 sm:mt-8">
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-red-600 [text-shadow:4px_4px_0_#000] sm:[text-shadow:6px_6px_0_#000] uppercase italic tracking-tighter mb-6 sm:mb-8 transform -rotate-2 leading-none">
          No sabes
          <br />
          qué comer?
        </h1>
        <div className="inline-block bg-white px-4 sm:px-8 py-2 sm:py-3 border-4 border-black shadow-[4px_4px_0_#000] sm:shadow-[6px_6px_0_#000] transform rotate-2">
          <p className="text-lg sm:text-2xl font-black text-red-800 uppercase tracking-widest">
            ¡Deja que el destino elija!
          </p>
        </div>
      </header>

      <main className="w-full max-w-4xl flex flex-col items-center gap-8 sm:gap-12">
        {error && (
          <div className="bg-red-600 text-white font-black p-4 sm:p-6 rounded-2xl border-4 border-black shadow-[6px_6px_0_#000] sm:shadow-[8px_8px_0_#000] animate-shake text-lg sm:text-xl uppercase">
            ⚠️ {error}
          </div>
        )}

        <div className="flex flex-col items-center gap-4 w-full">
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
            className="w-full sm:w-auto bg-red-600 hover:bg-red-500 hover:-translate-y-1 active:translate-y-2 transition-all text-white text-3xl sm:text-4xl md:text-5xl font-black py-4 px-8 sm:py-6 sm:px-16 rounded-full border-4 border-black shadow-[6px_6px_0_#000] sm:shadow-[8px_8px_0_#000] hover:shadow-[10px_10px_0_#000] active:shadow-none uppercase tracking-widest cursor-pointer"
          >
            {images.length > 0 ? "Más +" : "Subir Menú"}
          </button>
          <div className="w-full max-w-xs sm:max-w-none flex justify-center">
            <div className="mt-4 sm:mt-6 bg-yellow-200 px-4 py-2 sm:px-16 sm:py-3 border-4 border-black shadow-[4px_4px_0_#000] rounded-xl transform rotate-2">
              <p className="text-red-900 font-black animate-pulse text-xs sm:text-base lg:text-xl uppercase text-center">
                ¡Sube las fotos de lo que hay para tragar!
              </p>
            </div>
            <span className="relative w-20">
              <Image
                src="/images/foto.png"
                alt="migajon"
                className="absolute bottom-[-30px] left-[-30px] w-20 drop-shadow-[0_5px_0_rgba(1,2,5,0.5)]"
                width={100}
                height={100}
              />
            </span>
          </div>
        </div>

        <MenuImagePreview
          images={images}
          onRemoveImage={removeImage}
          onProcessOptions={processMenu}
        />
      </main>
      <div className="w-full"></div>
    </div>
  );
}
