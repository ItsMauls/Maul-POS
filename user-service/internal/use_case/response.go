package use_case

import (
	"github.com/apotek-pbf/monorepo-pbf/lib"
	"github.com/apotek-pbf/monorepo-pbf/user-service/internal/model"
)

type UserDetail struct {
	ID        int64  `json:"id"`
	Name      string `json:"name"`
	Address   string `json:"address"`
	Username  string `json:"username"`
	Email     string `json:"email"`
	Role      *Role  `json:"role"`
	Signature string `json:"signature"`
}

type Role struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

func fromUserToUserDetail(user *model.User, role model.Role) *UserDetail {
	var signature string
	if user.Signature != nil {
		signature = *user.Signature
	}
	return &UserDetail{
		ID:        user.ID,
		Name:      user.Name,
		Address:   user.Address,
		Username:  user.Username,
		Email:     user.Email,
		Role:      fromModelRoleToRole(&role),
		Signature: signature,
	}
}

type GetUserDetailResponse struct {
	Users []*UserDetail  `json:"users"`
	Meta  lib.Pagination `json:"meta"`
}

func fromModelRoleToRole(role *model.Role) *Role {
	return &Role{
		ID:   role.ID,
		Name: role.Name,
	}
}
