package rest

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/apotek-pbf/monorepo-pbf/auth-service/internal/use_case"
	"github.com/apotek-pbf/monorepo-pbf/lib"
)

type authService interface {
	Login(username, password string) (res use_case.LoginResponse, err error)
	GetCurrentUser(accessToken string) (res use_case.User, err error)
	RefreshToken(refreshToken string) (res use_case.LoginResponse, err error)
	Logout(accessToken string) (err error)
}

type Handler struct {
	service authService
}

func NewHandler(service authService) *Handler {
	return &Handler{service: service}
}

func (h *Handler) Login(w http.ResponseWriter, r *http.Request) {
	type loginRequest struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	var req loginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		lib.WriteResponse(w, lib.NewErrBadRequest(err.Error()), nil)
		return
	}

	res, err := h.service.Login(req.Username, req.Password)
	if err != nil {
		lib.WriteResponse(w, err, nil)
		return
	}

	lib.WriteResponse(w, nil, res)
}

func (h *Handler) GetCurrentUser(w http.ResponseWriter, r *http.Request) {
	accessToken := r.Header.Get("Authorization")
	splitAccessToken := strings.Split(accessToken, "Bearer ")
	if len(splitAccessToken) != 2 {
		lib.WriteResponse(w, lib.NewErrBadRequest("invalid access token"), nil)
		return
	}

	res, err := h.service.GetCurrentUser(splitAccessToken[1])
	if err != nil {
		lib.WriteResponse(w, err, nil)
		return
	}

	lib.WriteResponse(w, nil, res)
}

func (h *Handler) RefreshToken(w http.ResponseWriter, r *http.Request) {
	refreshToken := r.Header.Get("Authorization")
	splitRefreshToken := strings.Split(refreshToken, "Bearer ")

	if len(splitRefreshToken) != 2 {
		lib.WriteResponse(w, lib.NewErrBadRequest("invalid refresh token"), nil)
		return
	}

	res, err := h.service.RefreshToken(splitRefreshToken[1])
	if err != nil {
		lib.WriteResponse(w, err, nil)
		return
	}

	lib.WriteResponse(w, nil, res)
}

func (h *Handler) Logout(w http.ResponseWriter, r *http.Request) {
	accessToken := r.Header.Get("Authorization")
	splitAccessToken := strings.Split(accessToken, "Bearer ")
	if len(splitAccessToken) != 2 {
		lib.WriteResponse(w, lib.NewErrBadRequest("invalid access token"), nil)
		return
	}

	err := h.service.Logout(splitAccessToken[1])
	if err != nil {
		lib.WriteResponse(w, err, nil)
		return
	}

	lib.WriteResponse(w, nil, nil)
}
