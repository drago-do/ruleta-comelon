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

export default function MenuImagePreview({
  images,
  onRemoveImage,
  onProcessOptions,
}: MenuImagePreviewProps) {
  if (images.length === 0) return null;

  return (
    <div className="w-full bg-white rounded-3xl p-4 sm:p-8 border-4 sm:border-8 border-black shadow-[6px_6px_0_#000] sm:shadow-[8px_8px_0_#000]">
      <h2 className="text-xl sm:text-3xl font-black text-red-600 mb-4 sm:mb-6 uppercase [text-shadow:1px_1px_0_#000] sm:[text-shadow:2px_2px_0_#000]">
        Las fotos del menú:
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {images.map((img) => (
          <div key={img.id} className="relative group aspect-square">
            <div className="w-full h-full overflow-hidden border-2 sm:border-4 border-black shadow-[3px_3px_0_#000] sm:shadow-[4px_4px_0_#000] transform group-hover:-translate-y-2 group-hover:shadow-[6px_6px_0_#000] sm:group-hover:shadow-[8px_8px_0_#000] transition-all">
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
              className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 bg-red-600 text-white w-8 h-8 sm:w-10 sm:h-10 rounded-full text-xs sm:text-base font-black border-2 sm:border-4 border-black shadow-[2px_2px_0_#000] sm:shadow-[4px_4px_0_#000] hover:bg-red-500 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center z-10"
            >
              X
            </button>
          </div>
        ))}
      </div>
      <div className="mt-8 sm:mt-12 flex justify-center">
        <button
          onClick={onProcessOptions}
          className="cursor-pointer w-full sm:w-auto bg-green-500 hover:bg-green-400 text-white text-xl sm:text-2xl md:text-3xl font-black py-4 px-6 sm:px-12 rounded-full border-4 border-black shadow-[4px_4px_0_#000] sm:shadow-[6px_6px_0_#000] hover:-translate-y-1 hover:shadow-[8px_8px_0_#000] active:translate-y-2 active:shadow-none transition-all uppercase"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
