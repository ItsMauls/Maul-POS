package purchase_request

import "time"

type PurchaseRequestHeader struct {
	ID              int64      `json:"id" db:"id_hpr"`
	No              string     `json:"no" db:"no_pr"`
	Tanggal         time.Time  `json:"tanggal" db:"tgl_pr"`
	Keterangan      string     `json:"keterangan" db:"keterangan"`
	UserID          int64      `json:"user_id" db:"user_id"`
	KodeSupplier    string     `json:"kode_supplier" db:"kd_sup"`
	Total           float64    `json:"total" db:"total"`
	StatusApproved  string     `json:"status_approved" db:"status_approved"`
	TanggalApproved *time.Time `json:"tanggal_approved" db:"tanggal_approved"`
	UserApproved    *int64     `json:"user_approved" db:"user_approved"`
	Gudang          string     `json:"gudang" db:"gudang"`
	IsSuccess       bool       `json:"is_success" db:"is_success"`
	CreatedAt       time.Time  `json:"created_at" db:"created_at"`
	UpdatedAt       time.Time  `json:"updated_at" db:"updated_at"`
	DeleteAt        *time.Time `json:"delete_at" db:"deleted_at"`
	CreatedBy       int64      `json:"created_by" db:"created_by"`
	UpdatedBy       int64      `json:"updated_by" db:"updated_by"`
	DeletedBy       *int64     `json:"deleted_by" db:"deleted_by"`
}

type PurchaseRequestDetail struct {
	ID           int64      `json:"id" db:"id_dpr"`
	Detail       int        `json:"detail" db:"detail"`
	KodeBarang   string     `json:"kode_barang" db:"kd_brgdg"`
	QtyPesan     int64      `json:"qty" db:"qty_pesan"`
	Isi          int        `json:"isi" db:"isi"`
	HargaNPPN    float64    `json:"harga_ppn" db:"hrg_nppn"`
	IDHPR        int64      `json:"id_hpr" db:"id_hpr"`
	QtyTerpenuhi int64      `json:"qty_terpenuhi" db:"qty_terpenuhi"`
	CreatedAt    time.Time  `json:"created_at" db:"created_at"`
	UpdatedAt    time.Time  `json:"updated_at" db:"updated_at"`
	DeleteAt     *time.Time `json:"delete_at" db:"deleted_at"`
	CreatedBy    int64      `json:"created_by" db:"created_by"`
	UpdatedBy    int64      `json:"updated_by" db:"updated_by"`
	DeletedBy    *int64     `json:"deleted_by" db:"deleted_by"`
}
