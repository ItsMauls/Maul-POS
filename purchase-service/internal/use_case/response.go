package use_case

import (
	"fmt"

	"github.com/apotek-pbf/monorepo-pbf/lib"
	"github.com/apotek-pbf/monorepo-pbf/purchase-service/internal/model/inventory"
	"github.com/apotek-pbf/monorepo-pbf/purchase-service/internal/model/invoice"
	"github.com/apotek-pbf/monorepo-pbf/purchase-service/internal/model/purchase_order"
	"github.com/apotek-pbf/monorepo-pbf/purchase-service/internal/model/purchase_request"
	"github.com/apotek-pbf/monorepo-pbf/purchase-service/internal/model/supplier"
	"github.com/apotek-pbf/monorepo-pbf/purchase-service/internal/model/user"
)

/*
Purchase Request
*/
type PurchaseRequestHeader struct {
	ID              int64             `json:"id"`
	No              string            `json:"no"`
	Tanggal         string            `json:"tanggal"`
	Keterangan      string            `json:"keterangan"`
	User            user.UserDetail   `json:"user"`
	Supplier        supplier.Supplier `json:"supplier"`
	Total           float64           `json:"total"`
	Gudang          string            `json:"gudang"`
	StatusApproved  string            `json:"status_approved,omitempty"`
	TanggalApproved string            `json:"tanggal_approved,omitempty"`
	UserApproved    user.UserDetail   `json:"user_approved,omitempty"`
	IsSuccess       bool              `json:"is_success"`
}

func (p *PurchaseRequestHeader) FromEntity(entity purchase_request.PurchaseRequestHeader, supplier supplier.Supplier, user user.UserDetail, userApproval user.UserDetail) {
	p.ID = entity.ID
	p.No = fmt.Sprintf("PR%s/%s", entity.Gudang, entity.No)
	p.Tanggal = entity.Tanggal.Format("02/01/2006")
	p.Keterangan = entity.Keterangan
	p.User = user
	p.Supplier = supplier
	p.Total = entity.Total
	p.StatusApproved = entity.StatusApproved
	if entity.TanggalApproved != nil {
		p.TanggalApproved = entity.TanggalApproved.Format("02/01/2006")
	} else {
		p.TanggalApproved = "-"
	}
	p.Gudang = entity.Gudang
	if entity.UserApproved != nil {
		p.UserApproved = userApproval
	}
	p.IsSuccess = entity.IsSuccess
}

type PurchaseRequestDetail struct {
	ID           int64                  `json:"id" db:"id_dpr"`
	Detail       int                    `json:"detail" db:"detail"`
	Barang       inventory.MasterBarang `json:"barang" db:"barang"`
	QtyPesan     int64                  `json:"qty_pesan" db:"qty_pesan"`
	Isi          int                    `json:"isi" db:"isi"`
	HargaNPPN    float64                `json:"harga_ppn" db:"hrg_nppn"`
	IDHPR        int64                  `json:"id_hpr" db:"id_hpr"`
	QtyTerpenuhi int64                  `json:"qty_terpenuhi" db:"qty_terpenuhi"`
}

func (p *PurchaseRequestDetail) FromEntity(entity purchase_request.PurchaseRequestDetail, barang inventory.MasterBarang) {
	p.ID = entity.ID
	p.Detail = entity.Detail
	p.Barang = barang
	p.QtyPesan = entity.QtyPesan
	p.Isi = entity.Isi
	p.HargaNPPN = entity.HargaNPPN
	p.IDHPR = entity.IDHPR
	p.QtyTerpenuhi = entity.QtyTerpenuhi
}

type GetPurchaseRequestResponse struct {
	Header PurchaseRequestHeader   `json:"header"`
	Detail []PurchaseRequestDetail `json:"detail"`
}

type GetPurchaseRequestListResponse struct {
	Data []PurchaseRequestHeader `json:"data"`
	Meta lib.Pagination          `json:"meta"`
}

