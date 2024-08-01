package rest

import (
	"context"
	"net/http"
	"strconv"
	"strings"

	"github.com/apotek-pbf/monorepo-pbf/lib"
	"github.com/apotek-pbf/monorepo-pbf/user-service/internal/model"
	"github.com/apotek-pbf/monorepo-pbf/user-service/internal/use_case"
)

type userService interface {
	GetUsers(ctx context.Context, request lib.PaginationRequest) (use_case.GetUserDetailResponse, error)
	FindAllRoles(ctx context.Context) ([]*use_case.Role, error)
	CreateUser(ctx context.Context, user *model.User) error
	DeleteUser(ctx context.Context, id int64) error
	GetUserByIDs(ctx context.Context, ids []int64) (resp []*use_case.UserDetail, err error)
	AddSignature(ctx context.Context, signatureBase64 string) error
}

type Handler struct {
	cfg     *lib.Config
	service userService
}

func NewHandler(cfg *lib.Config, service userService) *Handler {
	return &Handler{
		cfg:     cfg,
		service: service,
	}
}

func (h *Handler) Ping(w http.ResponseWriter, r *http.Request) {
	lib.WriteResponse(w, nil, "pong")
}

func (h *Handler) AddSignature(w http.ResponseWriter, r *http.Request) {
	type request struct {
		SignatureBase64 string `json:"signature_base64"`
	}

	var req request
	err := lib.ReadRequest(r, &req)
	if err != nil {
		lib.WriteResponse(w, lib.NewErrBadRequest(err.Error()), nil)
		return
	}

	err = h.service.AddSignature(r.Context(), req.SignatureBase64)
	if err != nil {
		lib.WriteResponse(w, err, nil)
		return
	}

	lib.WriteResponse(w, nil, nil)
}

func (h *Handler) GetUserByIDs(w http.ResponseWriter, r *http.Request) {
	idString := r.URL.Query().Get("ids")

	idsStr := strings.Split(idString, ",")

	ids := make([]int64, 0)
	for _, id := range idsStr {
		idInt, _ := strconv.ParseInt(id, 10, 64)
		ids = append(ids, idInt)
	}

	users, err := h.service.GetUserByIDs(r.Context(), ids)
	if err != nil {
		lib.WriteResponse(w, err, nil)
		return
	}

	lib.WriteResponse(w, nil, users)
}

func (h *Handler) DeleteUser(w http.ResponseWriter, r *http.Request) {
	id := r.URL.Query().Get("id")

	if id == "" {
		lib.WriteResponse(w, lib.NewErrBadRequest("id is required"), nil)
		return
	}

	idInt, _ := strconv.ParseInt(id, 10, 64)
	err := h.service.DeleteUser(r.Context(), idInt)
	if err != nil {
		lib.WriteResponse(w, err, nil)
		return
	}

	lib.WriteResponse(w, nil, nil)
}

func (h *Handler) GetUsers(w http.ResponseWriter, r *http.Request) {
	var request lib.PaginationRequest

	//read query params
	request.Page = lib.GetQueryInt(r, "page", 1)
	request.PageSize = lib.GetQueryInt(r, "page_size", 10)
	request.Keyword = r.URL.Query().Get("keyword")

	users, err := h.service.GetUsers(r.Context(), request)
	if err != nil {
		lib.WriteResponse(w, err, nil)
		return
	}

	lib.WriteResponse(w, nil, users)
}

func (h *Handler) GetRoles(w http.ResponseWriter, r *http.Request) {
	roles, err := h.service.FindAllRoles(r.Context())
	if err != nil {
		lib.WriteResponse(w, err, nil)
		return
	}

	lib.WriteResponse(w, nil, roles)
}

func (h *Handler) CreateUser(w http.ResponseWriter, r *http.Request) {
	var user model.User
	err := lib.ReadRequest(r, &user)
	if err != nil {
		lib.WriteResponse(w, lib.NewErrBadRequest(err.Error()), nil)
		return
	}

	err = h.service.CreateUser(r.Context(), &user)
	if err != nil {
		lib.WriteResponse(w, err, nil)
		return
	}

	lib.WriteResponse(w, nil, nil)
}

func (h *Handler) GetSignature(w http.ResponseWriter, r *http.Request) {
	// get from static file
	fileName := r.URL.Query().Get("file_name")
	if fileName == "" {
		lib.WriteResponse(w, lib.NewErrBadRequest("file_name is required"), nil)
		return
	}
	http.ServeFile(w, r, "storage/signature/"+fileName)
}
