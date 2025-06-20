package main

import (
	"log"
	"os"

	"photography-backend/api"
	"photography-backend/common"
)

func main() {
	// 初始化数据库
	common.InitDatabase()

	// 自动迁移数据库表
	common.AutoMigrate()

	// 初始化种子数据
	common.SeedData()

	// 设置路由
	r := api.SetupRoutes()

	// 获取端口
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	log.Fatal(r.Run(":" + port))
}