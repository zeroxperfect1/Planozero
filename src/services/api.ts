/**
 * API Service — PlanoZero
 * Capa de acceso centralizada que reemplaza todas las llamadas a Firebase Firestore.
 * Apunta a la API PHP en /api/*.php del hosting compartido.
 */

import { auth } from '../lib/firebase';

// En producción: /api — En desarrollo: apunta a la misma URL (proxy via Vite o producción)
const BASE = '/api';

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  image: string;
  keywords: string;
  published: boolean;
  author_id: string;
  author_email: string;
  created_at: string;
  updated_at: string;
  // Compat. con código existente
  authorId?: string;
  createdAt?: any;
}

export interface PageLayout {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  showInNavigation: boolean;
  order: number;
  root: any;
  created_at?: string;
  updated_at?: string;
  createdAt?: any;
}

export interface MenuItem {
  id: string;
  label: string;
  href: string;
  children?: MenuItem[];
}

export interface Menu {
  id: string;
  name: string;
  items: MenuItem[];
  created_at: string;
  updated_at: string;
}

export interface Contact {
  id: string;
  name: string;
  company: string;
  position: string;
  email: string;
  phone: string;
  idea: string;
  status: 'pending' | 'responded' | 'archived';
  created_at: string;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  user_id: string;
  created_at: string;
  // Compat.
  userId?: string;
  createdAt?: any;
}

export interface LogEntry {
  id?: number;
  message: string;
  level: 'info' | 'error';
  uid: string;
  created_at: string;
  timestamp?: string;
}

export interface ContentType {
  id: string;
  name: string;
  fields: any[];
  created_at: string;
  updated_at: string;
}

export interface DynamicContent {
  id: string;
  type_id: string;
  data: any;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface HealthStatus {
  status: 'ok' | 'degraded' | 'error';
  timestamp: string;
  services: Record<string, string>;
}

// ─── Request helper ────────────────────────────────────────────────────────────

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  skipAuth = false
): Promise<T> {
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  // Add Authorization header (skip for public endpoints)
  if (!skipAuth) {
    try {
      const token = await auth.currentUser?.getIdToken();
      if (token) headers['Authorization'] = `Bearer ${token}`;
    } catch {
      // Continue without auth for public endpoints
    }
  }

  // Don't set Content-Type for FormData (browser sets it with boundary)
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}`;
    try {
      const err = await response.json();
      errorMessage = err.error || err.message || errorMessage;
    } catch {
      // ignore JSON parse error
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

// ─── API Surface ───────────────────────────────────────────────────────────────

export const api = {
  // Pages
  pages: {
    getAll: () =>
      request<PageLayout[]>('/pages.php'),
    getBySlug: (slug: string) =>
      request<PageLayout>(`/pages.php?slug=${encodeURIComponent(slug)}`, {}, true),
    create: (data: Partial<PageLayout>) =>
      request<{ id: string }>('/pages.php', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<PageLayout>) =>
      request<{ message: string }>(`/pages.php?id=${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    patch: (id: string, data: Record<string, any>) =>
      request<{ message: string }>(`/pages.php?id=${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) =>
      request<{ message: string }>(`/pages.php?id=${id}`, { method: 'DELETE' }),
  },

  // Posts
  posts: {
    getAll: () =>
      request<Post[]>('/posts.php'),
    getPublished: () =>
      request<Post[]>('/posts.php?published=1', {}, true),
    getBySlug: (slug: string) =>
      request<Post>(`/posts.php?slug=${encodeURIComponent(slug)}`, {}, true),
    getById: (id: string) =>
      request<Post>(`/posts.php?id=${id}`, {}, true),
    create: (data: Partial<Post>) =>
      request<{ id: string }>('/posts.php', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Post>) =>
      request<{ message: string }>(`/posts.php?id=${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) =>
      request<{ message: string }>(`/posts.php?id=${id}`, { method: 'DELETE' }),
  },

  // Menus
  menus: {
    getAll: () =>
      request<Menu[]>('/menus.php', {}, true),
    create: (data: Partial<Menu>) =>
      request<{ id: string }>('/menus.php', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Menu>) =>
      request<{ message: string }>(`/menus.php?id=${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) =>
      request<{ message: string }>(`/menus.php?id=${id}`, { method: 'DELETE' }),
  },

  // Contacts
  contacts: {
    getAll: () =>
      request<Contact[]>('/contacts.php'),
    create: (data: Partial<Contact>) =>
      request<{ message: string; id: string }>('/contacts.php', {
        method: 'POST',
        body: JSON.stringify(data),
      }, true), // Public endpoint
    update: (id: string, data: Partial<Contact>) =>
      request<{ message: string }>(`/contacts.php?id=${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) =>
      request<{ message: string }>(`/contacts.php?id=${id}`, { method: 'DELETE' }),
  },

  // Media
  media: {
    getAll: () =>
      request<MediaItem[]>('/media.php'),
    delete: (id: string) =>
      request<{ message: string }>(`/media.php?id=${id}`, { method: 'DELETE' }),
  },

  // Upload
  upload: {
    file: async (file: File | Blob): Promise<string> => {
      const formData = new FormData();
      if (file instanceof File) {
        formData.append('file', file, file.name);
      } else {
        formData.append('file', file, `image-${Date.now()}.jpg`);
      }
      const result = await request<{ url: string }>('/upload.php', {
        method: 'POST',
        body: formData,
      });
      return result.url;
    },
  },

  // Logs
  logs: {
    getAll: () =>
      request<LogEntry[]>('/logs.php'),
    add: (message: string, level: 'info' | 'error' = 'info') =>
      request<{ message: string }>('/logs.php', {
        method: 'POST',
        body: JSON.stringify({ message, level, uid: auth.currentUser?.uid || 'system' }),
      }).catch(() => null), // Silent fail
    clear: () =>
      request<{ message: string }>('/logs.php', { method: 'DELETE' }),
  },

  // Content Types
  contentTypes: {
    getAll: () =>
      request<ContentType[]>('/content-types.php'),
    create: (data: Partial<ContentType>) =>
      request<{ id: string }>('/content-types.php', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<ContentType>) =>
      request<{ message: string }>(`/content-types.php?id=${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) =>
      request<{ message: string }>(`/content-types.php?id=${id}`, { method: 'DELETE' }),
  },

  // Dynamic Content
  dynamicContent: {
    getAll: (typeId?: string) =>
      request<DynamicContent[]>(typeId ? `/dynamic-content.php?type_id=${typeId}` : '/dynamic-content.php'),
    create: (data: Partial<DynamicContent>) =>
      request<{ id: string }>('/dynamic-content.php', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<DynamicContent>) =>
      request<{ message: string }>(`/dynamic-content.php?id=${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) =>
      request<{ message: string }>(`/dynamic-content.php?id=${id}`, { method: 'DELETE' }),
  },

  // Health
  health: {
    check: () =>
      request<HealthStatus>('/health.php', {}, true),
  },
};

export default api;
