import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="font-semibold text-lg text-gray-900">摄影师作品集</span>
            </div>
            <p className="text-gray-600 text-sm">
              用镜头记录世界的美好，用光影诉说生活的故事。
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">快速导航</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                  首页
                </a>
              </li>
              <li>
                <a href="/themes" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                  主题集
                </a>
              </li>
              <li>
                <a href="/timeline" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                  时光轴
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                  关于我
                </a>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">关注我</h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323c.875-.875 2.026-1.297 3.323-1.297s2.448.422 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.244c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.781c-.49 0-.875-.385-.875-.875s.385-.875.875-.875.875.385.875.875-.385.875-.875.875zm0 0"/>
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="微博"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9.331 14.644c-1.102 0-1.996-.894-1.996-1.996s.894-1.996 1.996-1.996 1.996.894 1.996 1.996-.894 1.996-1.996 1.996zm4.659-3.325c-.552 0-1-.448-1-1s.448-1 1-1 1 .448 1 1-.448 1-1 1z"/>
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="500px"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7.439 9.01c-.44 0-.799.359-.799.799 0 .44.359.799.799.799.44 0 .799-.359.799-.799 0-.44-.359-.799-.799-.799zm8.988 0c-.44 0-.799.359-.799.799 0 .44.359.799.799.799.44 0 .799-.359.799-.799 0-.44-.359-.799-.799-.799z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">
              © {currentYear} 摄影师作品集. 保留所有权利.
            </p>
            <div className="mt-4 md:mt-0">
              <p className="text-gray-600 text-sm">
                用心记录，用爱分享
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;