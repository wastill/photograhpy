package api

import (
	"strconv"
	"time"

	"photography-backend/common"
	"photography-backend/model"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// TimelineHandler 时光轴处理器
type TimelineHandler struct{}

// GetTimelineNodes 获取时光轴节点列表
func (h *TimelineHandler) GetTimelineNodes(c *gin.Context) {
	var nodes []model.TimelineNode
	var total int64

	// 分页参数
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	size, _ := strconv.Atoi(c.DefaultQuery("size", "20"))
	offset := (page - 1) * size

	// 查询参数
	isActive := c.DefaultQuery("is_active", "true")

	// 构建查询
	query := common.DB.Model(&model.TimelineNode{})

	if isActive == "true" {
		query = query.Where("is_active = ?", true)
	}

	// 获取总数
	query.Count(&total)

	// 获取数据
	err := query.Preload("Photos", "status = ?", "processed").
		Order("sort_order ASC, period_start DESC").
		Offset(offset).Limit(size).
		Find(&nodes).Error

	if err != nil {
		common.InternalServerError(c, "Failed to get timeline nodes")
		return
	}

	common.PageSuccess(c, nodes, total, page, size)
}

// GetTimelineNode 获取单个时光轴节点
func (h *TimelineHandler) GetTimelineNode(c *gin.Context) {
	id := c.Param("id")
	var node model.TimelineNode

	err := common.DB.Preload("Photos", "status = ?", "processed").
		First(&node, id).Error

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			common.NotFound(c, "Timeline node not found")
		} else {
			common.InternalServerError(c, "Failed to get timeline node")
		}
		return
	}

	common.Success(c, node)
}

// GetTimelineNodePhotos 获取时光轴节点下的照片
func (h *TimelineHandler) GetTimelineNodePhotos(c *gin.Context) {
	nodeID := c.Param("id")
	var photos []model.Photo
	var total int64

	// 分页参数
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	size, _ := strconv.Atoi(c.DefaultQuery("size", "20"))
	offset := (page - 1) * size

	// 验证节点是否存在
	var node model.TimelineNode
	if err := common.DB.First(&node, nodeID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			common.NotFound(c, "Timeline node not found")
		} else {
			common.InternalServerError(c, "Failed to find timeline node")
		}
		return
	}

	// 构建查询
	query := common.DB.Model(&model.Photo{}).
		Where("timeline_node_id = ? AND status = ?", nodeID, "processed")

	// 获取总数
	query.Count(&total)

	// 获取数据
	err := query.Preload("Themes").Preload("TimelineNode").
		Order("created_at DESC").
		Offset(offset).Limit(size).
		Find(&photos).Error

	if err != nil {
		common.InternalServerError(c, "Failed to get timeline node photos")
		return
	}

	common.PageSuccess(c, photos, total, page, size)
}

