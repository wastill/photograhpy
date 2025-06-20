export interface Photo {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  thumbnailUrl: string;
  isFeatured: boolean;
  createdAt: string;
  exifData?: ExifData;
  themes: Theme[];
  timelineNodeId?: string;
}

export interface Theme {
  id: string;
  name: string;
  description?: string;
  coverImageId?: string;
  coverImageUrl?: string;
  photoCount: number;
}

export interface TimelineNode {
  id: string;
  title: string;
  periodStart: string;
  periodEnd: string;
  storyContent: string;
  photos: Photo[];
}

export interface ExifData {
  camera?: string;
  lens?: string;
  aperture?: string;
  shutterSpeed?: string;
  iso?: string;
  focalLength?: string;
  dateTaken?: string;
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}