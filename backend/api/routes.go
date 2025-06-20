package api

import (
	"photography-backend/common"

	"github.com/gin-gonic/gin"
)

// SetupRoutes 设置路由
func SetupRoutes() *gin.Engine {
	// 设置Gin模式
	gin.SetMode(gin.ReleaseMode)

	r := gin.New()

	// 中间件
	r.Use(common.LoggerMiddleware())
	r.Use(gin.Recovery())
	r.Use(common.CORS())

	// 初始化处理器
	photoHandler := &PhotoHandler{}
	themeHandler := &ThemeHandler{}
	timelineHandler := &TimelineHandler{}
	contactHandler := &ContactHandler{}
	authHandler := &AuthHandler{}
	settingsHandler := &SettingsHandler{}

	// 公开API路由
	api := r.Group("/api")
	{
		// 照片相关
		api.GET("/photos", photoHandler.GetPhotos)
		api.GET("/photos/:id", photoHandler.GetPhoto)
		api.GET("/photos/featured", photoHandler.GetFeaturedPhotos)

		// 主题相关
		api.GET("/themes", themeHandler.GetThemes)
		api.GET("/themes/:id", themeHandler.GetTheme)
		api.GET("/themes/:id/photos", themeHandler.GetThemePhotos)
		api.GET("/themes/featured", themeHandler.GetFeaturedTheme)

		// 时光轴相关
		api.GET("/timeline", timelineHandler.GetTimeline)
		api.GET("/timeline/nodes", timelineHandler.GetTimelineNodes)
		api.GET("/timeline/nodes/:id", timelineHandler.GetTimelineNode)
		api.GET("/timeline/nodes/:id/photos", timelineHandler.GetTimelineNodePhotos)

		// 联系表单
		api.POST("/contact", contactHandler.SubmitContact)

		// 公开设置
		api.GET("/settings/public", settingsHandler.GetPublicSettings)

		// 认证相关
		api.POST("/auth/login", authHandler.Login)
	}

	// 需要认证的API路由
	authAPI := r.Group("/api")
	authAPI.Use(common.AuthMiddleware())
	{
		// 用户信息
		authAPI.GET("/auth/profile", authHandler.GetProfile)
		authAPI.PUT("/auth/profile", authHandler.UpdateProfile)
		authAPI.POST("/auth/change-password", authHandler.ChangePassword)
	}

	// 管理员API路由
	adminAPI := r.Group("/api/admin")
	adminAPI.Use(common.AuthMiddleware())
	adminAPI.Use(common.AdminMiddleware())
	{
		// 照片管理
		adminAPI.POST("/photos", photoHandler.CreatePhoto)
		adminAPI.PUT("/photos/:id", photoHandler.UpdatePhoto)
		adminAPI.DELETE("/photos/:id", photoHandler.DeletePhoto)

		// 主题管理
		adminAPI.POST("/themes", themeHandler.CreateTheme)
		adminAPI.PUT("/themes/:id", themeHandler.UpdateTheme)
		adminAPI.DELETE("/themes/:id", themeHandler.DeleteTheme)

		// 时光轴管理
		adminAPI.POST("/timeline/nodes", timelineHandler.CreateTimelineNode)
		adminAPI.PUT("/timeline/nodes/:id", timelineHandler.UpdateTimelineNode)
		adminAPI.DELETE("/timeline/nodes/:id", timelineHandler.DeleteTimelineNode)

		// 联系表单管理
		adminAPI.GET("/contacts", contactHandler.GetContacts)
		adminAPI.GET("/contacts/:id", contactHandler.GetContact)
		adminAPI.PUT("/contacts/:id/read", contactHandler.MarkContactAsRead)
		adminAPI.DELETE("/contacts/:id", contactHandler.DeleteContact)

		// 设置管理
		adminAPI.GET("/settings", settingsHandler.GetSettings)
		adminAPI.GET("/settings/:key", settingsHandler.GetSetting)
		adminAPI.PUT("/settings/:key", settingsHandler.UpdateSetting)
		adminAPI.PUT("/settings", settingsHandler.UpdateSettings)
		adminAPI.DELETE("/settings/:key", settingsHandler.DeleteSetting)
	}

	// 健康检查
	r.GET("/health", func(c *gin.Context) {
		common.Success(c, gin.H{
			"status":  "ok",
			"service": "photography-backend",
		})
	})

	return r
}