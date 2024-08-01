package use_case

import (
	"github.com/apotek-pbf/monorepo-pbf/auth-service/internal/model"
)

type LoginResponse struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
	User         User   `json:"user"`
}

type User struct {
	ID        int64  `json:"id"`
	Name      string `json:"name"`
	Address   string `json:"address"`
	Username  string `json:"username"`
	Email     string `json:"email"`
	Role      Role   `json:"role"`
	Signature string `json:"signature"`
}

type Role struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

func fromModuleToUserResponse(user *model.User, role *model.Role) User {
	var signature string
	if user.Signature != nil {
		signature = *user.Signature
	}
	return User{
		ID:       user.ID,
		Name:     user.Name,
		Address:  user.Address,
		Username: user.Username,
		Email:    user.Email,
		Role: Role{
			ID:   role.ID,
			Name: role.Name,
		},
		Signature: signature,
	}
}

func fromModuleToLoginResponse(user *model.User, role *model.Role, accessToken, refreshToken string) LoginResponse {
	return LoginResponse{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		User: User{
			ID:       user.ID,
			Name:     user.Name,
			Address:  user.Address,
			Username: user.Username,
			Email:    user.Email,
			Role: Role{
				ID:   role.ID,
				Name: role.Name,
			},
		},
	}
}
