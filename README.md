# 摄影师个人作品集网站

这是一个基于React + Go的全栈摄影作品集网站，包含前台展示和后台管理功能。

## 项目架构

```
photography/
├── frontend/          # React前端应用
│   ├── src/
│   │   ├── components/    # 组件
│   │   ├── pages/         # 页面
│   │   ├── store/         # 状态管理
│   │   └── services/      # API服务
│   ├── Dockerfile
│   └── nginx.conf
├── backend/           # Go后端API
│   ├── api/              # API处理器
│   ├── common/           # 公共工具
│   ├── model/            # 数据模型
│   ├── main.go
│   └── Dockerfile
├── scripts/           # 数据库脚本
├── docker-compose.yml     # 生产环境
├── docker-compose.dev.yml # 开发环境
└── README.md
```

## 技术栈

### 前端
- **React 18** + TypeScript
- **Vite** 构建工具
- **Tailwind CSS** 样式框架
- **React Router** 路由管理
- **Zustand** 状态管理
- **Nginx** 静态文件服务

### 后端
- **Go 1.21** + Gin框架
- **PostgreSQL** 数据库
- **Redis** 缓存
- **GORM** ORM框架
- **JWT** 身份认证

### 部署
- **Docker** + Docker Compose
- **Nginx** 反向代理
- 支持云原生部署

## 功能特性

### 前台功能
- ✅ 首页精选作品展示（瀑布流布局）
- ✅ 主题分类浏览
- ✅ 时光轴故事展示
- ✅ 关于我页面
- ✅ 联系表单
- ✅ 响应式设计
- ✅ 图片懒加载

### 后台管理
- ✅ 管理员登录认证
- ✅ 照片上传和管理
- ✅ 主题分类管理
- ✅ 时光轴节点管理
- ✅ 联系表单查看
- ✅ 网站设置配置
- ✅ 数据统计面板

### API功能
- ✅ RESTful API设计
- ✅ JWT身份认证
- ✅ 分页查询
- ✅ 数据验证
- ✅ 错误处理
- ✅ CORS支持

## 快速开始

### 开发环境

1. **启动数据库服务**
```bash
docker-compose -f docker-compose.dev.yml up -d
```

2. **启动后端服务**
```bash
cd backend
go mod tidy
go run main.go
```

3. **启动前端服务**
```bash
cd frontend
npm install
npm run dev
```

4. **访问应用**
- 前台网站: http://localhost:5173
- 后端API: http://localhost:8080
- 管理后台: http://localhost:5173/admin/login

### 生产环境

1. **一键部署**
```bash
docker-compose up -d
```

2. **访问应用**
- 前台网站: http://localhost
- 管理后台: http://localhost/admin/login

## 默认账户

- **管理员账户**: admin / admin123

## 环境变量

### 后端环境变量 (.env)
```env
# 数据库配置
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=photography

# JWT配置
JWT_SECRET=your-secret-key

# 服务器配置
PORT=8080
```

### 前端环境变量 (.env)
```env
VITE_API_URL=http://localhost:8080/api
```

## API文档

### 公开API
- `GET /api/photos` - 获取照片列表
- `GET /api/photos/featured` - 获取精选照片
- `GET /api/themes` - 获取主题列表
- `GET /api/timeline` - 获取时光轴
- `POST /api/contact` - 提交联系表单
- `POST /api/auth/login` - 用户登录

### 管理员API (需要认证)
- `POST /api/admin/photos` - 创建照片
- `PUT /api/admin/photos/:id` - 更新照片
- `DELETE /api/admin/photos/:id` - 删除照片
- `POST /api/admin/themes` - 创建主题
- `GET /api/admin/contacts` - 获取联系表单

## 数据库设计

### 主要表结构
- `photos` - 照片信息
- `themes` - 主题分类
- `timeline_nodes` - 时光轴节点
- `photo_themes` - 照片主题关联
- `contacts` - 联系表单
- `users` - 用户信息
- `settings` - 网站设置

## 开发指南

### 添加新功能
1. 后端: 在 `api/` 目录添加处理器
2. 前端: 在 `pages/` 目录添加页面组件
3. 更新路由配置

### 数据库迁移
```bash
# 后端会自动执行数据库迁移
go run main.go
```

### 构建部署
```bash
# 构建Docker镜像
docker-compose build

# 启动服务
docker-compose up -d
```

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request！

## 联系方式

如有问题，请通过以下方式联系：
- Email: your-email@example.com
- GitHub: https://github.com/your-username/photography