/*
Purchase Order
*/
type PurchaseOrderHeader struct {
	IDHpo         int64             `json:"id_hpo" db:"id_hpo"`
	IDHpr         int64             `json:"id_hpr" db:"id_hpr"`
	NoPO          string            `json:"no_po" db:"no_po"`
	TglPO         string            `json:"tgl_po" db:"tgl_po"`
	User          user.UserDetail   `json:"user"`
	NoRef         string            `json:"no_ref" db:"no_ref"`
	TglRef        string            `json:"tgl_ref" db:"tgl_ref"`
	Supplier      supplier.Supplier `json:"supplier"`
	Total         float64           `json:"total" db:"total"`
	TotalDiskon   float64           `json:"total_diskon" db:"total_diskon"`
	TotalPPN      float64           `json:"total_ppn" db:"total_ppn"`
	BiayaLain     float64           `json:"biaya_lain" db:"biaya_lain"`
	TotalNet      float64           `json:"total_net" db:"total_net"`
	Round         float64           `json:"round" db:"round"`
	UserApproved1 user.UserDetail   `json:"user_approved_1"`
	UserApproved2 user.UserDetail   `json:"user_approved_2"`
	Gudang        string            `json:"gudang" db:"gudang"`
}

func (p *PurchaseOrderHeader) FromEntity(entity purchase_order.PurchaseOrderHeader) {
	p.IDHpo = entity.IDHpo
	p.IDHpr = entity.IDHpr
	p.NoPO = fmt.Sprintf("PO%s/%s", entity.Gudang, entity.NoPO)
	p.TglPO = entity.TglPO.Format("02/01/2006")
	// p.User = user
	p.NoRef = fmt.Sprintf("PR%s/%s", entity.Gudang, entity.NoRef)
	p.TglRef = entity.TglRef.Format("02/01/2006")
	// p.Supplier = supplier
	p.Total = entity.Total
	p.TotalDiskon = entity.TotalDiskon
	p.TotalPPN = entity.TotalPPN
	p.BiayaLain = entity.BiayaLain
	p.TotalNet = entity.TotalNet
	p.Round = entity.Round
	// p.StatusApproved1 = entity.StatusApproved1
	// p.StatusApproved2 = entity.StatusApproved2
	p.Gudang = entity.Gudang
}

type PurchaseOrderDetail struct {
	IDHpo       int64                  `json:"id_hpo" db:"id_hpo"`
	IDDpo       int64                  `json:"id_dpo" db:"id_dpo"`
	Detail      int                    `json:"detail" db:"detail"`
	Barang      inventory.MasterBarang `json:"barang" db:"barang"`
	Batch       string                 `json:"batch" db:"batch"`
	TglExpired  string                 `json:"tgl_expired" db:"tgl_expired"`
	Qty         int64                  `json:"qty" db:"qty"`
	Isi         int64                  `json:"isi" db:"isi"`
	HrgNppn     float64                `json:"hrg_nppn" db:"hrg_nppn"`
	Ppn         float64                `json:"ppn" db:"ppn"`
	HrgPpn      float64                `json:"hrg_ppn" db:"hrg_ppn"`
	Disc        float64                `json:"disc" db:"disc"`
	DiscNominal float64                `json:"disc_nominal" db:"disc_nominal"`
	TotDisc     float64                `json:"tot_disc" db:"tot_disc"`
	TotalNppn   float64                `json:"total_nppn" db:"total_nppn"`
	TotalPpn    float64                `json:"total_ppn" db:"total_ppn"`
	Total       float64                `json:"total" db:"total"`
	NewItem     bool                   `json:"new_item" db:"new_item"`
	IDHpr       int64                  `json:"id_hpr" db:"id_hpr"`
}

func (p *PurchaseOrderDetail) FromEntity(entity purchase_order.PurchaseOrderDetail, barang inventory.MasterBarang) {
	p.IDHpo = entity.IDHeader
	p.IDDpo = entity.IDDetail
	p.Detail = entity.Detail
	p.Barang = barang
	p.Batch = entity.Batch
	p.TglExpired = entity.TglExpired.Format("02/01/2006")
	p.Qty = entity.Qty
	p.Isi = entity.Isi
	p.HrgNppn = entity.HrgNppn
	p.Ppn = entity.Ppn
	p.HrgPpn = entity.HrgPpn
	p.Disc = entity.Disc
	p.DiscNominal = entity.DiscNominal
	p.TotDisc = entity.TotDisc
	p.TotalNppn = entity.TotalNppn
	p.TotalPpn = entity.TotalPpn
	p.Total = entity.Total
	p.IDHpr = entity.IDHpr
	p.NewItem = entity.NewItem
}

type GetPurchaseOrderResponse struct {
	Header PurchaseOrderHeader   `json:"header"`
	Detail []PurchaseOrderDetail `json:"detail"`
}

type GetPurchaseOrderListResponse struct {
	Data []PurchaseOrderHeader `json:"data"`
	Meta lib.Pagination        `json:"meta"`
}

