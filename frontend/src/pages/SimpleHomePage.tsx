import React from 'react';

const SimpleHomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
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
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              精选作品
            </h2>
            <p className="text-xl text-gray-600">
              展示我最得意的摄影作品
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="aspect-[4/3] bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">照片 {item}</span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">作品标题 {item}</h3>
                  <p className="text-gray-600 text-sm">这是一张精美的摄影作品</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default SimpleHomePage;