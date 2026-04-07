import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

interface VictoryScreenProps {
  comida: string;
  bebida: string;
  onRestart: () => void;
  onNewMenu: () => void;
}

export default function VictoryScreen({
  comida,
  bebida,
  onRestart,
  onNewMenu,
}: VictoryScreenProps) {
  const { width, height } = useWindowSize();
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Determine sound based on Easter Egg condition
    const lowerComida = comida.toLowerCase();
    const lowerBebida = bebida.toLowerCase();

    const isSad =
      lowerComida.includes("ensalada") ||
      lowerComida.includes("agua") ||
      lowerComida.includes("nada") ||
      lowerBebida.includes("ensalada") ||
      lowerBebida.includes("agua") ||
      lowerBebida.includes("nada");

    const audio = new Audio(
      isSad ? "/audio/womp_womp.mp3" : "/audio/ta_da.mp3",
    );
    audio
      .play()
      .catch((e) =>
        console.log("Audio error (may need interaction prior):", e),
      );

    // Slight delay for pop-in animation effect
    const timer = setTimeout(() => setShow(true), 50);
    return () => clearTimeout(timer);
  }, [comida, bebida]);

  return (
    <div className="absolute inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-md overflow-hidden p-4">
      <Confetti
        width={width}
        height={height}
        recycle={false}
        numberOfPieces={800}
        gravity={0.15}
      />

      <div
        className={`transform transition-all duration-700 ease-out ${show ? "scale-100 opacity-100 rotate-0" : "scale-50 opacity-0 -rotate-12"} bg-white border-8 border-black rounded-3xl p-8 md:p-12 max-w-2xl w-full text-center shadow-[16px_16px_0_#000] relative`}
      >
        <h2 className="text-5xl md:text-7xl font-black text-red-600 uppercase italic mb-10 [text-shadow:4px_4px_0_#000] leading-tight">
          ¡El Destino ha Hablado!
        </h2>

        <div className="space-y-8 mb-12">
          <div className="bg-red-200 p-8 rounded-2xl border-8 border-black shadow-[8px_8px_0_#000] transform -rotate-1">
            <p className="text-xl font-black text-red-900 uppercase tracking-widest mb-2 bg-white inline-block px-4 py-1 border-4 border-black shadow-[4px_4px_0_#000]">
              Comerás
            </p>
            <p className="text-4xl md:text-5xl font-black text-black uppercase mt-4 [text-shadow:2px_2px_0_#FFF]">
              {comida}
            </p>
          </div>

          <div className="bg-blue-200 p-8 rounded-2xl border-8 border-black shadow-[8px_8px_0_#000] transform rotate-1">
            <p className="text-xl font-black text-blue-900 uppercase tracking-widest mb-2 bg-white inline-block px-4 py-1 border-4 border-black shadow-[4px_4px_0_#000]">
              Acompañado de
            </p>
            <p className="text-4xl md:text-5xl font-black text-black uppercase mt-4 [text-shadow:2px_2px_0_#FFF]">
              {bebida}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <button
            onClick={onRestart}
            className="bg-yellow-400 text-black border-4 border-black hover:bg-yellow-300 hover:-translate-y-1 active:translate-y-2 active:shadow-none px-8 py-4 rounded-full font-black text-2xl uppercase transition-all shadow-[6px_6px_0_#000]"
          >
            Girar Otra Vez 🎡
          </button>
          <button
            onClick={onNewMenu}
            className="bg-red-600 text-white border-4 border-black hover:bg-red-500 hover:-translate-y-1 active:translate-y-2 active:shadow-none px-8 py-4 rounded-full font-black text-2xl uppercase transition-all shadow-[6px_6px_0_#000]"
          >
            Nuevo Menú 📸
          </button>
        </div>
      </div>
    </div>
  );
}
