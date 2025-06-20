package api

import (
	"strconv"

	"photography-backend/common"
	"photography-backend/model"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// PhotoHandler 照片处理器
type PhotoHandler struct{}

// GetPhotos 获取照片列表
func (h *PhotoHandler) GetPhotos(c *gin.Context) {
	var photos []model.Photo
	var total int64

	// 分页参数
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	size, _ := strconv.Atoi(c.DefaultQuery("size", "20"))
	offset := (page - 1) * size

	// 查询参数
	featured := c.Query("featured")
	themeID := c.Query("theme_id")
	timelineNodeID := c.Query("timeline_node_id")
	status := c.DefaultQuery("status", "processed")

	// 构建查询
	query := common.DB.Model(&model.Photo{}).Where("status = ?", status)

	if featured == "true" {
		query = query.Where("is_featured = ?", true)
	}

	if themeID != "" {
		query = query.Joins("JOIN photo_themes ON photos.id = photo_themes.photo_id").
			Where("photo_themes.theme_id = ?", themeID)
	}

	if timelineNodeID != "" {
		query = query.Where("timeline_node_id = ?", timelineNodeID)
	}

	// 获取总数
	query.Count(&total)

	// 获取数据
	err := query.Preload("Themes").Preload("TimelineNode").
		Order("created_at DESC").
		Offset(offset).Limit(size).
		Find(&photos).Error

	if err != nil {
		common.InternalServerError(c, "Failed to get photos")
		return
	}

	common.PageSuccess(c, photos, total, page, size)
}

// GetPhoto 获取单个照片
func (h *PhotoHandler) GetPhoto(c *gin.Context) {
	id := c.Param("id")
	var photo model.Photo

	err := common.DB.Preload("Themes").Preload("TimelineNode").
		First(&photo, id).Error

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			common.NotFound(c, "Photo not found")
		} else {
			common.InternalServerError(c, "Failed to get photo")
		}
		return
	}

	common.Success(c, photo)
}

// CreatePhoto 创建照片
func (h *PhotoHandler) CreatePhoto(c *gin.Context) {
	var req struct {
		Title           string   `json:"title" binding:"required"`
		Description     string   `json:"description"`
		OSSKeyOriginal  string   `json:"oss_key_original" binding:"required"`
		IsFeatured      bool     `json:"is_featured"`
		TimelineNodeID  *uint    `json:"timeline_node_id"`
		ThemeIDs        []uint   `json:"theme_ids"`
		TakenAt         *string  `json:"taken_at"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		common.BadRequest(c, err.Error())
		return
	}

	photo := model.Photo{
		Title:          req.Title,
		Description:    req.Description,
		OSSKeyOriginal: req.OSSKeyOriginal,
		IsFeatured:     req.IsFeatured,
		TimelineNodeID: req.TimelineNodeID,
		Status:         "pending",
	}

	// 解析拍摄时间
	if req.TakenAt != nil && *req.TakenAt != "" {
		// 这里可以添加时间解析逻辑
	}

	// 开始事务
	tx := common.DB.Begin()

	// 创建照片
	if err := tx.Create(&photo).Error; err != nil {
		tx.Rollback()
		common.InternalServerError(c, "Failed to create photo")
		return
	}

	// 关联主题
	if len(req.ThemeIDs) > 0 {
		var themes []model.Theme
		if err := tx.Where("id IN ?", req.ThemeIDs).Find(&themes).Error; err != nil {
			tx.Rollback()
			common.InternalServerError(c, "Failed to find themes")
			return
		}

		if err := tx.Model(&photo).Association("Themes").Append(themes); err != nil {
			tx.Rollback()
			common.InternalServerError(c, "Failed to associate themes")
			return
		}
	}

	tx.Commit()

	// 重新加载照片数据
	common.DB.Preload("Themes").Preload("TimelineNode").First(&photo, photo.ID)

	common.SuccessWithMessage(c, "Photo created successfully", photo)
}

// UpdatePhoto 更新照片
func (h *PhotoHandler) UpdatePhoto(c *gin.Context) {
	id := c.Param("id")
	var photo model.Photo

	if err := common.DB.First(&photo, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			common.NotFound(c, "Photo not found")
		} else {
			common.InternalServerError(c, "Failed to find photo")
		}
		return
	}

	var req struct {
		Title           *string  `json:"title"`
		Description     *string  `json:"description"`
		IsFeatured      *bool    `json:"is_featured"`
		TimelineNodeID  *uint    `json:"timeline_node_id"`
		ThemeIDs        []uint   `json:"theme_ids"`
		Status          *string  `json:"status"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		common.BadRequest(c, err.Error())
		return
	}

	// 开始事务
	tx := common.DB.Begin()

	// 更新字段
	updates := make(map[string]interface{})
	if req.Title != nil {
		updates["title"] = *req.Title
	}
	if req.Description != nil {
		updates["description"] = *req.Description
	}
	if req.IsFeatured != nil {
		updates["is_featured"] = *req.IsFeatured
	}
	if req.TimelineNodeID != nil {
		updates["timeline_node_id"] = *req.TimelineNodeID
	}
	if req.Status != nil {
		updates["status"] = *req.Status
	}

	if err := tx.Model(&photo).Updates(updates).Error; err != nil {
		tx.Rollback()
		common.InternalServerError(c, "Failed to update photo")
		return
	}

	// 更新主题关联
	if req.ThemeIDs != nil {
		// 清除现有关联
		if err := tx.Model(&photo).Association("Themes").Clear(); err != nil {
			tx.Rollback()
			common.InternalServerError(c, "Failed to clear theme associations")
			return
		}

		// 添加新关联
		if len(req.ThemeIDs) > 0 {
			var themes []model.Theme
			if err := tx.Where("id IN ?", req.ThemeIDs).Find(&themes).Error; err != nil {
				tx.Rollback()
				common.InternalServerError(c, "Failed to find themes")
				return
			}

			if err := tx.Model(&photo).Association("Themes").Append(themes); err != nil {
				tx.Rollback()
				common.InternalServerError(c, "Failed to associate themes")
				return
			}
		}
	}

	tx.Commit()

	// 重新加载照片数据
	common.DB.Preload("Themes").Preload("TimelineNode").First(&photo, photo.ID)

	common.SuccessWithMessage(c, "Photo updated successfully", photo)
}

// DeletePhoto 删除照片
func (h *PhotoHandler) DeletePhoto(c *gin.Context) {
	id := c.Param("id")
	var photo model.Photo

	if err := common.DB.First(&photo, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			common.NotFound(c, "Photo not found")
		} else {
			common.InternalServerError(c, "Failed to find photo")
		}
		return
	}

	// 开始事务
	tx := common.DB.Begin()

	// 清除主题关联
	if err := tx.Model(&photo).Association("Themes").Clear(); err != nil {
		tx.Rollback()
		common.InternalServerError(c, "Failed to clear associations")
		return
	}

	// 删除照片
	if err := tx.Delete(&photo).Error; err != nil {
		tx.Rollback()
		common.InternalServerError(c, "Failed to delete photo")
		return
	}

	tx.Commit()

	common.SuccessWithMessage(c, "Photo deleted successfully", nil)
}

// GetFeaturedPhotos 获取精选照片
func (h *PhotoHandler) GetFeaturedPhotos(c *gin.Context) {
	var photos []model.Photo

	err := common.DB.Where("is_featured = ? AND status = ?", true, "processed").
		Preload("Themes").
		Order("created_at DESC").
		Find(&photos).Error

	if err != nil {
		common.InternalServerError(c, "Failed to get featured photos")
		return
	}

	common.Success(c, photos)
}