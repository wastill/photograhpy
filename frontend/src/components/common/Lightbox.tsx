import React, { useEffect, useCallback } from 'react';
import { useAppStore } from '../../store';

const Lightbox: React.FC = () => {
  const {
    lightboxOpen,
    lightboxPhotos,
    lightboxCurrentIndex,
    closeLightbox,
    nextPhoto,
    prevPhoto,
  } = useAppStore();

  const currentPhoto = lightboxPhotos[lightboxCurrentIndex];

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!lightboxOpen) return;

    switch (event.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowLeft':
        prevPhoto();
        break;
      case 'ArrowRight':
        nextPhoto();
        break;
    }
  }, [lightboxOpen, closeLightbox, nextPhoto, prevPhoto]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [lightboxOpen]);

  if (!lightboxOpen || !currentPhoto) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center">
      {/* Close button */}
      <button
        onClick={closeLightbox}
        className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors"
        aria-label="关闭"
      >
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Navigation buttons */}
      {lightboxPhotos.length > 1 && (
        <>
          <button
            onClick={prevPhoto}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-colors"
            aria-label="上一张"
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextPhoto}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-colors"
            aria-label="下一张"
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Main content */}
      <div className="max-w-7xl max-h-full mx-auto px-4 flex flex-col lg:flex-row items-center gap-8">
        {/* Image */}
        <div className="flex-1 flex items-center justify-center">
          <img
            src={currentPhoto.imageUrl}
            alt={currentPhoto.title}
            className="max-w-full max-h-[80vh] object-contain"
          />
        </div>

        {/* Info panel */}
        <div className="w-full lg:w-80 text-white space-y-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">{currentPhoto.title}</h2>
            {currentPhoto.description && (
              <p className="text-gray-300 leading-relaxed">{currentPhoto.description}</p>
            )}
          </div>

          {/* EXIF data */}
          {currentPhoto.exifData && (
            <div className="border-t border-gray-700 pt-4">
              <h3 className="text-lg font-semibold mb-3">拍摄信息</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {currentPhoto.exifData.camera && (
                  <div>
                    <span className="text-gray-400">相机:</span>
                    <span className="ml-2">{currentPhoto.exifData.camera}</span>
                  </div>
                )}
                {currentPhoto.exifData.lens && (
                  <div>
                    <span className="text-gray-400">镜头:</span>
                    <span className="ml-2">{currentPhoto.exifData.lens}</span>
                  </div>
                )}
                {currentPhoto.exifData.aperture && (
                  <div>
                    <span className="text-gray-400">光圈:</span>
                    <span className="ml-2">f/{currentPhoto.exifData.aperture}</span>
                  </div>
                )}
                {currentPhoto.exifData.shutterSpeed && (
                  <div>
                    <span className="text-gray-400">快门:</span>
                    <span className="ml-2">{currentPhoto.exifData.shutterSpeed}s</span>
                  </div>
                )}
                {currentPhoto.exifData.iso && (
                  <div>
                    <span className="text-gray-400">ISO:</span>
                    <span className="ml-2">{currentPhoto.exifData.iso}</span>
                  </div>
                )}
                {currentPhoto.exifData.focalLength && (
                  <div>
                    <span className="text-gray-400">焦距:</span>
                    <span className="ml-2">{currentPhoto.exifData.focalLength}mm</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Photo counter */}
          {lightboxPhotos.length > 1 && (
            <div className="border-t border-gray-700 pt-4">
              <p className="text-gray-400 text-sm">
                {lightboxCurrentIndex + 1} / {lightboxPhotos.length}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Background overlay */}
      <div
        className="absolute inset-0 -z-10"
        onClick={closeLightbox}
      />
    </div>
  );
};

export default Lightbox;