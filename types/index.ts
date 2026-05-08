export interface ExtractionResult {
  comida: string[];
  bebidas: string[];
  meta?: {
    remaining: number;
    resetAt: string;
  };
}
