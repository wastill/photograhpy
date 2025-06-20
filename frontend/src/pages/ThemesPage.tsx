import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../store';
import { themeService } from '../services/api';
import Loading from '../components/common/Loading';

const ThemesPage: React.FC = () => {
  const { themes, isLoading, setThemes, setLoading, setError } = useAppStore();

  useEffect(() => {
    const loadThemes = async () => {
      try {
        setLoading(true);
        setError(null);
        const themesData = await themeService.getThemes();
        setThemes(themesData);
      } catch (error) {
        console.error('Failed to load themes:', error);
        setError('加载主题失败');
        // 设置模拟数据
        setThemes([
          {
            id: '1',
            name: '人像摄影',
            description: '捕捉人物的神态与情感，记录生活中的真实瞬间',
            coverImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600',
            photoCount: 24
          },
          {
            id: '2',
            name: '风光摄影',
            description: '大自然的壮美景色，从山川到海洋，从日出到日落',
            coverImageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
            photoCount: 18
          },
          {
            id: '3',
            name: '街头摄影',
            description: '城市生活的真实写照，街头巷尾的人文风情',
            coverImageUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=600',
            photoCount: 32
          },
          {
            id: '4',
            name: '建筑摄影',
            description: '现代建筑的几何美学，传统建筑的历史韵味',
            coverImageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600',
            photoCount: 15
          },
          {
            id: '5',
            name: '微距摄影',
            description: '微观世界的精彩，花卉昆虫的细腻之美',
            coverImageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600',
            photoCount: 12
          },
          {
            id: '6',
            name: '商业摄影',
            description: '产品拍摄与商业广告，专业的视觉呈现',
            coverImageUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600',
            photoCount: 8
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadThemes();
  }, [setThemes, setLoading, setError]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" text="正在加载主题..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            主题集
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            按照不同的拍摄主题分类展示作品，每个主题都代表着我在摄影路上的不同探索和尝试
          </p>
        </div>

        {/* Today's Featured Theme */}
        <div className="mb-16">
          <div className="bg-gradient-to-r from-gray-900 to-gray-700 rounded-2xl p-8 text-white">
            <div className="flex items-center mb-4">
              <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-semibold mr-4">
                今日推荐
              </span>
              <span className="text-gray-300">Theme of the Day</span>
            </div>
            <h2 className="text-3xl font-bold mb-4">人像摄影</h2>
            <p className="text-gray-300 mb-6 max-w-2xl">
              人像摄影是我最热爱的领域之一。通过镜头，我试图捕捉每个人独特的神态与情感，
              记录下那些转瞬即逝却又珍贵无比的真实瞬间。
            </p>
            <Link
              to="/themes/1"
              className="inline-flex items-center bg-white text-gray-900 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              查看作品
              <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Themes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {themes.map((theme) => (
            <Link
              key={theme.id}
              to={`/themes/${theme.id}`}
              className="group block bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={theme.coverImageUrl}
                  alt={theme.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                <div className="absolute top-4 right-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm">
                  {theme.photoCount} 张
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                  {theme.name}
                </h3>
                <p className="text-gray-600 line-clamp-3">
                  {theme.description}
                </p>
                <div className="mt-4 flex items-center text-gray-500 group-hover:text-gray-700 transition-colors">
                  <span className="text-sm font-medium">查看更多</span>
                  <svg className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gray-50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              想要定制拍摄？
            </h2>
            <p className="text-gray-600 mb-6">
              如果您对某个主题特别感兴趣，或者需要专业的摄影服务，欢迎与我联系
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center bg-gray-900 text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors"
            >
              联系我
              <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemesPage;