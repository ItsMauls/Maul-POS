package user

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

type GetUserByIDsResponse struct {
	StatusCode int          `json:"status_code"`
	Message    string       `json:"message"`
	Data       []UserDetail `json:"data"`
}
