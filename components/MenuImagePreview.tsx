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
    <div className="w-full bg-white/50 rounded-3xl p-8 border-4 border-dashed border-red-400">
      <h2 className="text-2xl font-black text-red-700 mb-6 uppercase">Tu Menú Visual:</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((img) => (
          <div key={img.id} className="relative group aspect-square">
            <div className="w-full h-full rounded-2xl overflow-hidden border-4 border-white shadow-lg transform group-hover:rotate-2 transition-transform">
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
              className="absolute -top-3 -right-3 bg-red-600 text-white w-8 h-8 rounded-full font-bold shadow-md hover:bg-red-800 transition-colors z-10"
            >
              X
            </button>
          </div>
        ))}
      </div>
      <div className="mt-12 flex justify-center">
          <button 
            onClick={onProcessOptions}
            className="bg-green-500 hover:bg-green-600 text-white text-2xl font-black py-4 px-12 rounded-2xl border-b-4 border-green-800 transition-all uppercase"
          >
              ¡Listo para Procesar! 🍕
          </button>
      </div>
    </div>
  );
}
