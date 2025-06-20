import React from 'react';

const TimelinePage: React.FC = () => {
  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            时光轴
          </h1>
          <p className="text-xl text-gray-600">
            记录我的摄影成长历程，每个阶段都有不同的故事
          </p>
        </div>

        {/* Coming Soon */}
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">即将上线</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            时光轴功能正在开发中，将会以时间线的形式展示我的摄影历程，
            包括不同时期的创作风格变化、重要作品和成长故事。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/"
              className="bg-gray-900 text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors"
            >
              返回首页
            </a>
            <a
              href="/themes"
              className="border border-gray-900 text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-900 hover:text-white transition-colors"
            >
              浏览主题集
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelinePage;