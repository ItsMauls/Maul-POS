package barang

import "time"

type MasterBarang struct {
	KodeBarang string     `json:"kode_barang" db:"kode_barang"`
	NamaBarang string     `json:"nama_barang" db:"nama_barang"`
	Isi        int        `json:"isi" db:"isi"`
	IDSatuan   int        `json:"id_satuan" db:"id_satuan"`
	HargaJual  float64    `json:"harga_jual" db:"harga_jual"`
	HargaBeli  float64    `json:"harga_beli" db:"harga_beli"`
	CreatedAt  time.Time  `json:"created_at" db:"created_at"`
	UpdatedAt  time.Time  `json:"updated_at" db:"updated_at"`
	DeletedAt  *time.Time `json:"deleted_at" db:"deleted_at"`
	CreatedBy  int64      `json:"created_by" db:"created_by"`
	UpdatedBy  int64      `json:"updated_by" db:"updated_by"`
	DeletedBy  *int64     `json:"deleted_by" db:"deleted_by"`
}
