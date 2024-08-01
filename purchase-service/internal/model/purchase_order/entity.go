package purchase_order

import "time"

type PurchaseOrderHeader struct {
	IDHpo        int64     `json:"id_hpo" db:"id_hpo"`
	IDHpr        int64     `json:"id_hpr" db:"id_hpr"`
	NoPO         string    `json:"no_po" db:"no_po"`
	TglPO        time.Time `json:"tgl_po" db:"tgl_po"`
	UserID       int64     `json:"user_id" db:"user_id"`
	NoRef        string    `json:"no_ref" db:"no_ref"`
	TglRef       time.Time `json:"tgl_ref" db:"tgl_ref"`
	KodeSupplier string    `json:"kd_sup" db:"kd_sup"`
	Total        float64   `json:"total" db:"total"`
	TotalDiskon  float64   `json:"total_diskon" db:"total_diskon"`
	TotalPPN     float64   `json:"total_ppn" db:"total_ppn"`
	BiayaLain    float64   `json:"biaya_lain" db:"biaya_lain"`
	TotalNet     float64   `json:"total_net" db:"total_net"`
	Round        float64   `json:"round" db:"round"`
	// StatusApproved1 string     `json:"status_approved_1" db:"status_approved_1"`
	// StatusApproved2 string     `json:"status_approved_2" db:"status_approved_2"`
	UserApproved1 *int64     `json:"user_approved_1" db:"user_approved_1"`
	UserApproved2 *int64     `json:"user_approved_2" db:"user_approved_2"`
	Gudang        string     `json:"gudang" db:"gudang"`
	CreatedAt     time.Time  `json:"created_at" db:"created_at"`
	UpdatedAt     time.Time  `json:"updated_at" db:"updated_at"`
	DeletedAt     *time.Time `json:"deleted_at" db:"deleted_at"`
	CreatedBy     int64      `json:"created_by" db:"created_by"`
	UpdatedBy     int64      `json:"updated_by" db:"updated_by"`
	DeletedBy     *int64     `json:"deleted_by" db:"deleted_by"`
}

type PurchaseOrderDetail struct {
	IDHeader    int64      `json:"id_hpo" db:"id_hpo"`
	IDDetail    int64      `json:"id_dpo" db:"id_dpo"`
	Detail      int        `json:"detail" db:"detail"`
	KdBrgdg     string     `json:"kd_brgdg" db:"kd_brgdg"`
	Batch       string     `json:"batch" db:"batch"`
	TglExpired  time.Time  `json:"tgl_expired" db:"tgl_expired"`
	Qty         int64      `json:"qty" db:"qty"`
	Isi         int64      `json:"isi" db:"isi"`
	HrgNppn     float64    `json:"hrg_nppn" db:"hrg_nppn"`
	Ppn         float64    `json:"ppn" db:"ppn"`
	HrgPpn      float64    `json:"hrg_ppn" db:"hrg_ppn"`
	Disc        float64    `json:"disc" db:"disc"`
	DiscNominal float64    `json:"disc_nominal" db:"disc_nominal"`
	TotDisc     float64    `json:"tot_disc" db:"tot_disc"`
	TotalNppn   float64    `json:"total_nppn" db:"total_nppn"`
	TotalPpn    float64    `json:"total_ppn" db:"total_ppn"`
	Total       float64    `json:"total" db:"total"`
	IDHpr       int64      `json:"id_hpr" db:"id_hpr"`
	NewItem     bool       `json:"new_item" db:"new_item"`
	CreatedAt   time.Time  `json:"created_at" db:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at" db:"updated_at"`
	DeletedAt   *time.Time `json:"deleted_at" db:"deleted_at"`
	CreatedBy   int64      `json:"created_by" db:"created_by"`
	UpdatedBy   int64      `json:"updated_by" db:"updated_by"`
	DeletedBy   *int64     `json:"deleted_by" db:"deleted_by"`
}
