import React, { useEffect, useState } from 'react';
import { Photo } from '../types';

const FixedHomePage: React.FC = () => {
  const [featuredPhotos, setFeaturedPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 模拟加载数据
    setTimeout(() => {
      const mockPhotos: Photo[] = [
        {
          id: '1',
          title: '城市夜景',
          description: '繁华都市的夜晚，霓虹灯闪烁',
          imageUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800',
          thumbnailUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=400',
          isFeatured: true,
          createdAt: '2024-01-15',
          themes: []
        },
        {
          id: '2',
          title: '自然风光',
          description: '大自然的壮美景色',
          imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
          thumbnailUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
          isFeatured: true,
          createdAt: '2024-01-12',
          themes: []
        },
        {
          id: '3',
          title: '人像摄影',
          description: '捕捉人物的神态与情感',
          imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
          thumbnailUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
          isFeatured: true,
          createdAt: '2024-01-10',
          themes: []
        }
      ];
      setFeaturedPhotos(mockPhotos);
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">正在加载...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-700">
        <div className="text-center text-white px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            摄影师作品集
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            用镜头记录世界的美好，用光影诉说生活的故事
          </p>
          <button className="bg-white text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
            浏览作品
          </button>
        </div>
      </section>

      {/* Featured Works */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              精选作品
            </h2>
            <p className="text-xl text-gray-600">
              展示我最得意的摄影作品
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPhotos.map((photo) => (
              <div key={photo.id} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-lg shadow-lg">
                  <img
                    src={photo.thumbnailUrl}
                    alt={photo.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {photo.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {photo.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            探索更多作品
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            浏览不同主题的摄影作品，发现更多精彩瞬间
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gray-900 text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors">
              浏览主题集
            </button>
            <button className="border border-gray-900 text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-900 hover:text-white transition-colors">
              了解更多
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FixedHomePage;