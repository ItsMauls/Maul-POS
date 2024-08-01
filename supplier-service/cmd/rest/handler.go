package rest

import (
	"context"
	"net/http"
	"strings"

	"github.com/apotek-pbf/monorepo-pbf/lib"
	"github.com/apotek-pbf/monorepo-pbf/supplier-service/internal/model/supplier"
	"github.com/apotek-pbf/monorepo-pbf/supplier-service/internal/use_case"
)

type service interface {
	FindAllSupplier(ctx context.Context, request lib.PaginationRequest) (response use_case.GetListSupplierResponse, err error)
	FindSupplierByIDs(ctx context.Context, ids []string) (response []supplier.Supplier, err error)
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

func (h *Handler) FindAllSupplier(w http.ResponseWriter, r *http.Request) {
	var request lib.PaginationRequest

	request.Page = lib.GetQueryInt(r, "page", 1)
	request.PageSize = lib.GetQueryInt(r, "page_size", 10)
	request.Keyword = r.URL.Query().Get("keyword")

	response, err := h.service.FindAllSupplier(r.Context(), request)
	if err != nil {
		lib.WriteResponse(w, err, nil)
		return
	}

	lib.WriteResponse(w, nil, response)
}

func (h *Handler) FindSupplierByIDs(w http.ResponseWriter, r *http.Request) {
	idString := r.URL.Query().Get("ids")

	ids := strings.Split(idString, ",")

	response, err := h.service.FindSupplierByIDs(r.Context(), ids)
	if err != nil {
		lib.WriteResponse(w, err, nil)
		return
	}

	lib.WriteResponse(w, nil, response)
}
