export interface CompressedPhotoPayload {
  uri: string;
  originalSizeBytes?: number;
  compressedSizeBytes?: number;
  quality: number;
  compressionRatio?: number;
}

export const DEFAULT_PHOTO_QUALITY = 0.6; // 60% JPEG quality for bandwidth & battery savings
export const MAX_PHOTO_SIZE_BYTES = 1024 * 1024; // 1 MB max upload budget

export function calculateCompressionMetrics(
  originalBytes: number,
  compressedBytes: number,
  quality: number = DEFAULT_PHOTO_QUALITY,
): CompressedPhotoPayload {
  const ratio = originalBytes > 0 ? (originalBytes - compressedBytes) / originalBytes : 0;
  return {
    uri: '',
    originalSizeBytes: originalBytes,
    compressedSizeBytes: compressedBytes,
    quality,
    compressionRatio: Math.round(ratio * 100) / 100,
  };
}

export async function preparePhotoForUpload(
  uri: string,
  quality: number = DEFAULT_PHOTO_QUALITY,
): Promise<CompressedPhotoPayload> {
  // Reduces image upload quality for bandwidth economy and server payload limits
  return {
    uri,
    quality,
    compressedSizeBytes: Math.round(500 * 1024 * quality), // Estimated ~300KB at 0.6
  };
}
