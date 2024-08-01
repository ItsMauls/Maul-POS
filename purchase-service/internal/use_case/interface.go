package use_case

import (
	"context"

	"github.com/apotek-pbf/monorepo-pbf/lib"
	"github.com/apotek-pbf/monorepo-pbf/purchase-service/internal/model/counter"
	"github.com/apotek-pbf/monorepo-pbf/purchase-service/internal/model/inventory"
	"github.com/apotek-pbf/monorepo-pbf/purchase-service/internal/model/invoice"
	"github.com/apotek-pbf/monorepo-pbf/purchase-service/internal/model/purchase_order"
	"github.com/apotek-pbf/monorepo-pbf/purchase-service/internal/model/purchase_request"
	"github.com/apotek-pbf/monorepo-pbf/purchase-service/internal/model/supplier"
	"github.com/apotek-pbf/monorepo-pbf/purchase-service/internal/model/user"
)

type purchaseRequestRepository interface {
	FindAll(ctx context.Context, request lib.PaginationRequest, gudang string) (data []purchase_request.PurchaseRequestHeader, meta lib.Pagination, err error)
	FindByID(ctx context.Context, id int) (data purchase_request.PurchaseRequestHeader, err error)
	FindDetailByID(ctx context.Context, id int) (data []purchase_request.PurchaseRequestDetail, err error)
	CreatePurchaseRequestHeader(ctx context.Context, purchaseRequestHeader *purchase_request.PurchaseRequestHeader) (data purchase_request.PurchaseRequestHeader, err error)
	CreatePurchaseRequestDetail(ctx context.Context, purchaseRequestDetail *purchase_request.PurchaseRequestDetail) (err error)
	SwitchGudang(ctx context.Context, id int, gudang string) (err error)
	Approve(ctx context.Context, id int) (err error)
	UpdateTerpenuhi(ctx context.Context, idHPR, detail int, qty int) (err error)
	UpdateSuccess(ctx context.Context, id int) (err error)
	FindAllForPO(ctx context.Context, request lib.PaginationRequest, gudang string) (data []purchase_request.PurchaseRequestHeader, meta lib.Pagination, err error)
	DeletePurchaseRequest(ctx context.Context, id int) (err error)
	UpdateTerpenuhiAll(ctx context.Context, idHPR, qty int) (err error)
	BackSuccess(ctx context.Context, id int) (err error)
}

type purchaseOrderRepository interface {
	FindAll(ctx context.Context, request lib.PaginationRequest) (data []purchase_order.PurchaseOrderHeader, meta lib.Pagination, err error)
	FindByID(ctx context.Context, id int) (data purchase_order.PurchaseOrderHeader, err error)
	FindDetailByID(ctx context.Context, id int) (data []purchase_order.PurchaseOrderDetail, err error)
	CreatePurchaseOrderHeader(ctx context.Context, purchaseOrderHeader *purchase_order.PurchaseOrderHeader) (data purchase_order.PurchaseOrderHeader, err error)
	CreatePurchaseOrderDetail(ctx context.Context, purchaseOrderDetail *purchase_order.PurchaseOrderDetail) (err error)
	ApproveApoteker(ctx context.Context, id int, userID int64) (err error)
	ApproveManager(ctx context.Context, id int, userID int64) (err error)
	DeletePurchaseOrder(ctx context.Context, id int) (err error)
	FindByIDs(ctx context.Context, ids []int) (data []purchase_order.PurchaseOrderHeader, err error)
}

type inventoryRepository interface {
	GetBarangByIDs(ctx context.Context, ids []string) (data []inventory.MasterBarang, err error)
}

type supplierRepository interface {
	GetSupplierByIDs(ctx context.Context, ids []string) (data []supplier.Supplier, err error)
}

type userRepository interface {
	GetUserByIDs(ctx context.Context, ids []int64) (data []user.UserDetail, err error)
}

type counterRepository interface {
	FindByPrefixAndBulan(ctx context.Context, prefix, bulan string) (data counter.Counter, err error)
	CreateCounter(ctx context.Context, prefix, bulan string) (err error)
	UpdateCounter(ctx context.Context, prefix, bulan string, counter int) (err error)
}

type invoiceRepository interface {
	CreateInvoice(ctx context.Context, invoice *invoice.Invoice) (err error)
	CreateInvoiceDetail(ctx context.Context, invoiceDetail *invoice.InvoiceDetail) (err error)
	CreatePembayaranInvoice(ctx context.Context, pembayaranInvoice *invoice.PembayaranInvoice) (err error)
	FindAll(ctx context.Context, paginate lib.PaginationRequest, gudang string) (data []invoice.Invoice, meta lib.Pagination, err error)
	FindByID(ctx context.Context, id int64) (data invoice.Invoice, err error)
	FindDetailByID(ctx context.Context, id int64) (data []invoice.InvoiceDetail, err error)
	FindPembayaranByID(ctx context.Context, id int64) (data invoice.PembayaranInvoice, err error)
	UpdateStatusInvoice(ctx context.Context, id int64, status string) (err error)
}
