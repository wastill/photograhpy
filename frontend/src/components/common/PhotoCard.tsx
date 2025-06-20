import React, { useState } from 'react';
import { Photo } from '../../types';

interface PhotoCardProps {
  photo: Photo;
  onClick: () => void;
  showTitle?: boolean;
  className?: string;
}

const PhotoCard: React.FC<PhotoCardProps> = ({ 
  photo, 
  onClick, 
  showTitle = true, 
  className = '' 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  return (
    <div 
      className={`masonry-item cursor-pointer group ${className}`}
      onClick={onClick}
    >
      <div className="relative overflow-hidden rounded-lg bg-gray-100">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        )}
        
        {imageError ? (
          <div className="aspect-[4/3] flex items-center justify-center bg-gray-200">
            <div className="text-center text-gray-500">
              <svg className="mx-auto h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm">图片加载失败</p>
            </div>
          </div>
        ) : (
          <img
            src={photo.thumbnailUrl || photo.imageUrl}
            alt={photo.title}
            className={`w-full h-auto object-cover transition-all duration-300 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
          />
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300">
          {showTitle && (
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <h3 className="text-white font-medium text-sm truncate">
                {photo.title}
              </h3>
              {photo.description && (
                <p className="text-white/80 text-xs mt-1 line-clamp-2">
                  {photo.description}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhotoCard;