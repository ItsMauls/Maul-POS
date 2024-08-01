package counter

type Counter struct {
	Prefix  string `json:"prefix" db:"prefix"`
	Bulan   string `json:"bulan" db:"bulan"`
	Counter int    `json:"counter" db:"counter"`
}
