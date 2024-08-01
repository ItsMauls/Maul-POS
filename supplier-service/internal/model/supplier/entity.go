package supplier

type Supplier struct {
	ID     string `json:"id" db:"id_supplier"`
	Nama   string `json:"nama" db:"nm_supplier"`
	Alamat string `json:"alamat" db:"alamat"`
	Email  string `json:"email" db:"email"`
}
