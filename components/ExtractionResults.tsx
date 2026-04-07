import { useState } from "react";
import Image from "next/image";

interface ExtractionResult {
  comida: string[];
  bebidas: string[];
}

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
    <div className="min-h-screen p-8 flex flex-col items-center">
      <header className="mb-3 lg:mb-12  text-center mt-6 w-full flex flex-col items-center">
        <div className="flex items-center justify-between w-3/4">
          <button
            onClick={onBack}
            className="cursor-pointer hover:scale-110 hover:rotate-0 transition-transform rotate-12"
          >
            <Image
              src="/images/back.png"
              alt="Soda"
              width={100}
              height={100}
              className="drop-shadow-[5px_5px_0_rgba(0,0,0,1)] z-10 w-24 h-24 sm:w-28 sm:h-28 object-contain"
            />
            <span className="text-2xl font-black text-gray-100 uppercase text-shadow-[2px_2px_0_#000]">
              Regresar
            </span>
          </button>
          <h1 className="text-6xl md:text-8xl font-black text-red-600 [text-shadow:6px_6px_0_#000] uppercase italic mb-6 tracking-tighter transform rotate-2">
            Menú
          </h1>
          <span className="w-[100px]"></span>
        </div>
        <div className="inline-block bg-white px-6 py-2 border-4 border-black shadow-[4px_4px_0_#000] transform -rotate-2">
          <p className="text-xl font-black text-red-900 uppercase">
            Ya tengo hambre...
          </p>
          <p className="text-xl font-black text-red-900 uppercase">
            Quitas algo?
          </p>
        </div>
      </header>

      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8">
        <div className="relative bg-white rounded-3xl p-8 border-8 border-black shadow-[12px_12px_0_#000] transform -rotate-1 hover:rotate-0 transition-transform mt-8 md:mt-0">
          <Image
            src="/images/pizza.png"
            alt="Pizza"
            width={100}
            height={100}
            className="absolute -top-12 -left-8 -rotate-12 drop-shadow-[5px_5px_0_rgba(0,0,0,1)] z-10 w-24 h-24 sm:w-28 sm:h-28 object-contain"
          />
          <h2 className="text-4xl font-black text-red-600 mb-6 border-b-8 border-black pb-4 flex items-center justify-center gap-2 uppercase [text-shadow:2px_2px_0_#000] relative z-0">
            COMIDAS
          </h2>
          <ul className="space-y-4 max-h-[350px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-red-600 scrollbar-track-red-200">
            {comidas.map((item, idx) => (
              <li
                key={idx}
                className="text-xl font-black text-red-900 bg-red-200 p-4 rounded-xl border-4 border-black shadow-[4px_4px_0_#000] flex justify-between items-center group"
              >
                <span>{item}</span>
                <button
                  onClick={() => removeComida(idx)}
                  className="bg-red-500 text-white rounded-md w-8 h-8 flex items-center justify-center border-2 border-black hover:bg-red-400 hover:scale-110 active:scale-95 shrink-0 transition-transform"
                  title="Eliminar"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative bg-white rounded-3xl p-8 border-8 border-black shadow-[12px_12px_0_#000] transform rotate-1 hover:rotate-0 transition-transform mt-8 md:mt-0">
          <Image
            src="/images/soda.png"
            alt="Soda"
            width={100}
            height={100}
            className="absolute -top-12 -right-8 rotate-12 drop-shadow-[5px_5px_0_rgba(0,0,0,1)] z-10 w-24 h-24 sm:w-28 sm:h-28 object-contain"
          />
          <h2 className="text-4xl font-black text-blue-600 mb-6 border-b-8 border-black pb-4 flex items-center justify-center gap-2 uppercase [text-shadow:2px_2px_0_#000] relative z-0">
            BEBIDAS
          </h2>
          <ul className="space-y-4 max-h-[350px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-blue-200">
            {bebidas.map((item, idx) => (
              <li
                key={idx}
                className="text-xl font-black text-blue-900 bg-blue-200 p-4 rounded-xl border-4 border-black shadow-[4px_4px_0_#000] flex justify-between items-center group"
              >
                <span>{item}</span>
                <button
                  onClick={() => removeBebida(idx)}
                  className="bg-blue-500 text-white rounded-md w-8 h-8 flex items-center justify-center border-2 border-black hover:bg-blue-400 hover:scale-110 active:scale-95 shrink-0 transition-transform"
                  title="Eliminar"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <button
        onClick={handleProceed}
        className="cursor-pointer relative mt-16 bg-red-600 hover:bg-red-500 text-white transform -rotate-1 hover:rotate-0 text-4xl font-black py-6 pl-16 pr-20 rounded-full border-4 border-black shadow-[10px_10px_0_#000] hover:-translate-y-2 hover:shadow-[14px_14px_0_#000] active:translate-y-2 active:shadow-none transition-all uppercase"
      >
        ¡A las Ruletas!
        <Image
          src="/images/ruleta.png"
          alt="Soda"
          width={100}
          height={100}
          className="absolute -top-12 -right-8 rotate-12 drop-shadow-[5px_5px_0_rgba(0,0,0,1)] z-10 w-24 h-24 sm:w-28 sm:h-28 object-contain"
        />
      </button>
    </div>
  );
}
