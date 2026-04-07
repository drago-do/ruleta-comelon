export const LOADING_MESSAGES = [
  "Leyendo los jeroglíficos del chef...",
  "Traduciendo manchas de grasa a comida...",
  "Sobornando al mesero para el menú secreto...",
  "Afilando los cubiertos virtuales...",
  "Oliendo los píxeles para identificar ingredientes..."
];

interface LoadingSpinnerProps {
  message: string;
}

export default function LoadingSpinner({ message }: LoadingSpinnerProps) {
  return (
    <div className="min-h-screen bg-yellow-400 flex flex-col items-center justify-center p-8 text-center">
      <div className="animate-bounce mb-8">
          <span className="text-9xl [filter:drop-shadow(6px_6px_0px_#000)]">🤤</span>
      </div>
      <h2 className="text-4xl font-black text-white [text-shadow:4px_4px_0_#000] uppercase animate-pulse mb-8 max-w-2xl leading-tight">
        {message}
      </h2>
      <div className="w-80 h-8 bg-white border-4 border-black rounded-full overflow-hidden relative shadow-[8px_8px_0_#000]">
        <div className="h-full bg-red-500 absolute inset-0 animate-loading-bar border-r-4 border-black"></div>
      </div>
    </div>
  );
}
