import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          摄影师作品集
        </h1>
        <p className="text-xl text-gray-600">
          网站正在开发中...
        </p>
        <div className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-2">精选作品</h3>
              <p className="text-gray-600">展示最佳摄影作品</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-2">主题集</h3>
              <p className="text-gray-600">按主题分类浏览</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-2">时光轴</h3>
              <p className="text-gray-600">摄影历程回顾</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
