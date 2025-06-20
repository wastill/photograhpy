import React from 'react';
import { Photo } from '../../types';
import PhotoCard from './PhotoCard';
import { useAppStore } from '../../store';

interface MasonryGridProps {
  photos: Photo[];
  className?: string;
}

const MasonryGrid: React.FC<MasonryGridProps> = ({ photos, className = '' }) => {
  const { openLightbox } = useAppStore();

  const handlePhotoClick = (photo: Photo, index: number) => {
    openLightbox(photos, index);
  };

  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-gray-500 text-lg">暂无照片</p>
      </div>
    );
  }

  return (
    <div className={`masonry-grid ${className}`}>
      {photos.map((photo, index) => (
        <PhotoCard
          key={photo.id}
          photo={photo}
          onClick={() => handlePhotoClick(photo, index)}
        />
      ))}
    </div>
  );
};

export default MasonryGrid;