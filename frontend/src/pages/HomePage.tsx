import React, { useEffect } from 'react';
import { useAppStore } from '../store';
import { photoService } from '../services/api';
import MasonryGrid from '../components/common/MasonryGrid';
import Loading from '../components/common/Loading';

const HomePage: React.FC = () => {
  const { featuredPhotos, isLoading, setFeaturedPhotos, setLoading, setError } = useAppStore();

  useEffect(() => {
    const loadFeaturedPhotos = async () => {
      try {
        setLoading(true);
        setError(null);
        const photos = await photoService.getFeaturedPhotos();
        setFeaturedPhotos(photos);
      } catch (error) {
        console.error('Failed to load featured photos:', error);
        setError('加载精选作品失败');
        // 设置一些模拟数据用于演示
        setFeaturedPhotos([
          {
            id: '1',
            title: '城市夜景',
            description: '繁华都市的夜晚，霓虹灯闪烁，车流如织',
            imageUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800',
            thumbnailUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=400',
            isFeatured: true,
            createdAt: '2024-01-15',
            themes: [],
            exifData: {
              camera: 'Canon EOS R5',
              lens: '24-70mm f/2.8',
              aperture: '2.8',
              shutterSpeed: '1/60',
              iso: '1600',
              focalLength: '35'
            }
          },
          {
            id: '2',
            title: '山间晨雾',
            description: '清晨的山谷，薄雾缭绕，阳光透过云层洒向大地',
            imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
            thumbnailUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
            isFeatured: true,
            createdAt: '2024-01-10',
            themes: [],
            exifData: {
              camera: 'Sony A7R IV',
              lens: '70-200mm f/2.8',
              aperture: '5.6',
              shutterSpeed: '1/125',
              iso: '400',
              focalLength: '135'
            }
          },
          {
            id: '3',
            title: '街头人像',
            description: '捕捉城市中匆忙行走的人们，记录生活的真实瞬间',
            imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
            thumbnailUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
            isFeatured: true,
            createdAt: '2024-01-08',
            themes: [],
            exifData: {
              camera: 'Fujifilm X-T4',
              lens: '56mm f/1.2',
              aperture: '1.8',
              shutterSpeed: '1/250',
              iso: '800',
              focalLength: '56'
            }
          },
          {
            id: '4',
            title: '海边日落',
            description: '夕阳西下，海浪拍打着岸边，天空被染成金黄色',
            imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
            thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400',
            isFeatured: true,
            createdAt: '2024-01-05',
            themes: [],
            exifData: {
              camera: 'Nikon D850',
              lens: '14-24mm f/2.8',
              aperture: '8.0',
              shutterSpeed: '1/30',
              iso: '200',
              focalLength: '20'
            }
          },
          {
            id: '5',
            title: '建筑几何',
            description: '现代建筑的几何美学，线条与光影的完美结合',
            imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
            thumbnailUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400',
            isFeatured: true,
            createdAt: '2024-01-03',
            themes: [],
            exifData: {
              camera: 'Canon EOS R6',
              lens: '16-35mm f/2.8',
              aperture: '11',
              shutterSpeed: '1/125',
              iso: '100',
              focalLength: '24'
            }
          },
          {
            id: '6',
            title: '花卉微距',
            description: '细腻的花瓣纹理，露珠晶莹剔透，展现自然的精致之美',
            imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
            thumbnailUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400',
            isFeatured: true,
            createdAt: '2024-01-01',
            themes: [],
            exifData: {
              camera: 'Canon EOS R5',
              lens: '100mm f/2.8 Macro',
              aperture: '5.6',
              shutterSpeed: '1/200',
              iso: '400',
              focalLength: '100'
            }
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedPhotos();
  }, [setFeaturedPhotos, setLoading, setError]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-700">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1920)'
          }}
        ></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            摄影师作品集
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            用镜头记录世界的美好，用光影诉说生活的故事
          </p>
          <button 
            onClick={() => {
              document.getElementById('featured-works')?.scrollIntoView({ 
                behavior: 'smooth' 
              });
            }}
            className="bg-white text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
          >
            探索作品
          </button>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Featured Works Section */}
      <section id="featured-works" className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              精选作品
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              这里展示了我最得意的摄影作品，每一张照片都承载着独特的故事和情感
            </p>
          </div>

          {isLoading ? (
            <Loading size="lg" text="正在加载精选作品..." />
          ) : (
            <MasonryGrid photos={featuredPhotos} />
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            想要了解更多？
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            浏览我的主题集，了解我的创作历程，或者直接与我联系
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/themes"
              className="bg-gray-900 text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors"
            >
              浏览主题集
            </a>
            <a
              href="/timeline"
              className="border border-gray-900 text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-900 hover:text-white transition-colors"
            >
              我的时光轴
            </a>
            <a
              href="/contact"
              className="border border-gray-900 text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-900 hover:text-white transition-colors"
            >
              联系我
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;