"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import LoadingSpinner from "@/components/LoadingSpinner";
import ExtractionResults from "@/components/ExtractionResults";
import MenuImagePreview, { MenuImage } from "@/components/MenuImagePreview";
import Roulette3D from "@/components/Roulette3D";
import RateLimitBadge from "@/components/RateLimitBadge";
import { useSession } from "@/lib/auth-client";
import { IMAGE_CONSTRAINTS, ERROR_MESSAGES } from "@/lib/config";
import type { ExtractionResult } from "@/types";

import UploadSection from "@/components/UploadSection";
import AuthWarning from "@/components/AuthWarning";

export default function MenuProcessor() {
  const { data: session, isPending } = useSession();
  const [images, setImages] = useState<MenuImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ExtractionResult | null>(null);
  const [showRoulette, setShowRoulette] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.url));
    };
  }, [images]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);

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

  const processMenu = async () => {
    if (images.length === 0) return;

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

      if (resultData.meta) {
        localStorage.setItem(
          "rateLimitInfo",
          JSON.stringify({
            remaining: resultData.meta.remaining,
            total: 5,
            resetAt: resultData.meta.resetAt,
          }),
        );
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

  // Safe Hydration Check for states dependent on session
  const isDisabled = mounted ? (!session || isPending) : false;
  const isActiveSession = Boolean(mounted && session && !isPending);

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
    <>
      {mounted && session && (
        <div className="w-full flex justify-center scale-90 sm:scale-100">
          <RateLimitBadge />
        </div>
      )}
      
      {error && (
        <div className="bg-red-600 text-white font-black p-4 sm:p-6 rounded-2xl border-4 border-black shadow-[6px_6px_0_#000] sm:shadow-[8px_8px_0_#000] animate-shake text-sm sm:text-lg text-center max-w-2xl mx-4">
          ⚠️ {error}
        </div>
      )}

      <AuthWarning show={Boolean(mounted && !session && !isPending)} />

      <UploadSection
        isDisabled={isDisabled}
        isActiveSession={isActiveSession}
        hasImages={images.length > 0}
        onFileChange={handleFileChange}
      />

      <MenuImagePreview
        images={images}
        onRemoveImage={removeImage}
        onProcessOptions={processMenu}
      />
    </>
  );
}
