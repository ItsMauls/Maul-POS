package use_case

import (
	"log"
	"time"

	"github.com/apotek-pbf/monorepo-pbf/lib"
	"github.com/apotek-pbf/monorepo-pbf/purchase-service/internal/model/purchase_order"
	"github.com/apotek-pbf/monorepo-pbf/purchase-service/internal/model/purchase_request"
)

type GetAllPurchaseRequestParams struct {
	Paginate lib.PaginationRequest `json:"paginate"`
	Gudang   string                `json:"gudang"`
}

type GetAllInvoiceParams struct {
	Paginate lib.PaginationRequest `json:"paginate"`
	Gudang   string                `json:"gudang"`
}

type CreatePurchaseRequest struct {
	purchase_request.PurchaseRequestHeader
	Detail []purchase_request.PurchaseRequestDetail `json:"detail"`
}

type GetAllPurchaseOrderParams struct {
	Paginate lib.PaginationRequest `json:"paginate"`
}

type CreatePurchaseOrder struct {
	purchase_order.PurchaseOrderHeader
	Detail []PurchaseOrderDetailRequest `json:"detail"`
}

type PurchaseOrderDetailRequest struct {
	IDHeader    int64   `json:"id_hpo"`
	IDDetail    int64   `json:"id_dpo"`
	Detail      int     `json:"detail"`
	KdBrgdg     string  `json:"kd_brgdg"`
	Batch       string  `json:"batch"`
	TglExpired  string  `json:"tgl_expired"`
	Qty         int64   `json:"qty"`
	Isi         int64   `json:"isi"`
	NewItem     bool    `json:"new_item"`
	DiscNominal float64 `json:"disc_nominal"`
	Disc        float64 `json:"disc"`
	Ppn         float64 `json:"ppn"`
}

func (p *PurchaseOrderDetailRequest) ToEntity() purchase_order.PurchaseOrderDetail {
	var tglExpired time.Time
	if p.TglExpired != "" {
		tgl, err := time.Parse("2006-01-02", p.TglExpired)
		if err != nil {
			log.Println("error parse tgl expired", err)
		}
		tglExpired = tgl
	} else {
		// default expired 6 month from now
		tglExpired = time.Now().AddDate(0, 6, 0)
	}
	return purchase_order.PurchaseOrderDetail{
		IDHeader:    p.IDHeader,
		IDDetail:    p.IDDetail,
		Detail:      p.Detail,
		KdBrgdg:     p.KdBrgdg,
		Batch:       p.Batch,
		Qty:         p.Qty,
		Isi:         p.Isi,
		TglExpired:  tglExpired,
		NewItem:     p.NewItem,
		DiscNominal: p.DiscNominal,
		Disc:        p.Disc,
		Ppn:         p.Ppn,
	}
}

type CreateInvoice struct {
	IDPo             int    `json:"id_po"`
	TglJatuhTempo    string `json:"tgl_jatuh_tempo"`
	MetodePembayaran string `json:"metode_pembayaran"`
}

type CreatePembayaranInvoice struct {
	IDInvoice        int64   `json:"id_invoice"`
	TglPembayaran    string  `json:"tgl_pembayaran"`
	TotalPembayaran  float64 `json:"total_pembayaran"`
	MetodePembayaran string  `json:"metode_pembayaran"`
	Keterangan       string  `json:"keterangan"`
}
