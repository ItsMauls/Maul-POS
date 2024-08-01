package rest

import (
	"context"
	"net/http"
	"strings"

	"github.com/apotek-pbf/monorepo-pbf/inventory-service/internal/model/satuan"
	"github.com/apotek-pbf/monorepo-pbf/inventory-service/internal/use_case"
	"github.com/apotek-pbf/monorepo-pbf/lib"
)

type service interface {
	GetAllMasterBarang(ctx context.Context, request lib.PaginationRequest) (response *use_case.GetAllMasterBarangResponse, err error)
	GetMasterBarangByIDs(ctx context.Context, ids []string) (response []use_case.MasterBarang, err error)
	GetMasterBarangByID(ctx context.Context, id string) (response *use_case.MasterBarang, err error)
	CreateMasterBarang(ctx context.Context, request *use_case.CreateMasterBarangRequest) (err error)
	UpdateMasterBarang(ctx context.Context, request *use_case.CreateMasterBarangRequest, id string) (err error)
	DeleteMasterBarang(ctx context.Context, id string) (err error)
	GetAllSatuan(ctx context.Context) (response []satuan.Satuan, err error)
}

type Handler struct {
	cfg     *lib.Config
	service service
}

func NewHandler(cfg *lib.Config, service service) *Handler {
	return &Handler{
		cfg:     cfg,
		service: service,
	}
}

func (h *Handler) GetAllMasterBarang(w http.ResponseWriter, r *http.Request) {
	var request lib.PaginationRequest

	//read query params
	request.Page = lib.GetQueryInt(r, "page", 1)
	request.PageSize = lib.GetQueryInt(r, "page_size", 10)
	request.Keyword = r.URL.Query().Get("keyword")

	response, err := h.service.GetAllMasterBarang(r.Context(), request)
	if err != nil {
		lib.WriteResponse(w, err, nil)
		return
	}

	lib.WriteResponse(w, nil, response)
}

func (h *Handler) GetMasterBarangByIDs(w http.ResponseWriter, r *http.Request) {
	idString := r.URL.Query().Get("ids")

	ids := strings.Split(idString, ",")

	response, err := h.service.GetMasterBarangByIDs(r.Context(), ids)
	if err != nil {
		lib.WriteResponse(w, err, nil)
		return
	}

	lib.WriteResponse(w, nil, response)
}

func (h *Handler) GetMasterBarangByID(w http.ResponseWriter, r *http.Request) {
	id := r.URL.Query().Get("id")

	response, err := h.service.GetMasterBarangByID(r.Context(), id)
	if err != nil {
		lib.WriteResponse(w, err, nil)
		return
	}

	lib.WriteResponse(w, nil, response)
}

func (h *Handler) CreateMasterBarang(w http.ResponseWriter, r *http.Request) {
	var request use_case.CreateMasterBarangRequest

	err := lib.ReadRequest(r, &request)
	if err != nil {
		lib.WriteResponse(w, err, nil)
		return
	}

	err = h.service.CreateMasterBarang(r.Context(), &request)
	if err != nil {
		lib.WriteResponse(w, err, nil)
		return
	}

	lib.WriteResponse(w, nil, nil)
}

func (h *Handler) UpdateMasterBarang(w http.ResponseWriter, r *http.Request) {
	var request use_case.CreateMasterBarangRequest

	err := lib.ReadRequest(r, &request)
	if err != nil {
		lib.WriteResponse(w, err, nil)
		return
	}

	id := r.URL.Query().Get("id")

	err = h.service.UpdateMasterBarang(r.Context(), &request, id)
	if err != nil {
		lib.WriteResponse(w, err, nil)
		return
	}

	lib.WriteResponse(w, nil, nil)
}

func (h *Handler) DeleteMasterBarang(w http.ResponseWriter, r *http.Request) {
	id := r.URL.Query().Get("id")

	err := h.service.DeleteMasterBarang(r.Context(), id)
	if err != nil {
		lib.WriteResponse(w, err, nil)
		return
	}

	lib.WriteResponse(w, nil, nil)
}

func (h *Handler) GetAllSatuan(w http.ResponseWriter, r *http.Request) {
	response, err := h.service.GetAllSatuan(r.Context())
	if err != nil {
		lib.WriteResponse(w, err, nil)
		return
	}

	lib.WriteResponse(w, nil, response)
}
