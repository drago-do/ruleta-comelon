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
        className={`transform transition-all duration-700 ease-out ${show ? "scale-100 opacity-100 rotate-0" : "scale-50 opacity-0 -rotate-12"} bg-white border-8 border-yellow-400 rounded-3xl p-6 md:p-10 max-w-2xl w-full text-center shadow-[0_0_100px_rgba(250,204,21,0.5)]`}
      >
        <h2 className="text-4xl md:text-6xl font-black text-red-600 uppercase italic mb-8 drop-shadow-md">
          ¡El Destino ha Hablado!
        </h2>

        <div className="space-y-6 mb-10">
          <div className="bg-red-50 p-6 rounded-2xl border-4 border-red-200 shadow-inner">
            <p className="text-lg font-bold text-red-800 uppercase tracking-widest mb-1">
              Comerás
            </p>
            <p className="text-3xl md:text-4xl font-black text-red-600">
              {comida}
            </p>
          </div>

          <div className="bg-blue-50 p-6 rounded-2xl border-4 border-blue-200 shadow-inner">
            <p className="text-lg font-bold text-blue-800 uppercase tracking-widest mb-1">
              Acompañado de
            </p>
            <p className="text-3xl md:text-4xl font-black text-blue-600">
              {bebida}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onRestart}
            className="bg-yellow-400 text-red-900 border-4 border-yellow-500 hover:bg-yellow-300 active:translate-y-1 px-8 py-4 rounded-full font-black text-xl uppercase transition-all shadow-lg"
          >
            Girar Otra Vez 🎡
          </button>
          <button
            onClick={onNewMenu}
            className="bg-red-600 text-white border-4 border-red-800 hover:bg-red-500 active:translate-y-1 px-8 py-4 rounded-full font-black text-xl uppercase transition-all shadow-lg"
          >
            Nuevo Menú 📸
          </button>
        </div>
      </div>
    </div>
  );
}