// CreateTimelineNode 创建时光轴节点
func (h *TimelineHandler) CreateTimelineNode(c *gin.Context) {
	var req struct {
		Title        string `json:"title" binding:"required"`
		PeriodStart  string `json:"period_start" binding:"required"`
		PeriodEnd    string `json:"period_end" binding:"required"`
		StoryContent string `json:"story_content"`
		SortOrder    int    `json:"sort_order"`
		IsActive     bool   `json:"is_active"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		common.BadRequest(c, err.Error())
		return
	}

	// 解析时间
	periodStart, err := time.Parse("2006-01-02", req.PeriodStart)
	if err != nil {
		common.BadRequest(c, "Invalid period_start format, use YYYY-MM-DD")
		return
	}

	periodEnd, err := time.Parse("2006-01-02", req.PeriodEnd)
	if err != nil {
		common.BadRequest(c, "Invalid period_end format, use YYYY-MM-DD")
		return
	}

	if periodStart.After(periodEnd) {
		common.BadRequest(c, "period_start cannot be after period_end")
		return
	}

	node := model.TimelineNode{
		Title:        req.Title,
		PeriodStart:  periodStart,
		PeriodEnd:    periodEnd,
		StoryContent: req.StoryContent,
		SortOrder:    req.SortOrder,
		IsActive:     req.IsActive,
	}

	if err := common.DB.Create(&node).Error; err != nil {
		common.InternalServerError(c, "Failed to create timeline node")
		return
	}

	common.SuccessWithMessage(c, "Timeline node created successfully", node)
}

// UpdateTimelineNode 更新时光轴节点
func (h *TimelineHandler) UpdateTimelineNode(c *gin.Context) {
	id := c.Param("id")
	var node model.TimelineNode

	if err := common.DB.First(&node, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			common.NotFound(c, "Timeline node not found")
		} else {
			common.InternalServerError(c, "Failed to find timeline node")
		}
		return
	}

	var req struct {
		Title        *string `json:"title"`
		PeriodStart  *string `json:"period_start"`
		PeriodEnd    *string `json:"period_end"`
		StoryContent *string `json:"story_content"`
		SortOrder    *int    `json:"sort_order"`
		IsActive     *bool   `json:"is_active"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		common.BadRequest(c, err.Error())
		return
	}

	// 更新字段
	updates := make(map[string]interface{})
	
	if req.Title != nil {
		updates["title"] = *req.Title
	}
	
	if req.PeriodStart != nil {
		periodStart, err := time.Parse("2006-01-02", *req.PeriodStart)
		if err != nil {
			common.BadRequest(c, "Invalid period_start format, use YYYY-MM-DD")
			return
		}
		updates["period_start"] = periodStart
	}
	
	if req.PeriodEnd != nil {
		periodEnd, err := time.Parse("2006-01-02", *req.PeriodEnd)
		if err != nil {
			common.BadRequest(c, "Invalid period_end format, use YYYY-MM-DD")
			return
		}
		updates["period_end"] = periodEnd
	}
	
	if req.StoryContent != nil {
		updates["story_content"] = *req.StoryContent
	}
	
	if req.SortOrder != nil {
		updates["sort_order"] = *req.SortOrder
	}
	
	if req.IsActive != nil {
		updates["is_active"] = *req.IsActive
	}

	// 验证时间范围
	if req.PeriodStart != nil || req.PeriodEnd != nil {
		var startTime, endTime time.Time
		
		if req.PeriodStart != nil {
			startTime, _ = time.Parse("2006-01-02", *req.PeriodStart)
		} else {
			startTime = node.PeriodStart
		}
		
		if req.PeriodEnd != nil {
			endTime, _ = time.Parse("2006-01-02", *req.PeriodEnd)
		} else {
			endTime = node.PeriodEnd
		}
		
		if startTime.After(endTime) {
			common.BadRequest(c, "period_start cannot be after period_end")
			return
		}
	}

	if err := common.DB.Model(&node).Updates(updates).Error; err != nil {
		common.InternalServerError(c, "Failed to update timeline node")
		return
	}

	// 重新加载节点数据
	common.DB.Preload("Photos", "status = ?", "processed").First(&node, node.ID)

	common.SuccessWithMessage(c, "Timeline node updated successfully", node)
}

// DeleteTimelineNode 删除时光轴节点
func (h *TimelineHandler) DeleteTimelineNode(c *gin.Context) {
	id := c.Param("id")
	var node model.TimelineNode

	if err := common.DB.First(&node, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			common.NotFound(c, "Timeline node not found")
		} else {
			common.InternalServerError(c, "Failed to find timeline node")
		}
		return
	}

	// 检查是否有关联的照片
	var photoCount int64
	common.DB.Model(&model.Photo{}).Where("timeline_node_id = ?", id).Count(&photoCount)

	if photoCount > 0 {
		common.BadRequest(c, "Cannot delete timeline node with associated photos")
		return
	}

	if err := common.DB.Delete(&node).Error; err != nil {
		common.InternalServerError(c, "Failed to delete timeline node")
		return
	}

	common.SuccessWithMessage(c, "Timeline node deleted successfully", nil)
}

// GetTimeline 获取完整时光轴（用于前端展示）
func (h *TimelineHandler) GetTimeline(c *gin.Context) {
	var nodes []model.TimelineNode

	err := common.DB.Where("is_active = ?", true).
		Preload("Photos", func(db *gorm.DB) *gorm.DB {
			return db.Where("status = ?", "processed").
				Order("created_at DESC").
				Limit(5) // 每个节点最多显示5张代表作
		}).
		Order("sort_order ASC, period_start DESC").
		Find(&nodes).Error

	if err != nil {
		common.InternalServerError(c, "Failed to get timeline")
		return
	}

	common.Success(c, nodes)
}