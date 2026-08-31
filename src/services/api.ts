import { User, Invitation, RSVPResponse, GuestbookMessage, InvitationTemplate, AdminStats, MediaAsset } from '../types';

export const api = {
  // Auth
  login: async (credentials: { username: string; password: string }) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    return data;
  },

  // Admin User Management
  getUsers: async (): Promise<{ users: User[] }> => {
    const res = await fetch('/api/admin/users');
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch users');
    return data;
  },
  getAdminUsers: async (): Promise<{ users: User[] }> => {
    return api.getUsers();
  },

  createUser: async (userData: any): Promise<{ user: User; message: string }> => {
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create user');
    return data;
  },
  createAdminUser: async (userData: any): Promise<{ user: User; message: string }> => {
    return api.createUser(userData);
  },

  updateUser: async (id: string, updates: any): Promise<{ user: User; message: string }> => {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update user');
    return data;
  },
  updateAdminUser: async (id: string, updates: any): Promise<{ user: User; message: string }> => {
    return api.updateUser(id, updates);
  },

  resetUserPassword: async (id: string, newPassword: string): Promise<{ message: string }> => {
    const res = await fetch(`/api/admin/users/${id}/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newPassword })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to reset password');
    return data;
  },
  resetAdminUserPassword: async (id: string, newPassword: string): Promise<{ message: string }> => {
    return api.resetUserPassword(id, newPassword);
  },

  deleteUser: async (id: string): Promise<{ success: boolean }> => {
    const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete user');
    return data;
  },
  deleteAdminUser: async (id: string): Promise<{ success: boolean }> => {
    return api.deleteUser(id);
  },

  getAdminStats: async (): Promise<AdminStats> => {
    const res = await fetch('/api/admin/stats');
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch stats');
    return data.stats;
  },

  // Invitations
  getInvitations: async (businessId?: string, role?: string): Promise<{ invitations: Invitation[] }> => {
    const params = new URLSearchParams();
    if (businessId) params.append('businessId', businessId);
    if (role) params.append('role', role);
    const res = await fetch(`/api/invitations?${params.toString()}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch invitations');
    return data;
  },

  getInvitation: async (id: string): Promise<Invitation> => {
    const res = await fetch(`/api/invitations/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch invitation');
    return data.invitation || data;
  },
  getInvitationById: async (id: string): Promise<{ invitation: Invitation }> => {
    const res = await fetch(`/api/invitations/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch invitation');
    return data;
  },

  getInvitationBySlug: async (slug: string): Promise<{ invitation: Invitation; stats: any; guestbook: GuestbookMessage[] }> => {
    const res = await fetch(`/api/invitations/slug/${slug}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Invitation not found');
    return data;
  },
  getPublishedInvitationBySlug: async (slug: string): Promise<Invitation> => {
    const res = await fetch(`/api/invitations/slug/${slug}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Invitation not found');
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
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create invitation');
    return data;
  },

  updateInvitation: async (id: string, updates: Partial<Invitation>): Promise<{ invitation: Invitation; message: string }> => {
    const res = await fetch(`/api/invitations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to save invitation');
    return data;
  },

  duplicateInvitation: async (id: string, businessId?: string): Promise<{ invitation: Invitation }> => {
    const userStr = localStorage.getItem('invitation_studio_user');
    const user = userStr ? JSON.parse(userStr) : null;
    const res = await fetch(`/api/invitations/${id}/duplicate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ businessId: businessId || user?.id || 'biz-royal-prints' })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to duplicate invitation');
    return data;
  },

  deleteInvitation: async (id: string): Promise<{ success: boolean }> => {
    const res = await fetch(`/api/invitations/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete invitation');
    return data;
  },

  saveAsTemplate: async (id: string, templateData: { title: string; category: string; description: string }): Promise<{ template: InvitationTemplate }> => {
    const res = await fetch(`/api/invitations/${id}/save-template`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(templateData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to save template');
    return data;
  },

  // Templates
  getTemplates: async (): Promise<{ templates: InvitationTemplate[] }> => {
    const res = await fetch('/api/templates');
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch templates');
    return data;
  },

  // RSVP
  getRSVPs: async (invitationId: string): Promise<{ rsvps: RSVPResponse[] }> => {
    const res = await fetch(`/api/rsvp/${invitationId}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch RSVPs');
    return data;
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
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to submit RSVP');
    return data;
  },

  deleteRSVP: async (id: string): Promise<{ success: boolean }> => {
    const res = await fetch(`/api/rsvp/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete RSVP');
    return data;
  },

  // Guestbook
  getGuestbook: async (invitationId: string): Promise<{ messages: GuestbookMessage[] }> => {
    const res = await fetch(`/api/guestbook/${invitationId}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch guestbook');
    return data;
  },

  submitGuestbook: async (payload: any): Promise<{ success: boolean; message: GuestbookMessage; statusMessage: string }> => {
    const res = await fetch('/api/guestbook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to submit message');
    return data;
  },

  deleteGuestbook: async (id: string): Promise<{ success: boolean }> => {
    const res = await fetch(`/api/guestbook/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete message');
    return data;
  },

  // AI Assistant
  generateAICopy: async (params: { promptType: string; coupleNames?: string; eventType?: string; tone?: string; extraDetails?: string }) => {
    const res = await fetch('/api/ai/generate-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    const data = await res.json();
    return data.text || '';
  },

  // Media Library
  getMedia: async (params?: { businessId?: string; invitationId?: string; type?: string; search?: string }): Promise<{ success: boolean; media: MediaAsset[] }> => {
    const searchParams = new URLSearchParams();
    if (params?.businessId) searchParams.append('businessId', params.businessId);
    if (params?.invitationId) searchParams.append('invitationId', params.invitationId);
    if (params?.type && params.type !== 'all') searchParams.append('type', params.type);
    if (params?.search) searchParams.append('search', params.search);

    const res = await fetch(`/api/media?${searchParams.toString()}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch media assets');
    return data;
  },

  uploadMedia: async (payload: Partial<MediaAsset>): Promise<{ success: boolean; media: MediaAsset; message: string }> => {
    const res = await fetch('/api/media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to upload media asset');
    return data;
  },

  linkMediaToInvitation: async (mediaId: string, invitationId: string): Promise<{ success: boolean; media: MediaAsset }> => {
    const res = await fetch(`/api/media/${mediaId}/link`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invitationId })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to link media');
    return data;
  },

  updateMedia: async (mediaId: string, updates: Partial<MediaAsset>): Promise<{ success: boolean; media: MediaAsset }> => {
    const res = await fetch(`/api/media/${mediaId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update media');
    return data;
  },

  deleteMedia: async (mediaId: string): Promise<{ success: boolean; message: string }> => {
    const res = await fetch(`/api/media/${mediaId}`, {
      method: 'DELETE'
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete media asset');
    return data;
  },

  getMediaStats: async (businessId?: string): Promise<{ success: boolean; stats: any }> => {
    const searchParams = new URLSearchParams();
    if (businessId) searchParams.append('businessId', businessId);
    const res = await fetch(`/api/media/stats?${searchParams.toString()}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch media stats');
    return data;
  }
};
