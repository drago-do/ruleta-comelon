interface ExtractionResult {
  comida: string[];
  bebidas: string[];
}

interface ExtractionResultsProps {
  result: ExtractionResult;
  onProceed: () => void;
}

export default function ExtractionResults({ result, onProceed }: ExtractionResultsProps) {
  return (
    <div className="min-h-screen bg-yellow-400 p-8 flex flex-col items-center">
      <header className="mb-12 text-center">
        <h1 className="text-6xl font-black text-red-600 uppercase italic mb-2 tracking-tighter">
          Menú Decodificado
        </h1>
        <p className="text-xl font-bold text-red-800">El destino tiene hambre...</p>
      </header>
      
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl p-6 border-4 border-red-600 shadow-xl">
          <h2 className="text-3xl font-black text-red-600 mb-4 border-b-4 border-red-100 pb-2 flex items-center gap-2">
            🍕 COMIDAS
          </h2>
          <ul className="space-y-2">
            {result.comida.map((item, idx) => (
              <li key={idx} className="text-xl font-bold text-red-900 bg-red-50 p-3 rounded-xl border-2 border-red-100">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-3xl p-6 border-4 border-blue-600 shadow-xl">
          <h2 className="text-3xl font-black text-blue-600 mb-4 border-b-4 border-blue-100 pb-2 flex items-center gap-2">
            🥤 BEBIDAS
          </h2>
          <ul className="space-y-2">
            {result.bebidas.map((item, idx) => (
              <li key={idx} className="text-xl font-bold text-blue-900 bg-blue-50 p-3 rounded-xl border-2 border-blue-100">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <button 
        onClick={onProceed}
        className="mt-12 bg-red-600 text-white text-3xl font-black py-6 px-12 rounded-full border-b-8 border-red-900 shadow-2xl hover:scale-105 active:translate-y-1 transition-all uppercase"
      >
        ¡A las Ruletas! 🎡
      </button>
    </div>
  );
}
