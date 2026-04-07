import Image from "next/image";

export interface MenuImage {
  id: string;
  url: string;
  file: File;
}

interface MenuImagePreviewProps {
  images: MenuImage[];
  onRemoveImage: (id: string) => void;
  onProcessOptions: () => void;
}

export default function MenuImagePreview({ images, onRemoveImage, onProcessOptions }: MenuImagePreviewProps) {
  if (images.length === 0) return null;

  return (
    <div className="w-full bg-white rounded-3xl p-8 border-8 border-black shadow-[8px_8px_0_#000]">
      <h2 className="text-3xl font-black text-red-600 mb-6 uppercase [text-shadow:2px_2px_0_#000]">Tu Menú Visual:</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((img) => (
          <div key={img.id} className="relative group aspect-square">
            <div className="w-full h-full rounded-2xl overflow-hidden border-4 border-black shadow-[4px_4px_0_#000] transform group-hover:-translate-y-2 group-hover:shadow-[8px_8px_0_#000] transition-all">
              <Image
                src={img.url}
                alt="Thumbnail del menú"
                fill
                unoptimized
                className="object-cover"
              />
            </div>
            <button
              onClick={() => onRemoveImage(img.id)}
              className="absolute -top-4 -right-4 bg-red-600 text-white w-10 h-10 rounded-full font-black border-4 border-black shadow-[4px_4px_0_#000] hover:bg-red-500 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center z-10"
            >
              X
            </button>
          </div>
        ))}
      </div>
      <div className="mt-12 flex justify-center">
          <button 
            onClick={onProcessOptions}
            className="bg-green-500 hover:bg-green-400 text-white text-3xl font-black py-4 px-12 rounded-full border-4 border-black shadow-[6px_6px_0_#000] hover:-translate-y-1 hover:shadow-[8px_8px_0_#000] active:translate-y-2 active:shadow-none transition-all uppercase"
          >
              ¡Listo para Procesar! 🍕
          </button>
      </div>
    </div>
  );
}
