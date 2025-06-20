import axios from 'axios';
import { Photo, Theme, TimelineNode, ContactForm, ApiResponse, PaginatedResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const photoService = {
  // Get featured photos for homepage
  getFeaturedPhotos: async (): Promise<Photo[]> => {
    const response = await api.get<ApiResponse<Photo[]>>('/photos/featured');
    return response.data.data || [];
  },

  // Get photos by theme
  getPhotosByTheme: async (themeId: string, page = 1, pageSize = 20): Promise<PaginatedResponse<Photo>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<Photo>>>(
      `/photos/theme/${themeId}?page=${page}&pageSize=${pageSize}`
    );
    return response.data.data || { items: [], total: 0, page: 1, pageSize: 20, totalPages: 0 };
  },

  // Get single photo
  getPhoto: async (id: string): Promise<Photo | null> => {
    const response = await api.get<ApiResponse<Photo>>(`/photos/${id}`);
    return response.data.data || null;
  },

  // Upload photo (admin)
  uploadPhoto: async (formData: FormData): Promise<Photo> => {
    const response = await api.post<ApiResponse<Photo>>('/photos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data!;
  },

  // Update photo (admin)
  updatePhoto: async (id: string, data: Partial<Photo>): Promise<Photo> => {
    const response = await api.put<ApiResponse<Photo>>(`/photos/${id}`, data);
    return response.data.data!;
  },

  // Delete photo (admin)
  deletePhoto: async (id: string): Promise<void> => {
    await api.delete(`/photos/${id}`);
  },
};

export const themeService = {
  // Get all themes
  getThemes: async (): Promise<Theme[]> => {
    const response = await api.get<ApiResponse<Theme[]>>('/themes');
    return response.data.data || [];
  },

  // Get single theme
  getTheme: async (id: string): Promise<Theme | null> => {
    const response = await api.get<ApiResponse<Theme>>(`/themes/${id}`);
    return response.data.data || null;
  },

  // Create theme (admin)
  createTheme: async (data: Omit<Theme, 'id' | 'photoCount'>): Promise<Theme> => {
    const response = await api.post<ApiResponse<Theme>>('/themes', data);
    return response.data.data!;
  },

  // Update theme (admin)
  updateTheme: async (id: string, data: Partial<Theme>): Promise<Theme> => {
    const response = await api.put<ApiResponse<Theme>>(`/themes/${id}`, data);
    return response.data.data!;
  },

  // Delete theme (admin)
  deleteTheme: async (id: string): Promise<void> => {
    await api.delete(`/themes/${id}`);
  },
};

export const timelineService = {
  // Get timeline nodes
  getTimelineNodes: async (): Promise<TimelineNode[]> => {
    const response = await api.get<ApiResponse<TimelineNode[]>>('/timeline');
    return response.data.data || [];
  },

  // Get single timeline node
  getTimelineNode: async (id: string): Promise<TimelineNode | null> => {
    const response = await api.get<ApiResponse<TimelineNode>>(`/timeline/${id}`);
    return response.data.data || null;
  },

  // Create timeline node (admin)
  createTimelineNode: async (data: Omit<TimelineNode, 'id' | 'photos'>): Promise<TimelineNode> => {
    const response = await api.post<ApiResponse<TimelineNode>>('/timeline', data);
    return response.data.data!;
  },

  // Update timeline node (admin)
  updateTimelineNode: async (id: string, data: Partial<TimelineNode>): Promise<TimelineNode> => {
    const response = await api.put<ApiResponse<TimelineNode>>(`/timeline/${id}`, data);
    return response.data.data!;
  },

  // Delete timeline node (admin)
  deleteTimelineNode: async (id: string): Promise<void> => {
    await api.delete(`/timeline/${id}`);
  },
};

export const contactService = {
  // Send contact form
  sendContactForm: async (data: ContactForm): Promise<void> => {
    await api.post<ApiResponse<void>>('/contact', data);
  },
};

export default api;