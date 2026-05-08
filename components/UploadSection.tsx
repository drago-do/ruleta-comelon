import React, { useRef } from "react";
import Image from "next/image";

interface UploadSectionProps {
  isDisabled: boolean;
  hasImages: boolean;
  isActiveSession: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function UploadSection({
  isDisabled,
  hasImages,
  isActiveSession,
  onFileChange,
}: UploadSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full px-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileChange}
        multiple
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
        disabled={isDisabled}
      />
      <button
        onClick={triggerUpload}
        disabled={isDisabled}
        className={`w-full sm:w-auto text-white text-2xl sm:text-4xl md:text-5xl font-black py-4 px-8 sm:py-6 sm:px-16 rounded-full border-4 border-black shadow-[6px_6px_0_#000] sm:shadow-[8px_8px_0_#000] uppercase tracking-widest transition-all ${
          isActiveSession
            ? "bg-red-600 hover:bg-red-500 hover:-translate-y-1 hover:shadow-[10px_10px_0_#000] active:translate-y-1 active:shadow-none cursor-pointer"
            : "bg-gray-400 cursor-not-allowed opacity-60"
        }`}
      >
        {hasImages ? "Más +" : "Subir Menú"}
      </button>

      <div className="w-full max-w-xs sm:max-w-none flex justify-center relative">
        <div className="mt-4 sm:mt-6 bg-yellow-200 px-4 py-2 sm:px-16 sm:py-3 border-4 border-black shadow-[4px_4px_0_#000] rounded-xl transform rotate-2">
          <p className="text-red-900 font-black animate-pulse text-[10px] sm:text-base lg:text-xl uppercase text-center">
            ¡Sube las fotos de lo que hay para comer!
          </p>
        </div>
        <div className="absolute -bottom-8 -right-4 sm:relative sm:bottom-0 sm:right-0 sm:w-20">
          <Image
            src="/images/foto.png"
            alt="celular tomando foto"
            className="w-16 sm:w-20 drop-shadow-[0_5px_0_rgba(1,2,5,0.5)]"
            width={100}
            height={100}
          />
        </div>
      </div>
    </div>
  );
}
