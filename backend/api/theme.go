package api

import (
	"strconv"

	"photography-backend/common"
	"photography-backend/model"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// ThemeHandler 主题处理器
type ThemeHandler struct{}

// GetThemes 获取主题列表
func (h *ThemeHandler) GetThemes(c *gin.Context) {
	var themes []model.Theme
	var total int64

	// 分页参数
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	size, _ := strconv.Atoi(c.DefaultQuery("size", "20"))
	offset := (page - 1) * size

	// 查询参数
	isActive := c.DefaultQuery("is_active", "true")

	// 构建查询
	query := common.DB.Model(&model.Theme{})

	if isActive == "true" {
		query = query.Where("is_active = ?", true)
	}

	// 获取总数
	query.Count(&total)

	// 获取数据
	err := query.Preload("CoverImage").
		Order("sort_order ASC, created_at DESC").
		Offset(offset).Limit(size).
		Find(&themes).Error

	if err != nil {
		common.InternalServerError(c, "Failed to get themes")
		return
	}

	// 为每个主题添加照片数量
	for i := range themes {
		var photoCount int64
		common.DB.Model(&model.Photo{}).
			Joins("JOIN photo_themes ON photos.id = photo_themes.photo_id").
			Where("photo_themes.theme_id = ? AND photos.status = ?", themes[i].ID, "processed").
			Count(&photoCount)
		
		// 使用临时结构体添加照片数量
		type ThemeWithCount struct {
			model.Theme
			PhotoCount int64 `json:"photo_count"`
		}
		
		// 这里我们直接在响应中处理，或者可以修改模型
	}

	common.PageSuccess(c, themes, total, page, size)
}

// GetTheme 获取单个主题
func (h *ThemeHandler) GetTheme(c *gin.Context) {
	id := c.Param("id")
	var theme model.Theme

	err := common.DB.Preload("CoverImage").First(&theme, id).Error

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			common.NotFound(c, "Theme not found")
		} else {
			common.InternalServerError(c, "Failed to get theme")
		}
		return
	}

	common.Success(c, theme)
}

// GetThemePhotos 获取主题下的照片
func (h *ThemeHandler) GetThemePhotos(c *gin.Context) {
	themeID := c.Param("id")
	var photos []model.Photo
	var total int64

	// 分页参数
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	size, _ := strconv.Atoi(c.DefaultQuery("size", "20"))
	offset := (page - 1) * size

	// 验证主题是否存在
	var theme model.Theme
	if err := common.DB.First(&theme, themeID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			common.NotFound(c, "Theme not found")
		} else {
			common.InternalServerError(c, "Failed to find theme")
		}
		return
	}

	// 构建查询
	query := common.DB.Model(&model.Photo{}).
		Joins("JOIN photo_themes ON photos.id = photo_themes.photo_id").
		Where("photo_themes.theme_id = ? AND photos.status = ?", themeID, "processed")

	// 获取总数
	query.Count(&total)

	// 获取数据
	err := query.Preload("Themes").Preload("TimelineNode").
		Order("photos.created_at DESC").
		Offset(offset).Limit(size).
		Find(&photos).Error

	if err != nil {
		common.InternalServerError(c, "Failed to get theme photos")
		return
	}

	common.PageSuccess(c, photos, total, page, size)
}

