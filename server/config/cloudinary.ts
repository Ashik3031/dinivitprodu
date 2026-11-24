import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const cloudName = process.env.CLOUDINARY_CLOUD_NAME || '';
const apiKey = process.env.CLOUDINARY_API_KEY || '';
const apiSecret = process.env.CLOUDINARY_API_SECRET || '';

const isConfigured = Boolean(
  cloudName &&
  apiKey &&
  apiSecret &&
  cloudName !== 'your_cloud_name' &&
  apiKey !== 'your_api_key' &&
  apiSecret !== 'your_api_secret'
);

if (isConfigured) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true
  });
}

export function isCloudinaryConfigured(): boolean {
  return isConfigured;
}

export function getCloudinaryPublicConfig(): { cloudName: string; apiKey: string; isConfigured: boolean } {
  return {
    cloudName: isConfigured ? cloudName : '',
    apiKey: isConfigured ? apiKey : '',
    isConfigured
  };
}

export function slugifyCategory(category?: string): string {
  if (!category) return 'general';
  return category
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'general';
}

export function getAssetFolder(isPublicOrAdmin: boolean, userId: string = 'general', category?: string): string {
  const cleanCat = slugifyCategory(category);
  if (isPublicOrAdmin) {
    return `invitation-studio/admin/${cleanCat}`;
  }
  const cleanUser = userId.replace(/[^a-zA-Z0-9_-]/g, '_') || 'user';
  return `invitation-studio/users/${cleanUser}/${cleanCat}`;
}

export interface SignatureResponse {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  folder: string;
  resourceType: 'image' | 'video' | 'raw' | 'auto';
}

export function generateUploadSignature(options: {
  folder: string;
  resourceType?: 'image' | 'video' | 'raw' | 'auto';
}): SignatureResponse {
  if (!isConfigured) {
    throw new Error('Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.');
  }

  const timestamp = Math.round(Date.now() / 1000);
  const resourceType = options.resourceType || 'auto';
  const folder = options.folder;

  const paramsToSign: Record<string, any> = {
    folder,
    timestamp
  };

  const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret);

  return {
    signature,
    timestamp,
    apiKey,
    cloudName,
    folder,
    resourceType
  };
}

export async function deleteCloudinaryAsset(publicId: string, resourceType: string = 'image'): Promise<{ result: string }> {
  if (!isConfigured) {
    console.warn(`[Cloudinary] Cannot delete ${publicId}: Cloudinary is not configured.`);
    return { result: 'skipped_not_configured' };
  }

  try {
    // Cloudinary uploader.destroy accepts resource_type ('image', 'video', 'raw')
    // Videos and audio files are under 'video'
    let normResourceType = resourceType;
    if (normResourceType === 'audio') {
      normResourceType = 'video';
    } else if (!['image', 'video', 'raw'].includes(normResourceType)) {
      normResourceType = 'image';
    }

    const res = await cloudinary.uploader.destroy(publicId, {
      resource_type: normResourceType,
      invalidate: true
    });
    return res;
  } catch (error: any) {
    console.error(`[Cloudinary] Error deleting asset ${publicId}:`, error);
    throw error;
  }
}

export { cloudinary };
