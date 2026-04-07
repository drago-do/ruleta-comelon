interface ExtractionResult {
  comida: string[];
  bebidas: string[];
}

interface ExtractionResultsProps {
  result: ExtractionResult;
  onProceed: () => void;
}

export default function ExtractionResults({
  result,
  onProceed,
}: ExtractionResultsProps) {
  return (
    <div className="min-h-screen bg-yellow-400 p-8 flex flex-col items-center">
      <header className="mb-12 text-center mt-6">
        <h1 className="text-6xl md:text-8xl font-black text-red-600 [text-shadow:6px_6px_0_#000] uppercase italic mb-6 tracking-tighter transform rotate-2">
          Menú
          <br />
          Decodificado
        </h1>
        <div className="inline-block bg-white px-6 py-2 border-4 border-black shadow-[4px_4px_0_#000] transform -rotate-2">
          <p className="text-xl font-black text-red-900 uppercase">
            El destino tiene hambre...
          </p>
        </div>
      </header>

      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl p-8 border-8 border-black shadow-[12px_12px_0_#000] transform -rotate-1 hover:rotate-0 transition-transform">
          <h2 className="text-4xl font-black text-red-600 mb-6 border-b-8 border-black pb-4 flex items-center gap-2 uppercase [text-shadow:2px_2px_0_#000]">
            🍕 COMIDAS
          </h2>
          <ul className="space-y-4">
            {result.comida.map((item, idx) => (
              <li
                key={idx}
                className="text-xl font-black text-red-900 bg-red-200 p-4 rounded-xl border-4 border-black shadow-[4px_4px_0_#000]"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-3xl p-8 border-8 border-black shadow-[12px_12px_0_#000] transform rotate-1 hover:rotate-0 transition-transform">
          <h2 className="text-4xl font-black text-blue-600 mb-6 border-b-8 border-black pb-4 flex items-center gap-2 uppercase [text-shadow:2px_2px_0_#000]">
            🥤 BEBIDAS
          </h2>
          <ul className="space-y-4">
            {result.bebidas.map((item, idx) => (
              <li
                key={idx}
                className="text-xl font-black text-blue-900 bg-blue-200 p-4 rounded-xl border-4 border-black shadow-[4px_4px_0_#000]"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <button
        onClick={onProceed}
        className="mt-16 bg-red-600 hover:bg-red-500 text-white text-4xl font-black py-6 px-16 rounded-full border-4 border-black shadow-[10px_10px_0_#000] hover:-translate-y-2 hover:shadow-[14px_14px_0_#000] active:translate-y-2 active:shadow-none transition-all uppercase"
      >
        ¡A las Ruletas! 🎡
      </button>
    </div>
  );
}
