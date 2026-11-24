/**
 * Cloudinary Delivery & Transformation Utilities
 */

export interface ImageTransformOptions {
  width?: number;
  height?: number;
  crop?: 'limit' | 'fill' | 'scale' | 'thumb' | 'fit';
  quality?: 'auto' | 'auto:best' | 'auto:good' | 'auto:eco' | 'auto:low' | number;
  format?: 'auto' | 'webp' | 'jpg' | 'png' | 'avif';
  blur?: number;
  dpr?: number | 'auto';
}

/**
 * Checks if a given URL is a Cloudinary-hosted asset
 */
export function isCloudinaryUrl(url?: string): boolean {
  if (!url || typeof url !== 'string') return false;
  return url.includes('res.cloudinary.com') || url.includes('/image/upload/') || url.includes('/video/upload/');
}

/**
 * Generates an optimized Cloudinary image URL with requested transformations
 * If the URL is not a Cloudinary URL, it returns the original URL unaltered.
 */
export function getTransformedImageUrl(url?: string, options: ImageTransformOptions = {}): string {
  if (!url || typeof url !== 'string') return '';
  if (!isCloudinaryUrl(url)) return url;

  const {
    width,
    height,
    crop = 'limit',
    quality = 'auto',
    format = 'auto',
    blur,
    dpr
  } = options;

  const transformations: string[] = [];

  if (quality) transformations.push(`q_${quality}`);
  if (format) transformations.push(`f_${format}`);
  if (crop) transformations.push(`c_${crop}`);
  if (width) transformations.push(`w_${Math.round(width)}`);
  if (height) transformations.push(`h_${Math.round(height)}`);
  if (blur && blur > 0) transformations.push(`e_blur:${Math.min(2000, Math.round(blur * 100))}`);
  if (dpr) transformations.push(`dpr_${dpr}`);

  if (transformations.length === 0) return url;

  const transformString = transformations.join(',');

  // Replace '/upload/' with '/upload/${transformString}/'
  // Handle case where transformations might already exist
  const uploadIndex = url.indexOf('/upload/');
  if (uploadIndex === -1) return url;

  const prefix = url.substring(0, uploadIndex + 8); // includes '/upload/'
  const suffix = url.substring(uploadIndex + 8);

  // If already has transformation string before version or asset path, avoid duplicate if safe
  return `${prefix}${transformString}/${suffix}`;
}

/**
 * Generates an optimized thumbnail URL for an asset
 */
export function getAssetThumbnailUrl(url?: string, size: number = 320): string {
  if (!url || typeof url !== 'string') return '';
  if (!isCloudinaryUrl(url)) return url;

  // If it's a video, generate a poster image thumbnail
  if (isVideoUrl(url)) {
    return getVideoPosterUrl(url, { width: size });
  }

  return getTransformedImageUrl(url, {
    width: size,
    crop: 'limit',
    quality: 'auto',
    format: 'auto'
  });
}

/**
 * Checks if a URL points to a video
 */
export function isVideoUrl(url?: string): boolean {
  if (!url || typeof url !== 'string') return false;
  const cleanUrl = url.split('?')[0].toLowerCase();
  return (
    cleanUrl.endsWith('.mp4') ||
    cleanUrl.endsWith('.webm') ||
    cleanUrl.endsWith('.mov') ||
    url.includes('/video/upload/')
  );
}

/**
 * Generates a poster image URL for Cloudinary videos
 */
export function getVideoPosterUrl(videoUrl?: string, options: { width?: number; second?: number } = {}): string {
  if (!videoUrl || typeof videoUrl !== 'string') return '';
  if (!isCloudinaryUrl(videoUrl)) return videoUrl;

  const width = options.width ? `w_${Math.round(options.width)},c_limit,` : '';
  const second = options.second !== undefined ? `so_${options.second},` : 'so_0,';
  const transform = `${width}${second}f_auto,q_auto`;

  // Change extension to .jpg and inject transformation
  let posterUrl = videoUrl.replace(/\.[^/.]+$/, '.jpg');
  const uploadIndex = posterUrl.indexOf('/upload/');
  if (uploadIndex !== -1) {
    const prefix = posterUrl.substring(0, uploadIndex + 8);
    const suffix = posterUrl.substring(uploadIndex + 8);
    posterUrl = `${prefix}${transform}/${suffix}`;
  }

  return posterUrl;
}
