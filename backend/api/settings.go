package api

import (
	"photography-backend/common"
	"photography-backend/model"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// SettingsHandler 设置处理器
type SettingsHandler struct{}

// GetSettings 获取所有设置
func (h *SettingsHandler) GetSettings(c *gin.Context) {
	var settings []model.Settings

	err := common.DB.Order("key ASC").Find(&settings).Error

	if err != nil {
		common.InternalServerError(c, "Failed to get settings")
		return
	}

	// 转换为键值对格式
	result := make(map[string]interface{})
	for _, setting := range settings {
		result[setting.Key] = gin.H{
			"value":       setting.Value,
			"description": setting.Description,
			"updated_at":  setting.UpdatedAt,
		}
	}

	common.Success(c, result)
}

// GetSetting 获取单个设置
func (h *SettingsHandler) GetSetting(c *gin.Context) {
	key := c.Param("key")
	var setting model.Settings

	err := common.DB.Where("key = ?", key).First(&setting).Error

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			common.NotFound(c, "Setting not found")
		} else {
			common.InternalServerError(c, "Failed to get setting")
		}
		return
	}

	common.Success(c, setting)
}

// UpdateSetting 更新设置
func (h *SettingsHandler) UpdateSetting(c *gin.Context) {
	key := c.Param("key")
	
	var req struct {
		Value       string `json:"value" binding:"required"`
		Description string `json:"description"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		common.BadRequest(c, err.Error())
		return
	}

	var setting model.Settings
	err := common.DB.Where("key = ?", key).First(&setting).Error

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			// 创建新设置
			setting = model.Settings{
				Key:         key,
				Value:       req.Value,
				Description: req.Description,
			}
			if err := common.DB.Create(&setting).Error; err != nil {
				common.InternalServerError(c, "Failed to create setting")
				return
			}
		} else {
			common.InternalServerError(c, "Failed to find setting")
			return
		}
	} else {
		// 更新现有设置
		updates := map[string]interface{}{
			"value": req.Value,
		}
		if req.Description != "" {
			updates["description"] = req.Description
		}

		if err := common.DB.Model(&setting).Updates(updates).Error; err != nil {
			common.InternalServerError(c, "Failed to update setting")
			return
		}
	}

	common.SuccessWithMessage(c, "Setting updated successfully", setting)
}

// UpdateSettings 批量更新设置
func (h *SettingsHandler) UpdateSettings(c *gin.Context) {
	var req map[string]string

	if err := c.ShouldBindJSON(&req); err != nil {
		common.BadRequest(c, err.Error())
		return
	}

	// 开始事务
	tx := common.DB.Begin()

	for key, value := range req {
		var setting model.Settings
		err := tx.Where("key = ?", key).First(&setting).Error

		if err != nil {
			if err == gorm.ErrRecordNotFound {
				// 创建新设置
				setting = model.Settings{
					Key:   key,
					Value: value,
				}
				if err := tx.Create(&setting).Error; err != nil {
					tx.Rollback()
					common.InternalServerError(c, "Failed to create setting: "+key)
					return
				}
			} else {
				tx.Rollback()
				common.InternalServerError(c, "Failed to find setting: "+key)
				return
			}
		} else {
			// 更新现有设置
			if err := tx.Model(&setting).Update("value", value).Error; err != nil {
				tx.Rollback()
				common.InternalServerError(c, "Failed to update setting: "+key)
				return
			}
		}
	}

	tx.Commit()

	common.SuccessWithMessage(c, "Settings updated successfully", nil)
}

// DeleteSetting 删除设置
func (h *SettingsHandler) DeleteSetting(c *gin.Context) {
	key := c.Param("key")
	var setting model.Settings

	if err := common.DB.Where("key = ?", key).First(&setting).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			common.NotFound(c, "Setting not found")
		} else {
			common.InternalServerError(c, "Failed to find setting")
		}
		return
	}

	if err := common.DB.Delete(&setting).Error; err != nil {
		common.InternalServerError(c, "Failed to delete setting")
		return
	}

	common.SuccessWithMessage(c, "Setting deleted successfully", nil)
}

// GetPublicSettings 获取公开设置（不需要认证）
func (h *SettingsHandler) GetPublicSettings(c *gin.Context) {
	publicKeys := []string{
		"site_title",
		"site_description",
		"photographer_name",
		"photographer_bio",
		"contact_email",
	}

	var settings []model.Settings
	err := common.DB.Where("key IN ?", publicKeys).Find(&settings).Error

	if err != nil {
		common.InternalServerError(c, "Failed to get public settings")
		return
	}

	result := make(map[string]string)
	for _, setting := range settings {
		result[setting.Key] = setting.Value
	}

	common.Success(c, result)
}