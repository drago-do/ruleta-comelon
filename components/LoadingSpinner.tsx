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
          <span className="text-9xl">🤤</span>
      </div>
      <h2 className="text-4xl font-black text-red-700 uppercase animate-pulse mb-4">
        {message}
      </h2>
      <div className="w-64 h-4 bg-red-900/20 rounded-full overflow-hidden relative">
        <div className="h-full bg-red-600 absolute inset-0 animate-loading-bar"></div>
      </div>
    </div>
  );
}