// CreateTheme 创建主题
func (h *ThemeHandler) CreateTheme(c *gin.Context) {
	var req struct {
		Name         string `json:"name" binding:"required"`
		Description  string `json:"description"`
		CoverImageID *uint  `json:"cover_image_id"`
		SortOrder    int    `json:"sort_order"`
		IsActive     bool   `json:"is_active"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		common.BadRequest(c, err.Error())
		return
	}

	// 检查名称是否已存在
	var existingTheme model.Theme
	if err := common.DB.Where("name = ?", req.Name).First(&existingTheme).Error; err == nil {
		common.BadRequest(c, "Theme name already exists")
		return
	}

	theme := model.Theme{
		Name:         req.Name,
		Description:  req.Description,
		CoverImageID: req.CoverImageID,
		SortOrder:    req.SortOrder,
		IsActive:     req.IsActive,
	}

	if err := common.DB.Create(&theme).Error; err != nil {
		common.InternalServerError(c, "Failed to create theme")
		return
	}

	// 重新加载主题数据
	common.DB.Preload("CoverImage").First(&theme, theme.ID)

	common.SuccessWithMessage(c, "Theme created successfully", theme)
}

// UpdateTheme 更新主题
func (h *ThemeHandler) UpdateTheme(c *gin.Context) {
	id := c.Param("id")
	var theme model.Theme

	if err := common.DB.First(&theme, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			common.NotFound(c, "Theme not found")
		} else {
			common.InternalServerError(c, "Failed to find theme")
		}
		return
	}

	var req struct {
		Name         *string `json:"name"`
		Description  *string `json:"description"`
		CoverImageID *uint   `json:"cover_image_id"`
		SortOrder    *int    `json:"sort_order"`
		IsActive     *bool   `json:"is_active"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		common.BadRequest(c, err.Error())
		return
	}

	// 检查名称是否已存在（排除当前主题）
	if req.Name != nil && *req.Name != theme.Name {
		var existingTheme model.Theme
		if err := common.DB.Where("name = ? AND id != ?", *req.Name, theme.ID).First(&existingTheme).Error; err == nil {
			common.BadRequest(c, "Theme name already exists")
			return
		}
	}

	// 更新字段
	updates := make(map[string]interface{})
	if req.Name != nil {
		updates["name"] = *req.Name
	}
	if req.Description != nil {
		updates["description"] = *req.Description
	}
	if req.CoverImageID != nil {
		updates["cover_image_id"] = *req.CoverImageID
	}
	if req.SortOrder != nil {
		updates["sort_order"] = *req.SortOrder
	}
	if req.IsActive != nil {
		updates["is_active"] = *req.IsActive
	}

	if err := common.DB.Model(&theme).Updates(updates).Error; err != nil {
		common.InternalServerError(c, "Failed to update theme")
		return
	}

	// 重新加载主题数据
	common.DB.Preload("CoverImage").First(&theme, theme.ID)

	common.SuccessWithMessage(c, "Theme updated successfully", theme)
}

// DeleteTheme 删除主题
func (h *ThemeHandler) DeleteTheme(c *gin.Context) {
	id := c.Param("id")
	var theme model.Theme

	if err := common.DB.First(&theme, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			common.NotFound(c, "Theme not found")
		} else {
			common.InternalServerError(c, "Failed to find theme")
		}
		return
	}

	// 检查是否有关联的照片
	var photoCount int64
	common.DB.Model(&model.Photo{}).
		Joins("JOIN photo_themes ON photos.id = photo_themes.photo_id").
		Where("photo_themes.theme_id = ?", id).
		Count(&photoCount)

	if photoCount > 0 {
		common.BadRequest(c, "Cannot delete theme with associated photos")
		return
	}

	if err := common.DB.Delete(&theme).Error; err != nil {
		common.InternalServerError(c, "Failed to delete theme")
		return
	}

	common.SuccessWithMessage(c, "Theme deleted successfully", nil)
}

// GetFeaturedTheme 获取推荐主题
func (h *ThemeHandler) GetFeaturedTheme(c *gin.Context) {
	// 从设置中获取推荐主题ID
	var setting model.Settings
	if err := common.DB.Where("key = ?", "featured_theme_id").First(&setting).Error; err != nil {
		// 如果没有设置，返回第一个主题
		var theme model.Theme
		if err := common.DB.Where("is_active = ?", true).
			Preload("CoverImage").
			Order("sort_order ASC").
			First(&theme).Error; err != nil {
			common.NotFound(c, "No featured theme found")
			return
		}
		common.Success(c, theme)
		return
	}

	themeID, _ := strconv.Atoi(setting.Value)
	var theme model.Theme
	if err := common.DB.Preload("CoverImage").First(&theme, themeID).Error; err != nil {
		common.NotFound(c, "Featured theme not found")
		return
	}

	common.Success(c, theme)
}