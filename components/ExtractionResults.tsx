import { useState } from "react";
import Image from "next/image";

import type { ExtractionResult } from "@/types";

interface ExtractionResultsProps {
  result: ExtractionResult;
  onProceed: (updatedResult: ExtractionResult) => void;
  onBack: () => void;
}

export default function ExtractionResults({
  result,
  onProceed,
  onBack,
}: ExtractionResultsProps) {
  const [comidas, setComidas] = useState(result.comida);
  const [bebidas, setBebidas] = useState(result.bebidas);

  const removeComida = (index: number) => {
    setComidas(comidas.filter((_, i) => i !== index));
  };

  const removeBebida = (index: number) => {
    setBebidas(bebidas.filter((_, i) => i !== index));
  };

  const handleProceed = () => {
    onProceed({ comida: comidas, bebidas });
  };

  return (
    <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center overflow-x-hidden">
      <header className="mb-8 lg:mb-12 text-center mt-4 w-full flex flex-col items-center">
        <div className="flex items-center justify-between w-full max-w-4xl px-2 sm:px-0 mb-6">
          <button
            onClick={onBack}
            className="cursor-pointer hover:scale-110 hover:rotate-0 transition-transform rotate-6 flex flex-col items-center group"
          >
            <div className="relative w-16 h-16 sm:w-24 sm:h-24">
              <Image
                src="/images/back.png"
                alt="Regresar"
                fill
                className="drop-shadow-[3px_3px_0_rgba(0,0,0,1)] z-10 object-contain"
              />
            </div>
            <span className="text-sm sm:text-xl font-black text-gray-100 uppercase text-shadow-[2px_2px_0_#000] mt-1">
              Regresar
            </span>
          </button>
          
          <h1 className="text-5xl sm:text-8xl font-black text-red-600 [text-shadow:4px_4px_0_#000] sm:[text-shadow:6px_6px_0_#000] uppercase italic tracking-tighter transform rotate-2">
            Menú
          </h1>
          
          <div className="w-16 sm:w-24"></div> {/* Spacer to center title */}
        </div>
        
        <div className="inline-block bg-white px-4 sm:px-6 py-2 border-4 border-black shadow-[4px_4px_0_#000] transform -rotate-2">
          <p className="text-sm sm:text-xl font-black text-red-900 uppercase">
            ¡Ya tengo hambre!
          </p>
          <p className="text-sm sm:text-xl font-black text-red-900 uppercase">
            ¿Quitas algo?
          </p>
        </div>
      </header>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-8 px-2 sm:px-0">
        {/* Comidas Card */}
        <div className="relative bg-white rounded-3xl p-5 sm:p-8 border-4 sm:border-8 border-black shadow-[8px_8px_0_#000] sm:shadow-[12px_12px_0_#000] transform md:-rotate-1 hover:rotate-0 transition-transform">
          <Image
            src="/images/pizza.png"
            alt="Pizza"
            width={80}
            height={80}
            className="absolute -top-10 -left-6 sm:-top-12 sm:-left-8 -rotate-12 drop-shadow-[4px_4px_0_rgba(0,0,0,1)] z-10 w-20 h-20 sm:w-28 sm:h-28 object-contain"
          />
          <h2 className="text-2xl sm:text-4xl font-black text-red-600 mb-6 border-b-4 sm:border-b-8 border-black pb-4 flex items-center justify-center gap-2 uppercase [text-shadow:2px_2px_0_#000] relative z-0">
            COMIDAS
          </h2>
          <ul className="space-y-3 sm:space-y-4 max-h-[300px] sm:max-h-[350px] overflow-y-auto pr-2 sm:pr-4 scrollbar-thin scrollbar-thumb-red-600 scrollbar-track-red-200">
            {comidas.map((item, idx) => (
              <li
                key={idx}
                className="text-base sm:text-xl font-black text-red-900 bg-red-100 p-3 sm:p-4 rounded-xl border-2 sm:border-4 border-black shadow-[3px_3px_0_#000] sm:shadow-[4px_4px_0_#000] flex justify-between items-center group"
              >
                <span className="truncate mr-2">{item}</span>
                <button
                  onClick={() => removeComida(idx)}
                  className="bg-red-500 text-white rounded-md w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center border-2 border-black hover:bg-red-400 hover:scale-110 active:scale-95 shrink-0 transition-transform"
                  title="Eliminar"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Bebidas Card */}
        <div className="relative bg-white rounded-3xl p-5 sm:p-8 border-4 sm:border-8 border-black shadow-[8px_8px_0_#000] sm:shadow-[12px_12px_0_#000] transform md:rotate-1 hover:rotate-0 transition-transform">
          <Image
            src="/images/soda.png"
            alt="Soda"
            width={80}
            height={80}
            className="absolute -top-10 -right-6 sm:-top-12 sm:-right-8 rotate-12 drop-shadow-[4px_4px_0_rgba(0,0,0,1)] z-10 w-20 h-20 sm:w-28 sm:h-28 object-contain"
          />
          <h2 className="text-2xl sm:text-4xl font-black text-blue-600 mb-6 border-b-4 sm:border-b-8 border-black pb-4 flex items-center justify-center gap-2 uppercase [text-shadow:2px_2px_0_#000] relative z-0">
            BEBIDAS
          </h2>
          <ul className="space-y-3 sm:space-y-4 max-h-[300px] sm:max-h-[350px] overflow-y-auto pr-2 sm:pr-4 scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-blue-200">
            {bebidas.map((item, idx) => (
              <li
                key={idx}
                className="text-base sm:text-xl font-black text-blue-900 bg-blue-100 p-3 sm:p-4 rounded-xl border-2 sm:border-4 border-black shadow-[3px_3px_0_#000] sm:shadow-[4px_4px_0_#000] flex justify-between items-center group"
              >
                <span className="truncate mr-2">{item}</span>
                <button
                  onClick={() => removeBebida(idx)}
                  className="bg-blue-500 text-white rounded-md w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center border-2 border-black hover:bg-blue-400 hover:scale-110 active:scale-95 shrink-0 transition-transform"
                  title="Eliminar"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-12 sm:mt-16 w-full flex justify-center pb-8 px-4">
        <button
          onClick={handleProceed}
          className="w-full sm:w-auto cursor-pointer relative bg-red-600 hover:bg-red-500 text-white transform md:-rotate-1 hover:rotate-0 text-2xl sm:text-4xl font-black py-4 sm:py-6 px-8 sm:pl-16 sm:pr-20 rounded-full border-4 border-black shadow-[6px_6px_0_#000] sm:shadow-[10px_10px_0_#000] hover:-translate-y-2 hover:shadow-[14px_14px_0_#000] active:translate-y-2 active:shadow-none transition-all uppercase flex items-center justify-center gap-4"
        >
          ¡A las Ruletas!
          <Image
            src="/images/ruleta.png"
            alt="Ruleta"
            width={80}
            height={80}
            className="absolute -top-10 -right-4 sm:-top-12 sm:-right-8 rotate-12 drop-shadow-[4px_4px_0_rgba(0,0,0,1)] z-10 w-20 h-20 sm:w-28 sm:h-28 object-contain hidden sm:block"
          />
        </button>
      </div>
    </div>
  );
}
