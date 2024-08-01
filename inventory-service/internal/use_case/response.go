package use_case

import (
	"github.com/apotek-pbf/monorepo-pbf/inventory-service/internal/model/barang"
	"github.com/apotek-pbf/monorepo-pbf/inventory-service/internal/model/satuan"
	"github.com/apotek-pbf/monorepo-pbf/lib"
)

type MasterBarang struct {
	KodeBarang string        `json:"kode_barang"`
	NamaBarang string        `json:"nama_barang"`
	Isi        int           `json:"isi"`
	Satuan     satuan.Satuan `json:"satuan"`
	HargaJual  float64       `json:"harga_jual"`
	HargaBeli  float64       `json:"harga_beli"`
}

func (b *MasterBarang) FromModel(m barang.MasterBarang, s satuan.Satuan) {
	b.KodeBarang = m.KodeBarang
	b.NamaBarang = m.NamaBarang
	b.Isi = m.Isi
	b.HargaJual = m.HargaJual
	b.HargaBeli = m.HargaBeli
	b.Satuan = s
}

type GetAllMasterBarangResponse struct {
	Barangs []MasterBarang `json:"barangs"`
	Meta    lib.Pagination `json:"meta"`
}

type CreateMasterBarangRequest struct {
	KodeBarang string  `json:"kode_barang"`
	NamaBarang string  `json:"nama_barang"`
	Isi        int     `json:"isi"`
	IDSatuan   int     `json:"id_satuan"`
	HargaJual  float64 `json:"harga_jual"`
	HargaBeli  float64 `json:"harga_beli"`
}

func (r *CreateMasterBarangRequest) Validate() error {
	if r.KodeBarang == "" {
		return lib.NewErrBadRequest("KodeBarang is required")
	}
	if r.NamaBarang == "" {
		return lib.NewErrBadRequest("NamaBarang is required")
	}
	if r.IDSatuan == 0 {
		return lib.NewErrBadRequest("IDSatuan is required")
	}
	if r.HargaJual == 0 {
		return lib.NewErrBadRequest("HargaJual is required")
	}
	if r.HargaBeli == 0 {
		return lib.NewErrBadRequest("HargaBeli is required")
	}
	if r.Isi == 0 {
		r.Isi = 1
	}

	return nil
}

func (r *CreateMasterBarangRequest) ToModel() *barang.MasterBarang {
	return &barang.MasterBarang{
		KodeBarang: r.KodeBarang,
		NamaBarang: r.NamaBarang,
		Isi:        r.Isi,
		IDSatuan:   r.IDSatuan,
		HargaJual:  r.HargaJual,
		HargaBeli:  r.HargaBeli,
	}
}
