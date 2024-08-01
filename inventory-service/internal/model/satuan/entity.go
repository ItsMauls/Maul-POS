package satuan

type Satuan struct {
	ID   int    `json:"id" db:"id_satuan"`
	Nama string `json:"nama" db:"nm_satuan"`
}
