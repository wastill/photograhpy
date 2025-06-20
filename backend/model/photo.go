package model

import (
	"time"
	"database/sql/driver"
	"encoding/json"
	"errors"
)

// JSONB 类型用于存储 EXIF 数据
type JSONB map[string]interface{}

func (j JSONB) Value() (driver.Value, error) {
	return json.Marshal(j)
}

func (j *JSONB) Scan(value interface{}) error {
	if value == nil {
		*j = make(map[string]interface{})
		return nil
	}
	
	bytes, ok := value.([]byte)
	if !ok {
		return errors.New("type assertion to []byte failed")
	}
	
	return json.Unmarshal(bytes, j)
}

// Photo 照片模型
type Photo struct {
	ID                uint      `json:"id" gorm:"primaryKey"`
	Title             string    `json:"title" gorm:"size:255;not null"`
	Description       string    `json:"description" gorm:"type:text"`
	OSSKeyOriginal    string    `json:"oss_key_original" gorm:"size:500;not null"`
	OSSKeyThumbnail   string    `json:"oss_key_thumbnail" gorm:"size:500"`
	OSSKeyMedium      string    `json:"oss_key_medium" gorm:"size:500"`
	ExifData          JSONB     `json:"exif_data" gorm:"type:jsonb"`
	IsFeatured        bool      `json:"is_featured" gorm:"default:false"`
	TimelineNodeID    *uint     `json:"timeline_node_id" gorm:"index"`
	Status            string    `json:"status" gorm:"size:20;default:'pending'"` // pending, processed, error
	TakenAt           *time.Time `json:"taken_at"`
	CreatedAt         time.Time `json:"created_at"`
	UpdatedAt         time.Time `json:"updated_at"`
	
	// 关联关系
	TimelineNode      *TimelineNode `json:"timeline_node,omitempty" gorm:"foreignKey:TimelineNodeID"`
	Themes            []Theme       `json:"themes,omitempty" gorm:"many2many:photo_themes;"`
}

// PhotoTheme 照片和主题的多对多关系表
type PhotoTheme struct {
	PhotoID uint `json:"photo_id" gorm:"primaryKey"`
	ThemeID uint `json:"theme_id" gorm:"primaryKey"`
}

// Theme 主题模型
type Theme struct {
	ID              uint      `json:"id" gorm:"primaryKey"`
	Name            string    `json:"name" gorm:"size:100;not null;uniqueIndex"`
	Description     string    `json:"description" gorm:"type:text"`
	CoverImageID    *uint     `json:"cover_image_id" gorm:"index"`
	SortOrder       int       `json:"sort_order" gorm:"default:0"`
	IsActive        bool      `json:"is_active" gorm:"default:true"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
	
	// 关联关系
	CoverImage      *Photo    `json:"cover_image,omitempty" gorm:"foreignKey:CoverImageID"`
	Photos          []Photo   `json:"photos,omitempty" gorm:"many2many:photo_themes;"`
}

// TimelineNode 时光轴节点模型
type TimelineNode struct {
	ID           uint      `json:"id" gorm:"primaryKey"`
	Title        string    `json:"title" gorm:"size:255;not null"`
	PeriodStart  time.Time `json:"period_start" gorm:"not null"`
	PeriodEnd    time.Time `json:"period_end" gorm:"not null"`
	StoryContent string    `json:"story_content" gorm:"type:text"`
	SortOrder    int       `json:"sort_order" gorm:"default:0"`
	IsActive     bool      `json:"is_active" gorm:"default:true"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
	
	// 关联关系
	Photos       []Photo   `json:"photos,omitempty" gorm:"foreignKey:TimelineNodeID"`
}

// Contact 联系表单模型
type Contact struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	Name      string    `json:"name" gorm:"size:100;not null"`
	Email     string    `json:"email" gorm:"size:255;not null"`
	Subject   string    `json:"subject" gorm:"size:255;not null"`
	Message   string    `json:"message" gorm:"type:text;not null"`
	IsRead    bool      `json:"is_read" gorm:"default:false"`
	CreatedAt time.Time `json:"created_at"`
}

// User 用户模型（管理员）
type User struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	Username  string    `json:"username" gorm:"size:50;not null;uniqueIndex"`
	Email     string    `json:"email" gorm:"size:255;not null;uniqueIndex"`
	Password  string    `json:"-" gorm:"size:255;not null"` // 不在JSON中返回密码
	Role      string    `json:"role" gorm:"size:20;default:'admin'"`
	IsActive  bool      `json:"is_active" gorm:"default:true"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// Settings 网站设置模型
type Settings struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	Key         string    `json:"key" gorm:"size:100;not null;uniqueIndex"`
	Value       string    `json:"value" gorm:"type:text"`
	Description string    `json:"description" gorm:"size:255"`
	UpdatedAt   time.Time `json:"updated_at"`
}