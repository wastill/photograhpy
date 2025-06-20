#!/bin/bash

echo "🛑 停止摄影作品集开发环境"

# 停止前后端服务
if [ -f .dev-pids ]; then
    PIDS=$(cat .dev-pids)
    echo "停止服务进程: $PIDS"
    kill $PIDS 2>/dev/null || true
    rm .dev-pids
fi

# 停止数据库服务
echo "📦 停止数据库服务..."
docker-compose -f docker-compose.dev.yml down

# 清理日志文件
if [ -f backend.log ]; then
    rm backend.log
fi

echo "✅ 开发环境已停止"