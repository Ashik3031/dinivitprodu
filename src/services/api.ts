import { User, Invitation, RSVPResponse, GuestbookMessage, InvitationTemplate, AdminStats, MediaAsset, PrebuiltBlock, BackgroundCollection } from '../types';

function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  try {
    const token = localStorage.getItem('dis_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const userStr = localStorage.getItem('dis_user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user?.id) {
        headers['x-user-id'] = user.id;
      }
      if (user?.token && !headers['Authorization']) {
        headers['Authorization'] = `Bearer ${user.token}`;
      }
    }
  } catch (e) {
    // ignore
  }
  return headers;
}

async function parseJsonResponse<T = any>(res: Response, defaultError = 'Request failed'): Promise<T> {
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    const text = await res.text();
    if (!res.ok) {
      throw new Error(`API Error (${res.status}): ${res.statusText || defaultError}`);
    }
    if (text.trim().startsWith('<') || text.includes('<!doctype') || text.includes('<html')) {
      throw new Error(`Server returned HTML instead of JSON. Ensure the server is running on the correct port.`);
    }
    try {
      return JSON.parse(text);
    } catch {
      throw new Error(`Invalid response format from server (${contentType || 'non-JSON'}).`);
    }
  }

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || data.message || defaultError);
  }
  return data;
}

// In-flight request deduplication map and short TTL response cache
const inFlightRequests = new Map<string, Promise<any>>();
const cacheStore = new Map<string, { timestamp: number; data: any }>();

export function invalidateApiCache(prefix?: string) {
  if (!prefix) {
    cacheStore.clear();
    return;
  }
  for (const key of cacheStore.keys()) {
    if (key.includes(prefix)) {
      cacheStore.delete(key);
    }
  }
}

async function fetchWithDeduplication<T>(
  url: string,
  options: RequestInit = {},
  cacheTtlMs: number = 3000
): Promise<T> {
  const method = (options.method || 'GET').toUpperCase();
  const cacheKey = `${method}:${url}`;

  // Serve from short TTL cache if valid (GET only)
  if (method === 'GET' && cacheTtlMs > 0) {
    const cached = cacheStore.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < cacheTtlMs) {
      return cached.data as T;
    }
  }

  // Deduplicate identical in-flight requests
  if (inFlightRequests.has(cacheKey)) {
    return inFlightRequests.get(cacheKey) as Promise<T>;
  }

  const reqPromise = (async () => {
    try {
      const res = await fetch(url, options);
      const data = await parseJsonResponse<T>(res);
      if (method === 'GET' && cacheTtlMs > 0) {
        cacheStore.set(cacheKey, { timestamp: Date.now(), data });
      }
      return data;
    } finally {
      inFlightRequests.delete(cacheKey);
    }
  })();

  inFlightRequests.set(cacheKey, reqPromise);
  return reqPromise;
}

