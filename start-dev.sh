#!/bin/bash

echo "🚀 启动摄影作品集开发环境"

# 检查Docker是否运行
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker未运行，请先启动Docker"
    exit 1
fi

# 启动数据库服务
echo "📦 启动数据库服务..."
docker-compose -f docker-compose.dev.yml up -d

# 等待数据库启动
echo "⏳ 等待数据库启动..."
sleep 10

# 检查Go环境
if ! command -v go &> /dev/null; then
    echo "❌ Go未安装，请先安装Go"
    exit 1
fi

# 启动后端服务
echo "🔧 启动后端服务..."
cd backend
export PATH=$PATH:/usr/local/go/bin
go mod tidy
nohup go run main.go > ../backend.log 2>&1 &
BACKEND_PID=$!
echo "后端服务PID: $BACKEND_PID"
cd ..

# 等待后端启动
echo "⏳ 等待后端服务启动..."
sleep 5

# 检查Node.js环境
if ! command -v npm &> /dev/null; then
    echo "❌ Node.js/npm未安装，请先安装Node.js"
    exit 1
fi

# 启动前端服务
echo "🎨 启动前端服务..."
cd frontend
npm install
npm run dev &
FRONTEND_PID=$!
echo "前端服务PID: $FRONTEND_PID"
cd ..

echo ""
echo "✅ 开发环境启动完成！"
echo ""
echo "📱 访问地址："
echo "   前台网站: http://localhost:5173"
echo "   后端API: http://localhost:8080"
echo "   管理后台: http://localhost:5173/admin/login"
echo ""
echo "🔑 默认管理员账户："
echo "   用户名: admin"
echo "   密码: admin123"
echo ""
echo "📝 日志文件："
echo "   后端日志: backend.log"
echo ""
echo "🛑 停止服务："
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo "   docker-compose -f docker-compose.dev.yml down"
echo ""

# 保存PID到文件
echo "$BACKEND_PID $FRONTEND_PID" > .dev-pids

echo "按 Ctrl+C 停止所有服务"
wait