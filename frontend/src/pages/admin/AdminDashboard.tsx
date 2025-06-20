import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalPhotos: 0,
    totalThemes: 0,
    totalContacts: 0,
    featuredPhotos: 0,
  });
  const [loading, setLoading] = useState(true);
  
  const { user, logout, token } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }
    
    fetchStats();
  }, [token, navigate]);

  const fetchStats = async () => {
    try {
      // 获取照片统计
      const photosResponse = await fetch('/api/photos?size=1', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const photosData = await photosResponse.json();
      
      // 获取精选照片统计
      const featuredResponse = await fetch('/api/photos?featured=true&size=1', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const featuredData = await featuredResponse.json();

      // 获取主题统计
      const themesResponse = await fetch('/api/themes?size=1', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const themesData = await themesResponse.json();

      // 获取联系表单统计
      const contactsResponse = await fetch('/api/admin/contacts?size=1', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const contactsData = await contactsResponse.json();

      setStats({
        totalPhotos: photosData.total || 0,
        featuredPhotos: featuredData.total || 0,
        totalThemes: themesData.total || 0,
        totalContacts: contactsData.total || 0,
      });
    } catch (error) {
      console.error('获取统计数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                摄影作品集管理后台
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">欢迎，{user?.username}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                退出登录
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-medium">📷</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      总照片数
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.totalPhotos}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-medium">⭐</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      精选照片
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.featuredPhotos}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-medium">🏷️</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      主题分类
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.totalThemes}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-medium">📧</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      联系表单
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.totalContacts}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 快捷操作 */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              快捷操作
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                to="/admin/photos"
                className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">📷</span>
                  <div>
                    <h4 className="font-medium text-gray-900">照片管理</h4>
                    <p className="text-sm text-gray-500">上传、编辑和管理照片</p>
                  </div>
                </div>
              </Link>

              <Link
                to="/admin/themes"
                className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">🏷️</span>
                  <div>
                    <h4 className="font-medium text-gray-900">主题管理</h4>
                    <p className="text-sm text-gray-500">创建和管理主题分类</p>
                  </div>
                </div>
              </Link>

              <Link
                to="/admin/timeline"
                className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">⏰</span>
                  <div>
                    <h4 className="font-medium text-gray-900">时光轴管理</h4>
                    <p className="text-sm text-gray-500">管理时光轴节点和故事</p>
                  </div>
                </div>
              </Link>

              <Link
                to="/admin/contacts"
                className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">📧</span>
                  <div>
                    <h4 className="font-medium text-gray-900">联系表单</h4>
                    <p className="text-sm text-gray-500">查看和管理联系表单</p>
                  </div>
                </div>
              </Link>

              <Link
                to="/admin/settings"
                className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">⚙️</span>
                  <div>
                    <h4 className="font-medium text-gray-900">网站设置</h4>
                    <p className="text-sm text-gray-500">配置网站基本信息</p>
                  </div>
                </div>
              </Link>

              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">🌐</span>
                  <div>
                    <h4 className="font-medium text-gray-900">查看网站</h4>
                    <p className="text-sm text-gray-500">在新窗口中查看前台网站</p>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;