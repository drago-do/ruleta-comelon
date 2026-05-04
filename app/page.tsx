"use client";

import { useState, useRef, useEffect } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import ExtractionResults from "@/components/ExtractionResults";
import MenuImagePreview, { MenuImage } from "@/components/MenuImagePreview";
import Roulette3D from "@/components/Roulette3D";
import AuthButton from "@/components/AuthButton";
import RateLimitBadge from "@/components/RateLimitBadge";
import { useSession } from "@/lib/auth-client";
import { IMAGE_CONSTRAINTS, ERROR_MESSAGES } from "@/lib/config";
import Image from "next/image";

export interface ExtractionResult {
  comida: string[];
  bebidas: string[];
  meta?: {
    remaining: number;
    resetAt: string;
  };
}

export default function Home() {
  const { data: session, isPending } = useSession();
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

      // Validar límite total de imágenes
      if (
        images.length + selectedFiles.length >
        IMAGE_CONSTRAINTS.MAX_FILES_COUNT
      ) {
        setError(ERROR_MESSAGES.TOO_MANY_IMAGES);
        return;
      }

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

    // Validar autenticación
    if (!session) {
      setError(
        "🔐 Necesitas iniciar sesión con Google para usar esta función.",
      );
      return;
    }

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

        // Guardar info de rate limit si está presente
        if (errorData.remaining !== undefined) {
          localStorage.setItem(
            "rateLimitInfo",
            JSON.stringify({
              remaining: errorData.remaining,
              total: 5,
              resetAt: errorData.resetAt,
            }),
          );
        }

        throw new Error(errorData.error || "Error en la petición");
      }

      const resultData: ExtractionResult = await response.json();

      // Guardar info de rate limit
      if (resultData.meta) {
        localStorage.setItem(
          "rateLimitInfo",
          JSON.stringify({
            remaining: resultData.meta.remaining,
            total: 5,
            resetAt: resultData.meta.resetAt,
          }),
        );
        // Forzar actualización del badge
        window.dispatchEvent(new Event("storage"));
      }

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
      setError(
        err.message ||
          "¡Rayos! El chef no entiende tu letra (o la IA se empachó). Reintenta.",
      );
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
      {/* Auth Button - Esquina superior derecha */}
      <div className="fixed top-4 right-4 z-50">
        <AuthButton />
      </div>

      <header className="mb-8 sm:mb-12 mt-16 text-center sm:mt-8">
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
        {/* Rate Limit Badge */}
        {session && (
          <div className="w-full flex justify-center">
            <RateLimitBadge />
          </div>
        )}
        {error && (
          <div className="bg-red-600 text-white font-black p-4 sm:p-6 rounded-2xl border-4 border-black shadow-[6px_6px_0_#000] sm:shadow-[8px_8px_0_#000] animate-shake text-base sm:text-lg text-center max-w-2xl">
            ⚠️ {error}
          </div>
        )}

        {/* Mensaje si no está autenticado */}
        {!session && !isPending && (
          <div className="bg-yellow-300 text-black font-black p-6 rounded-2xl border-4 border-black shadow-[6px_6px_0_#000] text-center max-w-2xl">
            <div className="text-3xl mb-2">🔐</div>
            <div className="text-lg uppercase mb-2">
              ¡Inicia sesión para empezar!
            </div>
            <div className="text-sm">
              Necesitas autenticarte con Google para proteger la API de uso
              excesivo.
              <br />
              <span className="text-red-600">
                Límite: 5 extracciones por día.
              </span>
            </div>
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
            disabled={!session}
          />
          <button
            onClick={triggerUpload}
            disabled={!session || isPending}
            className={`w-full sm:w-auto text-white text-3xl sm:text-4xl md:text-5xl font-black py-4 px-8 sm:py-6 sm:px-16 rounded-full border-4 border-black shadow-[6px_6px_0_#000] sm:shadow-[8px_8px_0_#000] uppercase tracking-widest transition-all ${
              session && !isPending
                ? "bg-red-600 hover:bg-red-500 hover:-translate-y-1 hover:shadow-[10px_10px_0_#000] active:translate-y-1 active:shadow-none cursor-pointer"
                : "bg-gray-400 cursor-not-allowed opacity-60"
            }`}
          >
            {images.length > 0 ? "Más +" : "Subir Menú"}
          </button>
          <div className="w-full max-w-xs sm:max-w-none flex justify-center">
            <div className="mt-4 sm:mt-6 bg-yellow-200 px-4 py-2 sm:px-16 sm:py-3 border-4 border-black shadow-[4px_4px_0_#000] rounded-xl transform rotate-2">
              <p className="text-red-900 font-black animate-pulse text-xs sm:text-base lg:text-xl uppercase text-center">
                ¡Sube las fotos de lo que hay para comer!
              </p>
            </div>
            <span className="relative w-20">
              <Image
                src="/images/foto.png"
                alt="celular tomando foto"
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
