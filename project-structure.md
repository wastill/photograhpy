# 摄影作品集网站项目结构

## 目录结构
```
photograhpy/
├── frontend/                 # React前端应用
│   ├── src/
│   │   ├── components/      # 可复用组件
│   │   ├── pages/          # 页面组件
│   │   ├── hooks/          # 自定义hooks
│   │   ├── services/       # API服务
│   │   ├── store/          # 状态管理
│   │   ├── utils/          # 工具函数
│   │   └── styles/         # 样式文件
│   ├── public/
│   └── package.json
├── backend/                  # Go后端服务
│   ├── api/                # API网关
│   ├── rpc/                # RPC服务
│   │   ├── photo/          # 照片服务
│   │   ├── theme/          # 主题服务
│   │   └── timeline/       # 时光轴服务
│   ├── common/             # 公共代码
│   ├── model/              # 数据模型
│   └── docker-compose.yml  # 开发环境
├── docs/                    # 文档
├── scripts/                 # 部署脚本
└── README.md
```

## 技术栈
- 前端: React 18 + TypeScript + Vite + TailwindCSS
- 后端: Go + GoZero + PostgreSQL + Redis
- 部署: Docker + Docker Compose