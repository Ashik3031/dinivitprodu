import { MediaAsset, MediaAssetType } from '../types';
import { api } from './api';
import { getAssetThumbnailUrl, getVideoPosterUrl } from '../utils/cloudinaryUtils';
import { optimizeImage, processVideo, processAudio } from '../utils/mediaOptimizer';

export interface UploadProgressCallback {
  (progress: {
    percentage: number;
    loadedBytes: number;
    totalBytes: number;
    statusText: string;
  }): void;
}

export interface UploadAssetOptions {
  title?: string;
  category?: string;
  tags?: string[] | string;
  isPublic?: boolean;
  businessId?: string;
  invitationId?: string;
  invitationIds?: string[];
  type?: MediaAssetType;
  onProgress?: UploadProgressCallback;
}

export interface CloudinaryDirectUploadResult {
  public_id: string;
  version: number;
  signature: string;
  width?: number;
  height?: number;
  format: string;
  resource_type: string;
  created_at: string;
  bytes: number;
  type: string;
  url: string;
  secure_url: string;
  duration?: number;
}

/**
 * Detect asset type, default category and format based on file MIME type and extension
 */
export function detectFileMetadata(file: File): {
  type: MediaAssetType;
  category: string;
  format: string;
  resourceType: 'image' | 'video' | 'raw' | 'auto';
  tags: string[];
} {
  const mime = (file.type || '').toLowerCase();
  const ext = (file.name.split('.').pop() || '').toLowerCase();

  // Audio files
  if (mime.startsWith('audio/') || ['mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac'].includes(ext)) {
    return {
      type: 'audio',
      category: 'Audio & Music',
      format: ext || 'mp3',
      resourceType: 'video', // Cloudinary handles audio under video endpoint
      tags: ['audio', 'music', ext]
    };
  }

  // Video files
  if (mime.startsWith('video/') || ['mp4', 'webm', 'mov', 'avi', 'mkv'].includes(ext)) {
    return {
      type: 'video',
      category: 'Stock Videos & Ambient Loops',
      format: ext || 'mp4',
      resourceType: 'video',
      tags: ['video', 'ambient', ext]
    };
  }

  // GIF files
  if (mime === 'image/gif' || ext === 'gif') {
    return {
      type: 'gif',
      category: 'Animated GIFs & Sparkles',
      format: 'gif',
      resourceType: 'image',
      tags: ['gif', 'animation', 'sparkle']
    };
  }

  // Vector graphics / SVG
  if (mime.includes('svg') || ext === 'svg') {
    return {
      type: 'image',
      category: 'Vector Graphics',
      format: 'svg',
      resourceType: 'image',
      tags: ['vector', 'svg', 'graphic']
    };
  }

  // Standard Image files
  const detectedFormat = ['png', 'webp', 'jpeg', 'jpg'].includes(ext) ? (ext === 'jpeg' ? 'jpg' : ext) : 'png';
  return {
    type: 'image',
    category: 'Photos & Graphics',
    format: detectedFormat,
    resourceType: 'image',
    tags: ['photo', 'graphic', detectedFormat]
  };
}

/**
 * Upload binary file directly to Cloudinary using signed parameters with progress tracking
 */
export async function uploadDirectToCloudinary(
  file: File,
  signatureData: {
    signature: string;
    timestamp: number;
    apiKey: string;
    cloudName: string;
    folder: string;
    resourceType?: 'image' | 'video' | 'raw' | 'auto';
  },
  onProgress?: UploadProgressCallback
): Promise<CloudinaryDirectUploadResult> {
  const resourceType = signatureData.resourceType || 'auto';
  const uploadUrl = `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/${resourceType}/upload`;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', signatureData.apiKey);
  formData.append('timestamp', String(signatureData.timestamp));
  formData.append('signature', signatureData.signature);
  formData.append('folder', signatureData.folder);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', uploadUrl, true);

    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentage = Math.round((event.loaded / event.total) * 100);
          onProgress({
            percentage,
            loadedBytes: event.loaded,
            totalBytes: event.total,
            statusText: `Uploading to Cloudinary: ${percentage}%`
          });
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const res = JSON.parse(xhr.responseText);
          resolve(res);
        } catch (e: any) {
          reject(new Error(`Failed to parse Cloudinary response: ${e.message}`));
        }
      } else {
        try {
          const errData = JSON.parse(xhr.responseText);
          reject(new Error(errData.error?.message || `Cloudinary upload error (${xhr.status}): ${xhr.statusText}`));
        } catch {
          reject(new Error(`Cloudinary upload failed with status ${xhr.status}: ${xhr.statusText}`));
        }
      }
    };

    xhr.onerror = () => {
      reject(new Error('Network error during direct Cloudinary upload'));
    };

    xhr.send(formData);
  });
}

/**
 * Primary high-level media asset upload method:
 * 1. Obtains upload signature from backend
 * 2. Uploads binary directly to Cloudinary
 * 3. Saves asset metadata into backend database
 * (Falls back cleanly to local processing if Cloudinary is not configured)
 */
