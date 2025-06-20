package api

import (
	"photography-backend/common"
	"photography-backend/model"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// AuthHandler 认证处理器
type AuthHandler struct{}

// Login 用户登录
func (h *AuthHandler) Login(c *gin.Context) {
	var req struct {
		Username string `json:"username" binding:"required"`
		Password string `json:"password" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		common.BadRequest(c, err.Error())
		return
	}

	var user model.User
	err := common.DB.Where("username = ? AND is_active = ?", req.Username, true).First(&user).Error

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			common.Unauthorized(c, "Invalid username or password")
		} else {
			common.InternalServerError(c, "Failed to find user")
		}
		return
	}

	if !common.CheckPassword(req.Password, user.Password) {
		common.Unauthorized(c, "Invalid username or password")
		return
	}

	token, err := common.GenerateToken(user.ID, user.Username, user.Role)
	if err != nil {
		common.InternalServerError(c, "Failed to generate token")
		return
	}

	response := gin.H{
		"token": token,
		"user": gin.H{
			"id":       user.ID,
			"username": user.Username,
			"email":    user.Email,
			"role":     user.Role,
		},
	}

	common.SuccessWithMessage(c, "Login successful", response)
}

// GetProfile 获取用户信息
func (h *AuthHandler) GetProfile(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		common.Unauthorized(c, "User not authenticated")
		return
	}

	var user model.User
	err := common.DB.First(&user, userID).Error

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			common.NotFound(c, "User not found")
		} else {
			common.InternalServerError(c, "Failed to get user")
		}
		return
	}

	response := gin.H{
		"id":       user.ID,
		"username": user.Username,
		"email":    user.Email,
		"role":     user.Role,
	}

	common.Success(c, response)
}

// UpdateProfile 更新用户信息
func (h *AuthHandler) UpdateProfile(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		common.Unauthorized(c, "User not authenticated")
		return
	}

	var user model.User
	if err := common.DB.First(&user, userID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			common.NotFound(c, "User not found")
		} else {
			common.InternalServerError(c, "Failed to find user")
		}
		return
	}

	var req struct {
		Email    *string `json:"email"`
		Password *string `json:"password"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		common.BadRequest(c, err.Error())
		return
	}

	updates := make(map[string]interface{})

	if req.Email != nil {
		// 检查邮箱是否已存在
		var existingUser model.User
		if err := common.DB.Where("email = ? AND id != ?", *req.Email, user.ID).First(&existingUser).Error; err == nil {
			common.BadRequest(c, "Email already exists")
			return
		}
		updates["email"] = *req.Email
	}

	if req.Password != nil {
		hashedPassword, err := common.HashPassword(*req.Password)
		if err != nil {
			common.InternalServerError(c, "Failed to hash password")
			return
		}
		updates["password"] = hashedPassword
	}

	if len(updates) > 0 {
		if err := common.DB.Model(&user).Updates(updates).Error; err != nil {
			common.InternalServerError(c, "Failed to update profile")
			return
		}
	}

	response := gin.H{
		"id":       user.ID,
		"username": user.Username,
		"email":    user.Email,
		"role":     user.Role,
	}

	common.SuccessWithMessage(c, "Profile updated successfully", response)
}

// ChangePassword 修改密码
func (h *AuthHandler) ChangePassword(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		common.Unauthorized(c, "User not authenticated")
		return
	}

	var req struct {
		OldPassword string `json:"old_password" binding:"required"`
		NewPassword string `json:"new_password" binding:"required,min=6"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		common.BadRequest(c, err.Error())
		return
	}

	var user model.User
	if err := common.DB.First(&user, userID).Error; err != nil {
		common.InternalServerError(c, "Failed to find user")
		return
	}

	if !common.CheckPassword(req.OldPassword, user.Password) {
		common.BadRequest(c, "Old password is incorrect")
		return
	}

	hashedPassword, err := common.HashPassword(req.NewPassword)
	if err != nil {
		common.InternalServerError(c, "Failed to hash password")
		return
	}

	if err := common.DB.Model(&user).Update("password", hashedPassword).Error; err != nil {
		common.InternalServerError(c, "Failed to update password")
		return
	}

	common.SuccessWithMessage(c, "Password changed successfully", nil)
}