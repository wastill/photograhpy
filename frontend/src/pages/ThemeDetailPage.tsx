import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppStore } from '../store';
import { themeService, photoService } from '../services/api';
import { Theme, Photo } from '../types';
import MasonryGrid from '../components/common/MasonryGrid';
import Loading from '../components/common/Loading';

const ThemeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isLoading, setLoading, setError } = useAppStore();
  const [theme, setTheme] = useState<Theme | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    const loadThemeData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        
        // Load theme details
        const themeData = await themeService.getTheme(id);
        if (!themeData) {
          setError('主题不存在');
          return;
        }
        setTheme(themeData);

        // Load photos for this theme
        const photosData = await photoService.getPhotosByTheme(id);
        setPhotos(photosData.items);
      } catch (error) {
        console.error('Failed to load theme data:', error);
        setError('加载主题数据失败');
        
        // 设置模拟数据
        const mockTheme: Theme = {
          id: id!,
          name: '人像摄影',
          description: '捕捉人物的神态与情感，记录生活中的真实瞬间。人像摄影不仅仅是拍摄人物的外表，更重要的是通过镜头展现人物的内心世界和情感状态。',
          coverImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600',
          photoCount: 12
        };
        setTheme(mockTheme);

        const mockPhotos: Photo[] = [
          {
            id: '1',
            title: '城市女孩',
            description: '在繁华的都市中，她的眼神透露出对未来的憧憬',
            imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
            thumbnailUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
            isFeatured: true,
            createdAt: '2024-01-15',
            themes: [mockTheme],
            exifData: {
              camera: 'Canon EOS R5',
              lens: '85mm f/1.4',
              aperture: '1.8',
              shutterSpeed: '1/200',
              iso: '400',
              focalLength: '85'
            }
          },
          {
            id: '2',
            title: '老人的微笑',
            description: '岁月在脸上留下痕迹，但眼中的光芒依然温暖',
            imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800',
            thumbnailUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
            isFeatured: false,
            createdAt: '2024-01-12',
            themes: [mockTheme],
            exifData: {
              camera: 'Sony A7R IV',
              lens: '50mm f/1.4',
              aperture: '2.0',
              shutterSpeed: '1/125',
              iso: '800',
              focalLength: '50'
            }
          },
          {
            id: '3',
            title: '孩子的纯真',
            description: '天真无邪的笑容，是这个世界上最美好的事物',
            imageUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800',
            thumbnailUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400',
            isFeatured: false,
            createdAt: '2024-01-10',
            themes: [mockTheme],
            exifData: {
              camera: 'Fujifilm X-T4',
              lens: '56mm f/1.2',
              aperture: '1.4',
              shutterSpeed: '1/250',
              iso: '200',
              focalLength: '56'
            }
          },
          {
            id: '4',
            title: '艺术家的专注',
            description: '创作时的专注神情，展现了艺术家对作品的热爱',
            imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800',
            thumbnailUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
            isFeatured: false,
            createdAt: '2024-01-08',
            themes: [mockTheme],
            exifData: {
              camera: 'Nikon D850',
              lens: '105mm f/1.4',
              aperture: '2.8',
              shutterSpeed: '1/160',
              iso: '640',
              focalLength: '105'
            }
          },
          {
            id: '5',
            title: '街头音乐人',
            description: '街头的音乐人用心演奏，音乐是他们的语言',
            imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
            thumbnailUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
            isFeatured: false,
            createdAt: '2024-01-05',
            themes: [mockTheme],
            exifData: {
              camera: 'Canon EOS R6',
              lens: '24-70mm f/2.8',
              aperture: '4.0',
              shutterSpeed: '1/100',
              iso: '1600',
              focalLength: '50'
            }
          },
          {
            id: '6',
            title: '母亲的温柔',
            description: '母爱如水，温柔而深沉，是世界上最伟大的力量',
            imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800',
            thumbnailUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
            isFeatured: false,
            createdAt: '2024-01-03',
            themes: [mockTheme],
            exifData: {
              camera: 'Sony A7 III',
              lens: '85mm f/1.8',
              aperture: '2.2',
              shutterSpeed: '1/200',
              iso: '320',
              focalLength: '85'
            }
          }
        ];
        setPhotos(mockPhotos);
      } finally {
        setLoading(false);
      }
    };

    loadThemeData();
  }, [id, setLoading, setError]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" text="正在加载主题内容..." />
      </div>
    );
  }

  if (!theme) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">主题不存在</h1>
          <Link
            to="/themes"
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            返回主题列表
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${theme.coverImageUrl})`
          }}
        ></div>
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative z-10 text-center text-white px-4">
          <nav className="mb-4">
            <Link
              to="/themes"
              className="text-white/80 hover:text-white transition-colors text-sm"
            >
              主题集
            </Link>
            <span className="mx-2 text-white/60">/</span>
            <span className="text-white text-sm">{theme.name}</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {theme.name}
          </h1>
          <p className="text-xl max-w-2xl mx-auto">
            {theme.description}
          </p>
          <div className="mt-6 flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {photos.length} 张作品
            </div>
          </div>
        </div>
      </section>

      {/* Photos Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {photos.length > 0 ? (
            <MasonryGrid photos={photos} />
          ) : (
            <div className="text-center py-16">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">暂无作品</h3>
              <p className="text-gray-600">这个主题下还没有上传作品</p>
            </div>
          )}
        </div>
      </section>

      {/* Related Themes */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            其他主题
          </h2>
          <div className="flex justify-center">
            <Link
              to="/themes"
              className="bg-gray-900 text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors"
            >
              浏览所有主题
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ThemeDetailPage;