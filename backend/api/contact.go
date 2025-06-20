package api

import (
	"strconv"

	"photography-backend/common"
	"photography-backend/model"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// ContactHandler 联系表单处理器
type ContactHandler struct{}

// SubmitContact 提交联系表单
func (h *ContactHandler) SubmitContact(c *gin.Context) {
	var req struct {
		Name    string `json:"name" binding:"required"`
		Email   string `json:"email" binding:"required,email"`
		Subject string `json:"subject" binding:"required"`
		Message string `json:"message" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		common.BadRequest(c, err.Error())
		return
	}

	contact := model.Contact{
		Name:    req.Name,
		Email:   req.Email,
		Subject: req.Subject,
		Message: req.Message,
		IsRead:  false,
	}

	if err := common.DB.Create(&contact).Error; err != nil {
		common.InternalServerError(c, "Failed to submit contact form")
		return
	}

	common.SuccessWithMessage(c, "Contact form submitted successfully", nil)
}

// GetContacts 获取联系表单列表（管理员）
func (h *ContactHandler) GetContacts(c *gin.Context) {
	var contacts []model.Contact
	var total int64

	// 分页参数
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	size, _ := strconv.Atoi(c.DefaultQuery("size", "20"))
	offset := (page - 1) * size

	// 查询参数
	isRead := c.Query("is_read")

	// 构建查询
	query := common.DB.Model(&model.Contact{})

	if isRead != "" {
		query = query.Where("is_read = ?", isRead == "true")
	}

	// 获取总数
	query.Count(&total)

	// 获取数据
	err := query.Order("created_at DESC").
		Offset(offset).Limit(size).
		Find(&contacts).Error

	if err != nil {
		common.InternalServerError(c, "Failed to get contacts")
		return
	}

	common.PageSuccess(c, contacts, total, page, size)
}

// GetContact 获取单个联系表单（管理员）
func (h *ContactHandler) GetContact(c *gin.Context) {
	id := c.Param("id")
	var contact model.Contact

	err := common.DB.First(&contact, id).Error

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			common.NotFound(c, "Contact not found")
		} else {
			common.InternalServerError(c, "Failed to get contact")
		}
		return
	}

	common.Success(c, contact)
}

// MarkContactAsRead 标记联系表单为已读（管理员）
func (h *ContactHandler) MarkContactAsRead(c *gin.Context) {
	id := c.Param("id")
	var contact model.Contact

	if err := common.DB.First(&contact, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			common.NotFound(c, "Contact not found")
		} else {
			common.InternalServerError(c, "Failed to find contact")
		}
		return
	}

	if err := common.DB.Model(&contact).Update("is_read", true).Error; err != nil {
		common.InternalServerError(c, "Failed to mark contact as read")
		return
	}

	common.SuccessWithMessage(c, "Contact marked as read", contact)
}

// DeleteContact 删除联系表单（管理员）
func (h *ContactHandler) DeleteContact(c *gin.Context) {
	id := c.Param("id")
	var contact model.Contact

	if err := common.DB.First(&contact, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			common.NotFound(c, "Contact not found")
		} else {
			common.InternalServerError(c, "Failed to find contact")
		}
		return
	}

	if err := common.DB.Delete(&contact).Error; err != nil {
		common.InternalServerError(c, "Failed to delete contact")
		return
	}

	common.SuccessWithMessage(c, "Contact deleted successfully", nil)
}