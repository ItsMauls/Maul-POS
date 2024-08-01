package supplier

type Supplier struct {
	ID     string `json:"id"`
	Nama   string `json:"nama"`
	Alamat string `json:"alamat"`
	Email  string `json:"email"`
}

type SupplierByIDsResponse struct {
	StatusCode int        `json:"status_code"`
	Message    string     `json:"message"`
	Data       []Supplier `json:"data"`
}
