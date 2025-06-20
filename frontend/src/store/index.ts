import { create } from 'zustand';
import { Photo, Theme, TimelineNode } from '../types';

interface AppState {
  // Photos
  featuredPhotos: Photo[];
  currentPhoto: Photo | null;
  
  // Themes
  themes: Theme[];
  currentTheme: Theme | null;
  
  // Timeline
  timelineNodes: TimelineNode[];
  
  // UI State
  isLoading: boolean;
  error: string | null;
  
  // Lightbox
  lightboxOpen: boolean;
  lightboxPhotos: Photo[];
  lightboxCurrentIndex: number;
  
  // Actions
  setFeaturedPhotos: (photos: Photo[]) => void;
  setCurrentPhoto: (photo: Photo | null) => void;
  setThemes: (themes: Theme[]) => void;
  setCurrentTheme: (theme: Theme | null) => void;
  setTimelineNodes: (nodes: TimelineNode[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Lightbox actions
  openLightbox: (photos: Photo[], startIndex: number) => void;
  closeLightbox: () => void;
  nextPhoto: () => void;
  prevPhoto: () => void;
  setLightboxIndex: (index: number) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  featuredPhotos: [],
  currentPhoto: null,
  themes: [],
  currentTheme: null,
  timelineNodes: [],
  isLoading: false,
  error: null,
  lightboxOpen: false,
  lightboxPhotos: [],
  lightboxCurrentIndex: 0,
  
  // Actions
  setFeaturedPhotos: (photos) => set({ featuredPhotos: photos }),
  setCurrentPhoto: (photo) => set({ currentPhoto: photo }),
  setThemes: (themes) => set({ themes }),
  setCurrentTheme: (theme) => set({ currentTheme: theme }),
  setTimelineNodes: (nodes) => set({ timelineNodes: nodes }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  
  // Lightbox actions
  openLightbox: (photos, startIndex) => set({
    lightboxOpen: true,
    lightboxPhotos: photos,
    lightboxCurrentIndex: startIndex,
  }),
  
  closeLightbox: () => set({
    lightboxOpen: false,
    lightboxPhotos: [],
    lightboxCurrentIndex: 0,
  }),
  
  nextPhoto: () => {
    const { lightboxPhotos, lightboxCurrentIndex } = get();
    const nextIndex = (lightboxCurrentIndex + 1) % lightboxPhotos.length;
    set({ lightboxCurrentIndex: nextIndex });
  },
  
  prevPhoto: () => {
    const { lightboxPhotos, lightboxCurrentIndex } = get();
    const prevIndex = lightboxCurrentIndex === 0 
      ? lightboxPhotos.length - 1 
      : lightboxCurrentIndex - 1;
    set({ lightboxCurrentIndex: prevIndex });
  },
  
  setLightboxIndex: (index) => set({ lightboxCurrentIndex: index }),
}));