export const api = {
  // Auth
  login: async (credentials: { username: string; password: string }) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const data = await parseJsonResponse(res, 'Login failed');
    if (data.token) {
      localStorage.setItem('dis_token', data.token);
    }
    return data;
  },

  getCurrentUser: async (): Promise<{ user: User }> => {
    const res = await fetch('/api/auth/me', {
      headers: getAuthHeaders()
    });
    return parseJsonResponse(res, 'Failed to fetch current user');
  },

  updateProfile: async (payload: { ownerName: string; email: string; phone?: string; businessName?: string }): Promise<{ user: User; message: string }> => {
    const res = await fetch('/api/auth/profile', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    return parseJsonResponse(res, 'Failed to update profile');
  },

  changePassword: async (payload: { currentPassword: string; newPassword: string }): Promise<{ message: string }> => {
    const res = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    return parseJsonResponse(res, 'Failed to change password');
  },

  updateBranding: async (payload: {
    businessName?: string;
    logoUrl?: string;
    brandColor?: string;
    secondaryColor?: string;
    defaultFontHeading?: string;
    defaultFontBody?: string;
    defaultFooterText?: string;
    defaultWatermark?: boolean;
    customDomain?: string;
  }): Promise<{ user: User; message: string }> => {
    const res = await fetch('/api/auth/branding', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    return parseJsonResponse(res, 'Failed to update branding settings');
  },

  // Admin User Management
  getUsers: async (): Promise<{ users: User[] }> => {
    const res = await fetch('/api/admin/users', {
      headers: getAuthHeaders()
    });
    return parseJsonResponse(res, 'Failed to fetch users');
  },
  getAdminUsers: async (): Promise<{ users: User[] }> => {
    return api.getUsers();
  },

  createUser: async (userData: any): Promise<{ user: User; message: string }> => {
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    return parseJsonResponse(res, 'Failed to create user');
  },
  createAdminUser: async (userData: any): Promise<{ user: User; message: string }> => {
    return api.createUser(userData);
  },

  updateUser: async (id: string, updates: any): Promise<{ user: User; message: string }> => {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    return parseJsonResponse(res, 'Failed to update user');
  },
  updateAdminUser: async (id: string, updates: any): Promise<{ user: User; message: string }> => {
    return api.updateUser(id, updates);
  },

  toggleUserStatus: async (id: string, isActive: boolean): Promise<{ user: User; message: string }> => {
    const res = await fetch(`/api/admin/users/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ isActive })
    });
    return parseJsonResponse(res, 'Failed to update user status');
  },

  resetUserPassword: async (id: string, newPassword: string): Promise<{ message: string }> => {
    const res = await fetch(`/api/admin/users/${id}/reset-password`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ newPassword })
    });
    return parseJsonResponse(res, 'Failed to reset password');
  },
  resetAdminUserPassword: async (id: string, newPassword: string): Promise<{ message: string }> => {
    return api.resetUserPassword(id, newPassword);
  },

  deleteUser: async (id: string): Promise<{ success: boolean }> => {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return parseJsonResponse(res, 'Failed to delete user');
  },
  deleteAdminUser: async (id: string): Promise<{ success: boolean }> => {
    return api.deleteUser(id);
  },

  getAdminStats: async (): Promise<AdminStats> => {
    const res = await fetch('/api/admin/stats', {
      headers: getAuthHeaders()
    });
    const data = await parseJsonResponse(res, 'Failed to fetch stats');
    return data.stats;
  },

  // Invitations
  getInvitations: async (businessId?: string, role?: string): Promise<{ invitations: Invitation[] }> => {
    const params = new URLSearchParams();
    if (businessId) params.append('businessId', businessId);
    if (role) params.append('role', role);
    const qs = params.toString();
    const url = `/api/invitations${qs ? `?${qs}` : ''}`;
    return fetchWithDeduplication<{ invitations: Invitation[] }>(url, {
      headers: getAuthHeaders()
    }, 2000);
  },

  getInvitation: async (id: string): Promise<Invitation> => {
    const res = await fetch(`/api/invitations/${id}`);
    const data = await parseJsonResponse(res, 'Failed to fetch invitation');
    return data.invitation || data;
  },
  getInvitationById: async (id: string): Promise<{ invitation: Invitation }> => {
    const res = await fetch(`/api/invitations/${id}`);
    return parseJsonResponse(res, 'Failed to fetch invitation');
  },

  getInvitationBySlug: async (slug: string): Promise<{ invitation: Invitation; stats: any; guestbook: GuestbookMessage[] }> => {
    const res = await fetch(`/api/invitations/slug/${slug}`);
    return parseJsonResponse(res, 'Invitation not found');
  },
  getPublishedInvitationBySlug: async (slug: string): Promise<Invitation> => {
    const res = await fetch(`/api/invitations/slug/${slug}`);
    const data = await parseJsonResponse(res, 'Invitation not found');
    return data.invitation || data;
  },

  createInvitation: async (payload: {
    businessId?: string;
    title: string;
    customerName?: string;
    eventDate?: string;
    eventType?: string;
    templateId?: string;
    duplicateFromId?: string;
    category?: string;
  }): Promise<{ invitation: Invitation }> => {
    const userStr = localStorage.getItem('dis_user_session') || localStorage.getItem('invitation_studio_user');
    const user = userStr ? JSON.parse(userStr) : null;
    const bodyPayload = {
      businessId: payload.businessId || user?.id || 'usr-biz-royal',
      ...payload
    };
    const res = await fetch('/api/invitations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyPayload)
    });
    return parseJsonResponse(res, 'Failed to create invitation');
  },

  updateInvitation: async (id: string, updates: Partial<Invitation>): Promise<{ invitation: Invitation; message: string }> => {
    const res = await fetch(`/api/invitations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return parseJsonResponse(res, 'Failed to save invitation');
  },

  duplicateInvitation: async (id: string, businessId?: string): Promise<{ invitation: Invitation }> => {
    const userStr = localStorage.getItem('invitation_studio_user');
    const user = userStr ? JSON.parse(userStr) : null;
    const res = await fetch(`/api/invitations/${id}/duplicate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ businessId: businessId || user?.id || 'biz-royal-prints' })
    });
    return parseJsonResponse(res, 'Failed to duplicate invitation');
  },

  deleteInvitation: async (id: string): Promise<{ success: boolean }> => {
    const res = await fetch(`/api/invitations/${id}`, { method: 'DELETE' });
    return parseJsonResponse(res, 'Failed to delete invitation');
  },

  saveAsTemplate: async (id: string, templateData: { title: string; category: string; description: string; requestPublic?: boolean; isPublic?: boolean }): Promise<{ template: InvitationTemplate }> => {
    const res = await fetch(`/api/invitations/${id}/save-template`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(templateData)
    });
    return parseJsonResponse(res, 'Failed to save template');
  },

  // RSVP
  getRSVPs: async (invitationId: string): Promise<{ rsvps: RSVPResponse[] }> => {
    const res = await fetch(`/api/rsvp/${invitationId}`);
    return parseJsonResponse(res, 'Failed to fetch RSVPs');
  },
  getRSVPList: async (invitationId: string): Promise<{ rsvps: RSVPResponse[] }> => {
    return api.getRSVPs(invitationId);
  },

  submitRSVP: async (payload: any): Promise<{ success: boolean; rsvp: RSVPResponse; message: string }> => {
    const res = await fetch('/api/rsvp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return parseJsonResponse(res, 'Failed to submit RSVP');
  },

  deleteRSVP: async (id: string): Promise<{ success: boolean }> => {
    const res = await fetch(`/api/rsvp/${id}`, { method: 'DELETE' });
    return parseJsonResponse(res, 'Failed to delete RSVP');
  },

  // Guestbook
  getGuestbook: async (invitationId: string): Promise<{ messages: GuestbookMessage[] }> => {
    const res = await fetch(`/api/guestbook/${invitationId}`);
    return parseJsonResponse(res, 'Failed to fetch guestbook');
  },

  submitGuestbook: async (payload: any): Promise<{ success: boolean; message: GuestbookMessage; statusMessage: string }> => {
    const res = await fetch('/api/guestbook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return parseJsonResponse(res, 'Failed to submit message');
  },

  deleteGuestbook: async (id: string): Promise<{ success: boolean }> => {
    const res = await fetch(`/api/guestbook/${id}`, { method: 'DELETE' });
    return parseJsonResponse(res, 'Failed to delete message');
  },

  // AI Assistant
  generateAICopy: async (params: { promptType: string; coupleNames?: string; eventType?: string; tone?: string; extraDetails?: string }) => {
    const res = await fetch('/api/ai/generate-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    const data = await parseJsonResponse(res, 'Failed to generate AI content');
    return data.text || '';
  },

  // Templates Management
  getTemplates: async (params?: { category?: string; search?: string; all?: boolean; superAdminOnly?: boolean; userId?: string; userRole?: string; verificationStatus?: string }, signal?: AbortSignal): Promise<{ templates: InvitationTemplate[] }> => {
    const searchParams = new URLSearchParams();
    if (params?.category && params.category !== 'all') searchParams.append('category', params.category);
    if (params?.search) searchParams.append('search', params.search);
    if (params?.all) searchParams.append('all', 'true');
    if (params?.superAdminOnly) searchParams.append('superAdminOnly', 'true');
    if (params?.userId) searchParams.append('userId', params.userId);
    if (params?.userRole) searchParams.append('userRole', params.userRole);
    if (params?.verificationStatus && params.verificationStatus !== 'all') searchParams.append('verificationStatus', params.verificationStatus);

    const qs = searchParams.toString();
    const url = `/api/templates${qs ? `?${qs}` : ''}`;
    return fetchWithDeduplication<{ templates: InvitationTemplate[] }>(url, {
      headers: getAuthHeaders(),
      signal
    }, 4000);
  },

  getTemplateById: async (id: string): Promise<{ template: InvitationTemplate }> => {
    return fetchWithDeduplication<{ template: InvitationTemplate }>(`/api/templates/${id}`, {
      headers: getAuthHeaders()
    }, 2000);
  },

  createTemplate: async (payload: Partial<InvitationTemplate>): Promise<{ template: InvitationTemplate }> => {
    invalidateApiCache('/api/templates');
    const res = await fetch('/api/templates', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    return parseJsonResponse(res, 'Failed to create template');
  },

  updateTemplate: async (id: string, updates: Partial<InvitationTemplate>): Promise<{ template: InvitationTemplate }> => {
    invalidateApiCache('/api/templates');
    const res = await fetch(`/api/templates/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    return parseJsonResponse(res, 'Failed to update template');
  },

  verifyTemplate: async (id: string, isApproved: boolean, reason?: string): Promise<{ template: InvitationTemplate }> => {
    invalidateApiCache('/api/templates');
    const res = await fetch(`/api/templates/${id}/verify`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ isApproved, reason })
    });
    return parseJsonResponse(res, 'Failed to verify template');
  },

  submitTemplateForVerification: async (id: string): Promise<{ template: InvitationTemplate }> => {
    invalidateApiCache('/api/templates');
    const res = await fetch(`/api/templates/${id}/submit-verification`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    return parseJsonResponse(res, 'Failed to submit template for verification');
  },

  togglePublishTemplate: async (id: string, isPublic: boolean): Promise<{ template: InvitationTemplate }> => {
    invalidateApiCache('/api/templates');
    const res = await fetch(`/api/templates/${id}/publish`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ isPublic })
    });
    return parseJsonResponse(res, 'Failed to toggle template publish status');
  },

  duplicateTemplate: async (id: string): Promise<{ template: InvitationTemplate }> => {
    invalidateApiCache('/api/templates');
    const res = await fetch(`/api/templates/${id}/duplicate`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return parseJsonResponse(res, 'Failed to duplicate template');
  },

  deleteTemplate: async (id: string): Promise<{ success: boolean; id: string }> => {
    invalidateApiCache('/api/templates');
    const res = await fetch(`/api/templates/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return parseJsonResponse(res, 'Failed to delete template');
  },

  // Section Blocks Management
  getBlocks: async (params?: { category?: string; search?: string; all?: boolean }, signal?: AbortSignal): Promise<{ blocks: PrebuiltBlock[] }> => {
    const searchParams = new URLSearchParams();
    if (params?.category && params.category !== 'all') searchParams.append('category', params.category);
    if (params?.search) searchParams.append('search', params.search);
    if (params?.all) searchParams.append('all', 'true');

    const qs = searchParams.toString();
    const url = `/api/blocks${qs ? `?${qs}` : ''}`;
    return fetchWithDeduplication<{ blocks: PrebuiltBlock[] }>(url, {
      headers: getAuthHeaders(),
      signal
    }, 4000);
  },

  getBlockById: async (id: string): Promise<{ block: PrebuiltBlock }> => {
    return fetchWithDeduplication<{ block: PrebuiltBlock }>(`/api/blocks/${id}`, {
      headers: getAuthHeaders()
    }, 2000);
  },

  createBlock: async (payload: Partial<PrebuiltBlock>): Promise<{ block: PrebuiltBlock }> => {
    invalidateApiCache('/api/blocks');
    const res = await fetch('/api/blocks', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    return parseJsonResponse(res, 'Failed to create block');
  },

  deleteBlock: async (id: string): Promise<{ success: boolean; id: string }> => {
    invalidateApiCache('/api/blocks');
    const res = await fetch(`/api/blocks/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return parseJsonResponse(res, 'Failed to delete block');
  },

  // Cloudinary Direct Signed Upload Helpers
  getCloudinaryConfig: async (): Promise<{ success: boolean; cloudName: string; apiKey: string; isConfigured: boolean }> => {
    const res = await fetch('/api/media/cloudinary-config', {
      headers: getAuthHeaders()
    });
    return parseJsonResponse(res, 'Failed to fetch Cloudinary configuration');
  },

  getMediaUploadSignature: async (params: {
    category?: string;
    resourceType?: 'image' | 'video' | 'raw' | 'auto';
    isPublic?: boolean;
    businessId?: string;
  }): Promise<{
    success: boolean;
    signature: string;
    timestamp: number;
    apiKey: string;
    cloudName: string;
    folder: string;
    resourceType: 'image' | 'video' | 'raw' | 'auto';
  }> => {
    const res = await fetch('/api/media/signature', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(params)
    });
    return parseJsonResponse(res, 'Failed to obtain upload signature');
  },

  // Media Library
  getMedia: async (params?: { businessId?: string; invitationId?: string; type?: string; search?: string; category?: string; isPublic?: boolean; scope?: string }): Promise<{ success: boolean; media: MediaAsset[] }> => {
    const searchParams = new URLSearchParams();
    if (params?.businessId) searchParams.append('businessId', params.businessId);
    if (params?.invitationId) searchParams.append('invitationId', params.invitationId);
    if (params?.type && params.type !== 'all') searchParams.append('type', params.type);
    if (params?.search) searchParams.append('search', params.search);
    if (params?.category && params.category !== 'all') searchParams.append('category', params.category);
    if (params?.isPublic !== undefined) searchParams.append('isPublic', String(params.isPublic));
    if (params?.scope) searchParams.append('scope', params.scope);

    const qs = searchParams.toString();
    const url = `/api/media${qs ? `?${qs}` : ''}`;
    return fetchWithDeduplication<{ success: boolean; media: MediaAsset[] }>(url, {
      headers: getAuthHeaders()
    }, 3000);
  },

  uploadMedia: async (payload: Partial<MediaAsset>): Promise<{ success: boolean; media: MediaAsset; message: string }> => {
    invalidateApiCache('/api/media');
    const res = await fetch('/api/media', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    return parseJsonResponse(res, 'Failed to upload media asset');
  },

  linkMediaToInvitation: async (mediaId: string, invitationId: string): Promise<{ success: boolean; media: MediaAsset }> => {
    invalidateApiCache('/api/media');
    const res = await fetch(`/api/media/${mediaId}/link`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ invitationId })
    });
    return parseJsonResponse(res, 'Failed to link media');
  },

  updateMedia: async (mediaId: string, updates: Partial<MediaAsset>): Promise<{ success: boolean; media: MediaAsset }> => {
    invalidateApiCache('/api/media');
    const res = await fetch(`/api/media/${mediaId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    return parseJsonResponse(res, 'Failed to update media');
  },

  deleteMedia: async (mediaId: string): Promise<{ success: boolean; message: string }> => {
    invalidateApiCache('/api/media');
    const res = await fetch(`/api/media/${mediaId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return parseJsonResponse(res, 'Failed to delete media asset');
  },

  getMediaStats: async (businessId?: string): Promise<{ success: boolean; stats: any }> => {
    const searchParams = new URLSearchParams();
    if (businessId) searchParams.append('businessId', businessId);
    const res = await fetch(`/api/media/stats?${searchParams.toString()}`, {
      headers: getAuthHeaders()
    });
    return parseJsonResponse(res, 'Failed to fetch media stats');
  },

  // Background Collections
  getBackgroundCollections: async (params?: { search?: string; all?: boolean }): Promise<{ success: boolean; collections: BackgroundCollection[] }> => {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append('search', params.search);
    if (params?.all) searchParams.append('all', 'true');

    const qs = searchParams.toString();
    const url = `/api/media/collections${qs ? `?${qs}` : ''}`;
    return fetchWithDeduplication<{ success: boolean; collections: BackgroundCollection[] }>(url, {
      headers: getAuthHeaders()
    }, 3000);
  },

  getBackgroundCollectionById: async (id: string): Promise<{ success: boolean; collection: BackgroundCollection }> => {
    return fetchWithDeduplication<{ success: boolean; collection: BackgroundCollection }>(`/api/media/collections/${id}`, {
      headers: getAuthHeaders()
    }, 2000);
  },

  createBackgroundCollection: async (payload: Partial<BackgroundCollection>): Promise<{ success: boolean; collection: BackgroundCollection; message: string }> => {
    invalidateApiCache('/api/media/collections');
    const res = await fetch('/api/media/collections', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    return parseJsonResponse(res, 'Failed to create background collection');
  },

  updateBackgroundCollection: async (id: string, updates: Partial<BackgroundCollection>): Promise<{ success: boolean; collection: BackgroundCollection; message: string }> => {
    invalidateApiCache('/api/media/collections');
    const res = await fetch(`/api/media/collections/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    return parseJsonResponse(res, 'Failed to update background collection');
  },

  reorderBackgroundCollectionAssets: async (id: string, assetIds: string[]): Promise<{ success: boolean; collection: BackgroundCollection; message: string }> => {
    invalidateApiCache('/api/media/collections');
    const res = await fetch(`/api/media/collections/${id}/reorder`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ assetIds })
    });
    return parseJsonResponse(res, 'Failed to reorder collection assets');
  },

  deleteBackgroundCollection: async (id: string): Promise<{ success: boolean; message: string }> => {
    invalidateApiCache('/api/media/collections');
    const res = await fetch(`/api/media/collections/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return parseJsonResponse(res, 'Failed to delete background collection');
  }
};
