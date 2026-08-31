/**
 * Client-Side Media Optimizer & Thumbnail Generator
 * Handles Image Optimization, WebP/JPEG Compression, Video Frame Grab, and Audio Duration extraction
 */

export interface OptimizedImageResult {
  url: string;
  thumbnailUrl: string;
  dimensions: { width: number; height: number };
  size: number;
  format: string;
  name: string;
}

export interface ProcessedVideoResult {
  url: string;
  thumbnailUrl: string;
  dimensions: { width: number; height: number };
  duration: number;
  size: number;
  format: string;
  name: string;
}

export interface ProcessedAudioResult {
  url: string;
  duration: number;
  size: number;
  format: string;
  name: string;
}

/**
 * Optimize an image file: downscale high-res images to web-optimal 1600px max bounds,
 * compress to WebP/JPEG, and generate an instantaneous 240x240 square thumbnail.
 */
export async function optimizeImage(
  file: File,
  maxDimension = 1600,
  quality = 0.85
): Promise<OptimizedImageResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const originalWidth = img.width;
        const originalHeight = img.height;

        // 1. Calculate scaled down dimensions for main optimized image
        let targetWidth = originalWidth;
        let targetHeight = originalHeight;

        if (originalWidth > maxDimension || originalHeight > maxDimension) {
          if (originalWidth > originalHeight) {
            targetWidth = maxDimension;
            targetHeight = Math.round((originalHeight * maxDimension) / originalWidth);
          } else {
            targetHeight = maxDimension;
            targetWidth = Math.round((originalWidth * maxDimension) / originalHeight);
          }
        }

        // 2. Render Main Image to Canvas
        const mainCanvas = document.createElement('canvas');
        mainCanvas.width = targetWidth;
        mainCanvas.height = targetHeight;
        const mainCtx = mainCanvas.getContext('2d');

        if (!mainCtx) {
          return reject(new Error('Failed to get 2D canvas context'));
        }

        mainCtx.imageSmoothingEnabled = true;
        mainCtx.imageSmoothingQuality = 'high';
        mainCtx.drawImage(img, 0, 0, targetWidth, targetHeight);

        // Prefer image/webp if supported, fallback to image/jpeg or keep png if transparent
        const isPng = file.type.includes('png');
        const outputMime = isPng ? 'image/png' : 'image/webp';
        let optimizedDataUrl: string;
        try {
          optimizedDataUrl = mainCanvas.toDataURL(outputMime, quality);
        } catch {
          optimizedDataUrl = mainCanvas.toDataURL('image/jpeg', quality);
        }

        // 3. Generate Square 240x240 Thumbnail
        const thumbCanvas = document.createElement('canvas');
        const thumbSize = 240;
        thumbCanvas.width = thumbSize;
        thumbCanvas.height = thumbSize;
        const thumbCtx = thumbCanvas.getContext('2d');

        if (thumbCtx) {
          thumbCtx.imageSmoothingEnabled = true;
          thumbCtx.imageSmoothingQuality = 'medium';

          // Center-crop image into square
          const minDim = Math.min(originalWidth, originalHeight);
          const srcX = (originalWidth - minDim) / 2;
          const srcY = (originalHeight - minDim) / 2;

          thumbCtx.drawImage(
            img,
            srcX,
            srcY,
            minDim,
            minDim,
            0,
            0,
            thumbSize,
            thumbSize
          );
        }

        const thumbnailUrl = thumbCtx ? thumbCanvas.toDataURL('image/webp', 0.8) : optimizedDataUrl;

        // Estimate byte size from base64
        const estimatedSize = Math.round((optimizedDataUrl.length * 3) / 4);

        const format = file.name.split('.').pop()?.toLowerCase() || (isPng ? 'png' : 'webp');

        resolve({
          url: optimizedDataUrl,
          thumbnailUrl,
          dimensions: { width: targetWidth, height: targetHeight },
          size: estimatedSize,
          format,
          name: file.name
        });
      };

      img.onerror = () => reject(new Error('Failed to parse and decode image'));
      img.src = event.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Process a Video file (MP4, WebM): generate a poster frame thumbnail and extract duration/dimensions.
 */
export async function processVideo(file: File): Promise<ProcessedVideoResult> {
  return new Promise((resolve, reject) => {
    const videoUrl = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.src = videoUrl;
    video.muted = true;
    video.playsInline = true;

    video.onloadedmetadata = () => {
      // Seek to 1 second or 10% to capture representative thumbnail
      video.currentTime = Math.min(1.0, video.duration / 2);
    };

    video.onseeked = () => {
      const width = video.videoWidth || 640;
      const height = video.videoHeight || 360;

      const canvas = document.createElement('canvas');
      canvas.width = Math.min(width, 480);
      canvas.height = Math.round((height * canvas.width) / width);

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      }

      const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.85);
      const duration = Math.round(video.duration || 0);
      const format = file.name.split('.').pop()?.toLowerCase() || 'mp4';

      // Read as DataURL for persistence
      const reader = new FileReader();
      reader.onload = (e) => {
        URL.revokeObjectURL(videoUrl);
        resolve({
          url: e.target?.result as string,
          thumbnailUrl,
          dimensions: { width, height },
          duration,
          size: file.size,
          format,
          name: file.name
        });
      };
      reader.onerror = () => {
        URL.revokeObjectURL(videoUrl);
        reject(new Error('Failed to read video file content'));
      };
      reader.readAsDataURL(file);
    };

    video.onerror = () => {
      URL.revokeObjectURL(videoUrl);
      reject(new Error('Failed to load video metadata for preview'));
    };
  });
}

/**
 * Process an Audio file (MP3, WAV): extracts duration and creates audio asset
 */
export async function processAudio(file: File): Promise<ProcessedAudioResult> {
  return new Promise((resolve, reject) => {
    const audioUrl = URL.createObjectURL(file);
    const audio = new Audio(audioUrl);

    audio.onloadedmetadata = () => {
      const duration = Math.round(audio.duration || 0);
      const format = file.name.split('.').pop()?.toLowerCase() || 'mp3';

      const reader = new FileReader();
      reader.onload = (e) => {
        URL.revokeObjectURL(audioUrl);
        resolve({
          url: e.target?.result as string,
          duration,
          size: file.size,
          format,
          name: file.name
        });
      };
      reader.onerror = () => {
        URL.revokeObjectURL(audioUrl);
        reject(new Error('Failed to read audio file'));
      };
      reader.readAsDataURL(file);
    };

    audio.onerror = () => {
      URL.revokeObjectURL(audioUrl);
      // Fallback if metadata read fails
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve({
          url: e.target?.result as string,
          duration: 0,
          size: file.size,
          format: file.name.split('.').pop()?.toLowerCase() || 'mp3',
          name: file.name
        });
      };
      reader.readAsDataURL(file);
    };
  });
}

/**
 * Format bytes to readable string (e.g. 420 KB, 2.4 MB)
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Format seconds to MM:SS
 */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
