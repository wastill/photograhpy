import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            关于我
          </h1>
          <p className="text-xl text-gray-600">
            用镜头记录世界，用心感受生活
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          {/* Profile Image */}
          <div className="lg:col-span-1">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop"
                alt="摄影师头像"
                className="w-full rounded-2xl shadow-lg"
              />
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-12 h-12 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">我的故事</h2>
              <div className="prose prose-lg text-gray-600 space-y-4">
                <p>
                  你好，我是一名专业摄影师，从事摄影工作已有8年时间。我的摄影之路始于大学时期，
                  那时候拿着一台入门级的单反相机，在校园里到处拍摄，从此便深深爱上了这门艺术。
                </p>
                <p>
                  我相信每一张照片都有它独特的故事。无论是街头巷尾的人文风情，还是大自然的壮美景色，
                  亦或是人物肖像中流露出的真挚情感，我都试图通过镜头捕捉那些转瞬即逝却又珍贵无比的瞬间。
                </p>
                <p>
                  摄影对我来说不仅仅是一份工作，更是一种生活方式。它让我学会了观察，学会了等待，
                  学会了在平凡中发现美好。我希望通过我的作品，能够与更多的人分享这份美好。
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">摄影理念</h3>
              <p className="text-gray-600">
                "真实胜过完美，情感重于技巧。" 我始终坚持用最真实的方式记录世界，
                用最真挚的情感感动观者。每一次按下快门，都是对美好瞬间的致敬。
              </p>
            </div>
          </div>
        </div>

        {/* Skills & Equipment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">专业技能</h2>
            <div className="space-y-4">
              {[
                { skill: '人像摄影', level: 95 },
                { skill: '风光摄影', level: 90 },
                { skill: '街头摄影', level: 88 },
                { skill: '商业摄影', level: 85 },
                { skill: '后期处理', level: 92 },
                { skill: '视频拍摄', level: 80 }
              ].map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700 font-medium">{item.skill}</span>
                    <span className="text-gray-500">{item.level}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gray-900 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${item.level}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">主要器材</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-gray-900 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-gray-900">Canon EOS R5</h4>
                  <p className="text-gray-600 text-sm">主力机身，4500万像素全画幅</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-gray-900 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-gray-900">Sony A7R IV</h4>
                  <p className="text-gray-600 text-sm">备用机身，6100万像素</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-gray-900 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-gray-900">Canon RF 24-70mm f/2.8L</h4>
                  <p className="text-gray-600 text-sm">万能标准变焦镜头</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-gray-900 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-gray-900">Canon RF 85mm f/1.2L</h4>
                  <p className="text-gray-600 text-sm">人像拍摄首选</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-gray-900 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-gray-900">Canon RF 16-35mm f/2.8L</h4>
                  <p className="text-gray-600 text-sm">风光与建筑摄影</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">荣誉与成就</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">国际摄影大赛</h3>
              <p className="text-gray-600">2023年度最佳人像摄影奖</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="w-16 h-16 bg-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">个人展览</h3>
              <p className="text-gray-600">在市美术馆举办个人摄影展</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="w-16 h-16 bg-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">出版作品</h3>
              <p className="text-gray-600">摄影作品集《光影人生》</p>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center bg-gray-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            让我们一起创造美好
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            如果您对我的作品感兴趣，或者需要专业的摄影服务，
            欢迎随时与我联系。我很期待与您合作，共同创造出令人难忘的作品。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-gray-900 text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors"
            >
              联系我
            </a>
            <a
              href="/themes"
              className="border border-gray-900 text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-900 hover:text-white transition-colors"
            >
              查看作品
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;