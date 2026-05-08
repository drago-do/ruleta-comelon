import React from "react";

export default function HeroHeader() {
  return (
    <header className="mb-6 sm:mb-12 mt-20 text-center sm:mt-8">
      <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-red-600 [text-shadow:3px_3px_0_#000] sm:[text-shadow:6px_6px_0_#000] uppercase italic tracking-tighter mb-4 sm:mb-8 transform -rotate-2 leading-[0.85] sm:leading-none">
        No sabes
        <br />
        qué comer?
      </h1>
      <div className="inline-block bg-white px-4 sm:px-8 py-2 sm:py-3 border-2 sm:border-4 border-black shadow-[3px_3px_0_#000] sm:shadow-[6px_6px_0_#000] transform rotate-2">
        <p className="text-base sm:text-2xl font-black text-red-800 uppercase tracking-widest">
          ¡Deja que el destino elija!
        </p>
      </div>
    </header>
  );
}
