package rest

import (
	"context"
	"fmt"
	"net/http"

	"github.com/apotek-pbf/monorepo-pbf/lib"
	"github.com/apotek-pbf/monorepo-pbf/purchase-service/internal/use_case"
)

type service interface {
	FindAllPurchaseRequest(ctx context.Context, request use_case.GetAllPurchaseRequestParams) (response use_case.GetPurchaseRequestListResponse, err error)
	FindByPRID(ctx context.Context, id int) (data use_case.GetPurchaseRequestResponse, err error)
	CreatePurchaseRequest(ctx context.Context, request use_case.CreatePurchaseRequest) (err error)
	SwitchGudangPurchaseRequest(ctx context.Context, id int, gudang string) (err error)
	ApprovePurchaseRequest(ctx context.Context, id int) (err error)
	FindAllPurchaseRequestForPO(ctx context.Context, request use_case.GetAllPurchaseRequestParams) (response use_case.GetPurchaseRequestListResponse, err error)
	DeletePurchaseRequest(ctx context.Context, id int) (err error)

	FindAllPurchaseOrder(ctx context.Context, request use_case.GetAllPurchaseOrderParams) (response use_case.GetPurchaseOrderListResponse, err error)
	FindByPOID(ctx context.Context, id int) (data use_case.GetPurchaseOrderResponse, err error)
	CreatePurchaseOrder(ctx context.Context, request use_case.CreatePurchaseOrder) (err error)
	ApprovePurchaseOrder(ctx context.Context, id int) (err error)
	DeletePurchaseOrder(ctx context.Context, id int) (err error)

	//invoice
	FindAllInvoice(ctx context.Context, request use_case.GetAllInvoiceParams) (response use_case.GetInvoiceListResponse, err error)
	CreateInvoice(ctx context.Context, request use_case.CreateInvoice) (err error)
	FindByInvoiceID(ctx context.Context, id int64) (data use_case.GetInvoiceResponse, err error)
	PelunasanInvoice(ctx context.Context, id int64, request use_case.CreatePembayaranInvoice) (err error)
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

/*
Purchase Request Handler
*/
func (h *Handler) FindAllPurchaseRequestForPO(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	var request use_case.GetAllPurchaseRequestParams

	//read query params
	request.Paginate.Page = lib.GetQueryInt(r, "page", 1)
	request.Paginate.PageSize = lib.GetQueryInt(r, "page_size", 10)
	request.Paginate.Keyword = r.URL.Query().Get("keyword")
	request.Gudang = r.URL.Query().Get("gudang")

	response, err := h.service.FindAllPurchaseRequestForPO(ctx, request)
	if err != nil {
		lib.WriteResponse(w, err, nil)
		return
	}

	lib.WriteResponse(w, nil, response)
}

func (h *Handler) FindAllPurchaseRequest(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	var request use_case.GetAllPurchaseRequestParams

	//read query params
	request.Paginate.Page = lib.GetQueryInt(r, "page", 1)
	request.Paginate.PageSize = lib.GetQueryInt(r, "page_size", 10)
	request.Paginate.Keyword = r.URL.Query().Get("keyword")
	request.Gudang = r.URL.Query().Get("gudang")

	response, err := h.service.FindAllPurchaseRequest(ctx, request)
	if err != nil {
		lib.WriteResponse(w, err, nil)
		return
	}

	lib.WriteResponse(w, nil, response)
}

func (h *Handler) FindPurchaseRequest(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	id := lib.GetQueryInt(r, "id", 0)

	response, err := h.service.FindByPRID(ctx, id)
	if err != nil {
		lib.WriteResponse(w, err, nil)
		return
	}

	lib.WriteResponse(w, nil, response)
}

func (h *Handler) CreatePurchaseRequest(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	var request use_case.CreatePurchaseRequest

	err := lib.ReadRequest(r, &request)
	if err != nil {
		lib.WriteResponse(w, err, nil)
		return
	}

	err = h.service.CreatePurchaseRequest(ctx, request)
	if err != nil {
		lib.WriteResponse(w, err, nil)
		return
	}

	lib.WriteResponse(w, nil, nil)
}

func (h *Handler) SwitchGudangPurchaseRequest(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	id := lib.GetQueryInt(r, "id", 0)
	type bodyRequest struct {
		Gudang string `json:"gudang"`
	}

	var request bodyRequest
	err := lib.ReadRequest(r, &request)
	if err != nil {
		lib.WriteResponse(w, err, nil)
		return
	}

	err = h.service.SwitchGudangPurchaseRequest(ctx, id, request.Gudang)
	if err != nil {
		lib.WriteResponse(w, err, nil)
		return
	}

	lib.WriteResponse(w, nil, nil)
}

func (h *Handler) ApprovePurchaseRequest(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	id := lib.GetQueryInt(r, "id", 0)

	err := h.service.ApprovePurchaseRequest(ctx, id)
	if err != nil {
		lib.WriteResponse(w, err, nil)
		return
	}

	lib.WriteResponse(w, nil, nil)
}

/*
Purchase Order Service
*/
func (h *Handler) FindAllPurchaseOrder(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	var request use_case.GetAllPurchaseOrderParams

	//read query params
	request.Paginate.Page = lib.GetQueryInt(r, "page", 1)
	request.Paginate.PageSize = lib.GetQueryInt(r, "page_size", 10)
	request.Paginate.Keyword = r.URL.Query().Get("keyword")

	response, err := h.service.FindAllPurchaseOrder(ctx, request)
	if err != nil {
		lib.WriteResponse(w, err, nil)
		return
	}

	lib.WriteResponse(w, nil, response)
}

func (h *Handler) FindPurchaseOrder(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	id := lib.GetQueryInt(r, "id", 0)

	fmt.Println("id", id)

	response, err := h.service.FindByPOID(ctx, id)
	if err != nil {
		lib.WriteResponse(w, err, nil)
		return
	}

	lib.WriteResponse(w, nil, response)
}

func (h *Handler) CreatePurchaseOrder(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	var request use_case.CreatePurchaseOrder

	err := lib.ReadRequest(r, &request)
	if err != nil {
		lib.WriteResponse(w, err, nil)
		return
	}

	err = h.service.CreatePurchaseOrder(ctx, request)
	if err != nil {
		lib.WriteResponse(w, err, nil)
		return
	}

	lib.WriteResponse(w, nil, nil)
}

func (h *Handler) ApprovePurchaseOrder(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	id := lib.GetQueryInt(r, "id", 0)

	err := h.service.ApprovePurchaseOrder(ctx, id)
	if err != nil {
		lib.WriteResponse(w, err, nil)
		return
	}

	lib.WriteResponse(w, nil, nil)
}

func (h *Handler) DeletePurchaseOrder(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	id := lib.GetQueryInt(r, "id", 0)

	err := h.service.DeletePurchaseOrder(ctx, id)
	if err != nil {
		lib.WriteResponse(w, err, nil)
		return
	}

	lib.WriteResponse(w, nil, nil)
}

func (h *Handler) DeletePurchaseRequest(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	id := lib.GetQueryInt(r, "id", 0)

	err := h.service.DeletePurchaseRequest(ctx, id)
	if err != nil {
		lib.WriteResponse(w, err, nil)
		return
	}

	lib.WriteResponse(w, nil, nil)
}

func (h *Handler) CreateInvoice(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	var request use_case.CreateInvoice

	err := lib.ReadRequest(r, &request)
	if err != nil {
		lib.WriteResponse(w, err, nil)
		return
	}

	err = h.service.CreateInvoice(ctx, request)
	if err != nil {
		lib.WriteResponse(w, err, nil)
		return
	}

	lib.WriteResponse(w, nil, nil)

}

func (h *Handler) FindAllInvoice(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	var request use_case.GetAllInvoiceParams

	//read query params
	request.Paginate.Page = lib.GetQueryInt(r, "page", 1)
	request.Paginate.PageSize = lib.GetQueryInt(r, "page_size", 10)
	request.Paginate.Keyword = r.URL.Query().Get("keyword")
	request.Gudang = r.URL.Query().Get("gudang")

	response, err := h.service.FindAllInvoice(ctx, request)
	if err != nil {
		lib.WriteResponse(w, err, nil)
		return
	}

	lib.WriteResponse(w, nil, response)
}

func (h *Handler) FindInvoice(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	id := lib.GetQueryInt(r, "id", 0)

	response, err := h.service.FindByInvoiceID(ctx, int64(id))
	if err != nil {
		lib.WriteResponse(w, err, nil)
		return
	}

	lib.WriteResponse(w, nil, response)
}

func (h *Handler) PelunasanInvoice(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	id := lib.GetQueryInt(r, "id", 0)
	var request use_case.CreatePembayaranInvoice

	err := lib.ReadRequest(r, &request)
	if err != nil {
		lib.WriteResponse(w, err, nil)
		return
	}

	err = h.service.PelunasanInvoice(ctx, int64(id), request)
	if err != nil {
		lib.WriteResponse(w, err, nil)
		return
	}

	lib.WriteResponse(w, nil, nil)
}
