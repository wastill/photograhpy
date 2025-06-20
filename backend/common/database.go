package common

import (
	"fmt"
	"log"
	"os"
	"time"

	"photography-backend/model"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

// DatabaseConfig 数据库配置
type DatabaseConfig struct {
	Host     string
	Port     string
	User     string
	Password string
	DBName   string
	SSLMode  string
}

// InitDatabase 初始化数据库连接
func InitDatabase() {
	config := DatabaseConfig{
		Host:     getEnv("DB_HOST", "localhost"),
		Port:     getEnv("DB_PORT", "5432"),
		User:     getEnv("DB_USER", "postgres"),
		Password: getEnv("DB_PASSWORD", "password"),
		DBName:   getEnv("DB_NAME", "photography"),
		SSLMode:  getEnv("DB_SSLMODE", "disable"),
	}

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s TimeZone=Asia/Shanghai",
		config.Host, config.User, config.Password, config.DBName, config.Port, config.SSLMode)

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})

	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// 配置连接池
	sqlDB, err := DB.DB()
	if err != nil {
		log.Fatal("Failed to get database instance:", err)
	}

	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(100)
	sqlDB.SetConnMaxLifetime(time.Hour)

	log.Println("Database connected successfully")
}

// AutoMigrate 自动迁移数据库表
func AutoMigrate() {
	err := DB.AutoMigrate(
		&model.Photo{},
		&model.Theme{},
		&model.TimelineNode{},
		&model.Contact{},
		&model.User{},
		&model.Settings{},
		&model.PhotoTheme{},
	)

	if err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	log.Println("Database migration completed")
}

// SeedData 初始化数据
func SeedData() {
	// 创建默认管理员用户
	var userCount int64
	DB.Model(&model.User{}).Count(&userCount)
	
	if userCount == 0 {
		hashedPassword, _ := HashPassword("admin123")
		admin := model.User{
			Username: "admin",
			Email:    "admin@photography.com",
			Password: hashedPassword,
			Role:     "admin",
			IsActive: true,
		}
		DB.Create(&admin)
		log.Println("Default admin user created")
	}

	// 创建默认主题
	var themeCount int64
	DB.Model(&model.Theme{}).Count(&themeCount)
	
	if themeCount == 0 {
		themes := []model.Theme{
			{Name: "人像摄影", Description: "专业人像摄影作品", SortOrder: 1},
			{Name: "风光摄影", Description: "自然风光摄影作品", SortOrder: 2},
			{Name: "街头摄影", Description: "街头纪实摄影作品", SortOrder: 3},
			{Name: "商业摄影", Description: "商业产品摄影作品", SortOrder: 4},
			{Name: "建筑摄影", Description: "建筑空间摄影作品", SortOrder: 5},
		}
		
		for _, theme := range themes {
			DB.Create(&theme)
		}
		log.Println("Default themes created")
	}

	// 创建默认设置
	var settingsCount int64
	DB.Model(&model.Settings{}).Count(&settingsCount)
	
	if settingsCount == 0 {
		settings := []model.Settings{
			{Key: "site_title", Value: "摄影师作品集", Description: "网站标题"},
			{Key: "site_description", Value: "专业摄影师个人作品展示网站", Description: "网站描述"},
			{Key: "photographer_name", Value: "张三", Description: "摄影师姓名"},
			{Key: "photographer_bio", Value: "专业摄影师，专注于人像和风光摄影", Description: "摄影师简介"},
			{Key: "contact_email", Value: "contact@photography.com", Description: "联系邮箱"},
			{Key: "featured_theme_id", Value: "1", Description: "每日推荐主题ID"},
		}
		
		for _, setting := range settings {
			DB.Create(&setting)
		}
		log.Println("Default settings created")
	}
}

// getEnv 获取环境变量，如果不存在则返回默认值
func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}