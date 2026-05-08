import React from "react";

interface AuthWarningProps {
  show: boolean;
}

export default function AuthWarning({ show }: AuthWarningProps) {
  if (!show) return null;

  return (
    <div className="bg-yellow-300 text-black font-black p-5 sm:p-8 rounded-2xl border-4 border-black shadow-[6px_6px_0_#000] text-center max-w-2xl mx-4">
      <div className="text-2xl sm:text-4xl mb-2">🔐</div>
      <div className="text-base sm:text-xl uppercase mb-2">
        ¡Inicia sesión para empezar!
      </div>
      <div className="text-xs sm:text-sm">
        Necesitas autenticarte con Google para proteger la API de uso excesivo.
        <br />
        <span className="text-red-600 font-bold">
          Límite: 5 extracciones por día.
        </span>
      </div>
    </div>
  );
}
