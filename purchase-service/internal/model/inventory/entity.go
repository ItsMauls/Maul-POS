package inventory

type MasterBarang struct {
	KodeBarang string  `json:"kode_barang" db:"kd_brgdg"`
	NamaBarang string  `json:"nama_barang" db:"nm_brgdg"`
	Isi        int     `json:"isi" db:"isi"`
	IDSatuan   int     `json:"id_satuan" db:"id_satuan"`
	HargaJual  float64 `json:"harga_jual" db:"hj_ecer"`
	HargaBeli  float64 `json:"harga_beli" db:"hb_gross"`
}

type MasterBarangResponse struct {
	StatusCode int            `json:"status_code"`
	Message    string         `json:"message"`
	Data       []MasterBarang `json:"data"`
}
