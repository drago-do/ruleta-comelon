import sharp from 'sharp';
import { IMAGE_CONSTRAINTS } from './config';

export interface ProcessedImage {
  buffer: Buffer;
  mimeType: string;
  originalSize: number;
  compressedSize: number;
  wasCompressed: boolean;
}

/**
 * Procesa y comprime una imagen si es necesario
 * @param file - Archivo de imagen a procesar
 * @returns Promise con la imagen procesada
 */
export async function processImage(file: File): Promise<ProcessedImage> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const originalSize = buffer.length;

  // Si la imagen es menor al threshold, retornarla sin comprimir
  if (originalSize <= IMAGE_CONSTRAINTS.COMPRESS_THRESHOLD) {
    return {
      buffer,
      mimeType: file.type,
      originalSize,
      compressedSize: originalSize,
      wasCompressed: false,
    };
  }

  try {
    // Obtener metadata de la imagen
    const image = sharp(buffer);
    const metadata = await image.metadata();

    // Calcular nuevas dimensiones si exceden el máximo
    let width = metadata.width;
    let height = metadata.height;

    if (width && height) {
      if (width > IMAGE_CONSTRAINTS.MAX_DIMENSION || height > IMAGE_CONSTRAINTS.MAX_DIMENSION) {
        const ratio = Math.min(
          IMAGE_CONSTRAINTS.MAX_DIMENSION / width,
          IMAGE_CONSTRAINTS.MAX_DIMENSION / height
        );
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
    }

    // Comprimir la imagen
    const compressedBuffer = await image
      .resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({
        quality: IMAGE_CONSTRAINTS.COMPRESS_QUALITY,
        progressive: true,
        mozjpeg: true,
      })
      .toBuffer();

    return {
      buffer: compressedBuffer,
      mimeType: 'image/jpeg',
      originalSize,
      compressedSize: compressedBuffer.length,
      wasCompressed: true,
    };
  } catch (error) {
    console.error('Error compressing image:', error);
    throw new Error('COMPRESSION_FAILED');
  }
}

/**
 * Convierte un buffer a base64 data URL
 */
export function bufferToDataUrl(buffer: Buffer, mimeType: string): string {
  const base64 = buffer.toString('base64');
  return `data:${mimeType};base64,${base64}`;
}

/**
 * Valida el tipo MIME de una imagen
 */
export function isValidImageType(mimeType: string): boolean {
  return IMAGE_CONSTRAINTS.ALLOWED_TYPES.includes(mimeType);
}

/**
 * Valida el tamaño de una imagen
 */
export function isValidImageSize(size: number): boolean {
  return size <= IMAGE_CONSTRAINTS.MAX_FILE_SIZE;
}