type GetInvoiceListResponse struct {
	Data []InvoiceHeader `json:"data"`
	Meta lib.Pagination  `json:"meta"`
}

type InvoiceHeader struct {
	ID               int64   `json:"id"`
	NoInvoice        string  `json:"no_invoice"`
	KodeSupplier     string  `json:"kode_supplier"`
	NamaSupplier     string  `json:"nama_supplier"`
	TglInvoice       string  `json:"tgl_invoice"`
	TglJatuhTempo    string  `json:"tgl_jatuh_tempo"`
	Total            float64 `json:"total"`
	TotalPPN         float64 `json:"total_ppn"`
	TotalDiskon      float64 `json:"total_diskon"`
	TotalNet         float64 `json:"total_net"`
	MetodePembayaran string  `json:"metode_pembayaran"`
	StatusInvoice    string  `json:"status_invoice"`
	Gudang           string  `json:"gudang"`
	NoReff           string  `json:"no_reff"`
	TglReff          string  `json:"tgl_reff"`
}

func (i *InvoiceHeader) FromEntity(entity invoice.Invoice) {
	i.ID = entity.ID
	i.NoInvoice = fmt.Sprintf("INV%s/%s", entity.Gudang, entity.NoInvoice)
	i.NoReff = fmt.Sprintf("PO%s/%s", entity.Gudang, entity.NoReff)
	i.TglReff = entity.TglReff.Format("02/01/2006")
	i.KodeSupplier = entity.KodeSupplier
	i.NamaSupplier = entity.NamaSupplier
	i.TglInvoice = entity.TglInvoice.Format("02/01/2006")
	i.TglJatuhTempo = entity.TglJatuhTempo.Format("02/01/2006")
	i.Total = entity.Total
	i.TotalPPN = entity.TotalPPN
	i.TotalDiskon = entity.TotalDiskon
	i.TotalNet = entity.TotalNet
	i.MetodePembayaran = entity.MetodePembayaran
	i.StatusInvoice = entity.StatusInvoice
	i.Gudang = entity.Gudang
}

type InvoiceDetail struct {
	ID          int64   `json:"id"`
	IDInvoice   int64   `json:"id_invoice"`
	KodeBarang  string  `json:"kode_barang"`
	NamaBarang  string  `json:"nama_barang"`
	Batch       string  `json:"batch"`
	TglExpired  string  `json:"tgl_expired"`
	Qty         int64   `json:"qty"`
	Isi         int64   `json:"isi"`
	Harga       float64 `json:"harga"`
	Disc        float64 `json:"disc"`
	DiscNominal float64 `json:"disc_nominal"`
	Total       float64 `json:"total"`
	// Barang      inventory.MasterBarang `json:"barang"`
}

func (i *InvoiceDetail) FromEntity(entity invoice.InvoiceDetail) {
	i.ID = entity.ID
	i.IDInvoice = entity.IDInvoice
	i.KodeBarang = entity.KodeBarang
	i.NamaBarang = entity.NamaBarang
	i.Batch = entity.Batch
	i.TglExpired = entity.TglExpired.Format("02/01/2006")
	i.Qty = entity.Qty
	i.Isi = entity.Isi
	i.Harga = entity.Harga
	i.Disc = entity.Disc
	i.DiscNominal = entity.DiscNominal
	i.Total = entity.Total
}

type PembayaranInvoice struct {
	ID               int     `json:"id"`
	IDInvoice        int64   `json:"id_invoice"`
	TglPembayaran    string  `json:"tgl_pembayaran"`
	TotalPembayaran  float64 `json:"total_pembayaran"`
	MetodePembayaran string  `json:"metode_pembayaran"`
	Keterangan       string  `json:"keterangan"`
}

func (p *PembayaranInvoice) FromEntity(entity invoice.PembayaranInvoice) {
	p.ID = entity.ID
	p.IDInvoice = entity.IDInvoice
	p.TglPembayaran = entity.TglPembayaran.Format("02/01/2006")
	p.TotalPembayaran = entity.TotalPembayaran
	p.MetodePembayaran = entity.MetodePembayaran
	p.Keterangan = entity.Keterangan
}

type GetInvoiceResponse struct {
	Header     InvoiceHeader     `json:"header"`
	Detail     []InvoiceDetail   `json:"detail"`
	Pembayaran PembayaranInvoice `json:"pembayaran,omitempty"`
}
