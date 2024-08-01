package invoice

import "time"

type Invoice struct {
	ID               int64      `db:"id" json:"id"`
	IDPo             int        `db:"id_po" json:"id_po"`
	NoInvoice        string     `db:"no_invoice" json:"no_invoice"`
	KodeSupplier     string     `db:"kode_supplier" json:"kode_supplier"`
	NamaSupplier     string     `db:"nama_supplier" json:"nama_supplier"`
	TglInvoice       time.Time  `db:"tgl_invoice" json:"tgl_invoice"`
	TglJatuhTempo    time.Time  `db:"tgl_jatuh_tempo" json:"tgl_jatuh_tempo"`
	Total            float64    `db:"total" json:"total"`
	TotalPPN         float64    `db:"total_ppn" json:"total_ppn"`
	TotalDiskon      float64    `db:"total_diskon" json:"total_diskon"`
	TotalNet         float64    `db:"total_net" json:"total_net"`
	MetodePembayaran string     `db:"metode_pembayaran" json:"metode_pembayaran"`
	StatusInvoice    string     `db:"status_invoice" json:"status_invoice"`
	Gudang           string     `db:"gudang" json:"gudang"`
	NoReff           string     `db:"no_reff" json:"no_reff"`
	TglReff          time.Time  `db:"tgl_reff" json:"tgl_reff"`
	CreatedAt        time.Time  `db:"created_at" json:"created_at"`
	UpdatedAt        time.Time  `db:"updated_at" json:"updated_at"`
	DeletedAt        *time.Time `db:"deleted_at" json:"deleted_at"`
	CreatedBy        int64      `db:"created_by" json:"created_by"`
	UpdatedBy        int64      `db:"updated_by" json:"updated_by"`
	DeletedBy        *int64     `db:"deleted_by" json:"deleted_by"`
}

type InvoiceDetail struct {
	ID          int64      `db:"id" json:"id"`
	IDInvoice   int64      `db:"id_invoice" json:"id_invoice"`
	KodeBarang  string     `db:"kode_barang" json:"kode_barang"`
	NamaBarang  string     `db:"nama_barang" json:"nama_barang"`
	Batch       string     `db:"batch" json:"batch"`
	TglExpired  time.Time  `db:"tgl_expired" json:"tgl_expired"`
	Qty         int64      `db:"qty" json:"qty"`
	Isi         int64      `db:"isi" json:"isi"`
	Harga       float64    `db:"harga" json:"harga"`
	Disc        float64    `db:"disc" json:"disc"`
	DiscNominal float64    `db:"disc_nominal" json:"disc_nominal"`
	Total       float64    `db:"total" json:"total"`
	CreatedAt   time.Time  `db:"created_at" json:"created_at"`
	UpdatedAt   time.Time  `db:"updated_at" json:"updated_at"`
	DeletedAt   *time.Time `db:"deleted_at" json:"deleted_at"`
	CreatedBy   int64      `db:"created_by" json:"created_by"`
	UpdatedBy   int64      `db:"updated_by" json:"updated_by"`
	DeletedBy   *int64     `db:"deleted_by" json:"deleted_by"`
}

type PembayaranInvoice struct {
	ID               int        `db:"id" json:"id"`
	IDInvoice        int64      `db:"id_invoice" json:"id_invoice"`
	TglPembayaran    time.Time  `db:"tgl_pembayaran" json:"tgl_pembayaran"`
	TotalPembayaran  float64    `db:"total_pembayaran" json:"total_pembayaran"`
	MetodePembayaran string     `db:"metode_pembayaran" json:"metode_pembayaran"`
	Keterangan       string     `db:"keterangan" json:"keterangan"`
	CreatedAt        time.Time  `db:"created_at" json:"created_at"`
	UpdatedAt        time.Time  `db:"updated_at" json:"updated_at"`
	DeletedAt        *time.Time `db:"deleted_at" json:"deleted_at"`
	CreatedBy        int64      `db:"created_by" json:"created_by"`
	UpdatedBy        int64      `db:"updated_by" json:"updated_by"`
	DeletedBy        *int64     `db:"deleted_by" json:"deleted_by"`
}
