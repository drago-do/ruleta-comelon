import Image from "next/image";
import { useState, useEffect } from "react";

export const LOADING_MESSAGES = [
  "Leyendo los jeroglíficos del chef...",
  "Traduciendo manchas de grasa a comida...",
  "Sobornando al mesero para el menú secreto...",
  "Afilando los cubiertos virtuales...",
  "Oliendo los píxeles para identificar ingredientes...",
  "Consultando con el oráculo de la michelada...",
  "Averiguando si el chef está de buenas hoy...",
  "Calculando el coeficiente de sabor...",
  "Separando las calorías que no cuentan...",
  "Limpiando la lente de los rayos X culinarios...",
  "Buscando 'el de siempre' en la base de datos...",
];

export default function LoadingSpinner() {
  const [message, setMessage] = useState(LOADING_MESSAGES[0]);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const rotateMessage = () => {
      setFade(false);
      setTimeout(() => {
        setMessage((prev) => {
          let next;
          do {
            next =
              LOADING_MESSAGES[
                Math.floor(Math.random() * LOADING_MESSAGES.length)
              ];
          } while (next === prev);
          return next;
        });
        setFade(true);
      }, 500);
    };

    const interval = setInterval(rotateMessage, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
      <div className="animate-[spin_3s_linear_infinite] mb-8 relative">
        <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full scale-150 animate-pulse"></div>
        <Image
          src="/images/spaghettiSpin.png"
          alt="Spaghetti"
          width={150}
          height={150}
          className="drop-shadow-[10px_10px_0_rgba(0,0,0,1)] z-10 w-24 h-24 sm:w-28 sm:h-28 object-contain transform hover:scale-110 transition-transform"
        />
      </div>

      <div className="inline-block bg-yellow-200 mb-24 px-4 sm:px-8 py-2 sm:py-3 border-4 border-black shadow-[4px_4px_0_#000] sm:shadow-[6px_6px_0_#000] transform rotate-2">
        <div
          className={`transition-all duration-1000 transform ${fade ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <h2 className="text-4xl sm:text-5xl font-black text-red-900 uppercase max-w-2xl tracking-tighter">
            {message}
          </h2>
        </div>
      </div>

      <div className="w-80 h-8 bg-white border-4 border-black rounded-full overflow-hidden relative shadow-[8px_8px_0_#000]">
        <div className="h-full bg-red-500 absolute inset-0 animate-loading-bar border-r-4 border-black"></div>
      </div>
    </div>
  );
}
