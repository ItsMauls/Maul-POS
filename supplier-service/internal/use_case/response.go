package use_case

import (
	"github.com/apotek-pbf/monorepo-pbf/lib"
	"github.com/apotek-pbf/monorepo-pbf/supplier-service/internal/model/supplier"
)

type GetListSupplierResponse struct {
	Data []supplier.Supplier `json:"data"`
	Meta lib.Pagination      `json:"meta"`
}