export async function uploadMediaAsset(
  file: File,
  options: UploadAssetOptions = {}
): Promise<MediaAsset> {
  const detected = detectFileMetadata(file);
  const assetType = options.type || detected.type;
  const category = options.category || detected.category;
  const title = options.title || file.name.replace(/\.[^/.]+$/, '');
  const tags = options.tags
    ? (Array.isArray(options.tags) ? options.tags : options.tags.split(',').map(t => t.trim()).filter(Boolean))
    : detected.tags;

  options.onProgress?.({
    percentage: 5,
    loadedBytes: 0,
    totalBytes: file.size,
    statusText: 'Requesting upload signature...'
  });

  let signatureData: any = null;
  let useCloudinary = true;

  try {
    signatureData = await api.getMediaUploadSignature({
      category,
      resourceType: detected.resourceType,
      isPublic: options.isPublic,
      businessId: options.businessId
    });
  } catch (err: any) {
    console.warn('[MediaUploadService] Cloudinary signature not available:', err.message);
    useCloudinary = false;
  }

  // 1. Primary path: Direct Cloudinary Upload
  if (useCloudinary && signatureData?.signature && signatureData?.cloudName) {
    options.onProgress?.({
      percentage: 10,
      loadedBytes: 0,
      totalBytes: file.size,
      statusText: `Uploading directly to Cloudinary (${file.name})...`
    });

    const cloudRes = await uploadDirectToCloudinary(
      file,
      {
        signature: signatureData.signature,
        timestamp: signatureData.timestamp,
        apiKey: signatureData.apiKey,
        cloudName: signatureData.cloudName,
        folder: signatureData.folder,
        resourceType: signatureData.resourceType || detected.resourceType
      },
      options.onProgress
    );

    options.onProgress?.({
      percentage: 92,
      loadedBytes: file.size,
      totalBytes: file.size,
      statusText: 'Saving asset metadata in database...'
    });

    const finalUrl = cloudRes.secure_url || cloudRes.url;
    let thumbnailUrl = finalUrl;

    if (cloudRes.resource_type === 'video' || assetType === 'video') {
      thumbnailUrl = getVideoPosterUrl(finalUrl, { width: 400 });
    } else if (assetType !== 'audio') {
      thumbnailUrl = getAssetThumbnailUrl(finalUrl, 400);
    }

    const savedAsset = await api.uploadMedia({
      businessId: options.isPublic ? 'admin' : (options.businessId || 'usr-biz-royal'),
      invitationId: options.invitationId,
      invitationIds: options.invitationIds || (options.invitationId ? [options.invitationId] : []),
      title,
      name: file.name,
      url: finalUrl,
      thumbnailUrl,
      type: assetType,
      format: cloudRes.format || detected.format,
      size: cloudRes.bytes || file.size,
      dimensions: cloudRes.width && cloudRes.height ? { width: cloudRes.width, height: cloudRes.height } : undefined,
      duration: cloudRes.duration,
      category,
      tags,
      isPublic: options.isPublic,
      isSuperAdmin: options.isPublic,
      publicId: cloudRes.public_id,
      resourceType: cloudRes.resource_type || detected.resourceType,
      mimeType: file.type
    });

    options.onProgress?.({
      percentage: 100,
      loadedBytes: file.size,
      totalBytes: file.size,
      statusText: 'Upload complete!'
    });

    return savedAsset.media;
  }

  // 2. Fallback path: Local optimization + Base64 upload (for offline / unconfigured dev)
  options.onProgress?.({
    percentage: 20,
    loadedBytes: 0,
    totalBytes: file.size,
    statusText: 'Cloudinary not configured: processing locally...'
  });

  if (assetType === 'video') {
    const proc = await processVideo(file);
    const saved = await api.uploadMedia({
      businessId: options.isPublic ? 'admin' : (options.businessId || 'usr-biz-royal'),
      invitationId: options.invitationId,
      invitationIds: options.invitationIds || (options.invitationId ? [options.invitationId] : []),
      title,
      name: file.name,
      url: proc.url,
      thumbnailUrl: proc.thumbnailUrl,
      type: 'video',
      format: proc.format,
      size: proc.size,
      dimensions: proc.dimensions,
      duration: proc.duration,
      category,
      tags,
      isPublic: options.isPublic
    });
    return saved.media;
  } else if (assetType === 'audio') {
    const proc = await processAudio(file);
    const saved = await api.uploadMedia({
      businessId: options.isPublic ? 'admin' : (options.businessId || 'usr-biz-royal'),
      invitationId: options.invitationId,
      invitationIds: options.invitationIds || (options.invitationId ? [options.invitationId] : []),
      title,
      name: file.name,
      url: proc.url,
      type: 'audio',
      format: proc.format,
      size: proc.size,
      duration: proc.duration,
      category,
      tags,
      isPublic: options.isPublic
    });
    return saved.media;
  } else {
    const opt = await optimizeImage(file, 1600, 0.85);
    const saved = await api.uploadMedia({
      businessId: options.isPublic ? 'admin' : (options.businessId || 'usr-biz-royal'),
      invitationId: options.invitationId,
      invitationIds: options.invitationIds || (options.invitationId ? [options.invitationId] : []),
      title,
      name: file.name,
      url: opt.url,
      thumbnailUrl: opt.thumbnailUrl,
      type: assetType,
      format: opt.format,
      size: opt.size,
      dimensions: opt.dimensions,
      category,
      tags,
      isPublic: options.isPublic
    });
    return saved.media;
  }
}

/**
 * Delete asset from Cloudinary and Database
 */
export async function deleteMediaAsset(assetId: string): Promise<boolean> {
  const res = await api.deleteMedia(assetId);
  return res.success;
}
