package use_case

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"github.com/apotek-pbf/monorepo-pbf/lib"
	"github.com/apotek-pbf/monorepo-pbf/purchase-service/internal/model/counter"
	"github.com/apotek-pbf/monorepo-pbf/purchase-service/internal/model/inventory"
	"github.com/apotek-pbf/monorepo-pbf/purchase-service/internal/model/invoice"
	"github.com/apotek-pbf/monorepo-pbf/purchase-service/internal/model/purchase_order"
	"github.com/apotek-pbf/monorepo-pbf/purchase-service/internal/model/purchase_request"
	"github.com/apotek-pbf/monorepo-pbf/purchase-service/internal/model/supplier"
	"github.com/apotek-pbf/monorepo-pbf/purchase-service/internal/model/user"
)

type Service struct {
	purchaseRequestRepository purchaseRequestRepository
	purchaseOrderRepository   purchaseOrderRepository
	inventoryRepository       inventoryRepository
	supplierRepository        supplierRepository
	userRepository            userRepository
	counterRepository         counterRepository
	invoiceRepository         invoiceRepository
	conn                      *lib.SQLServerConnectionManager
	db                        *lib.SingleInstruction
	tx                        *lib.MultiInstruction
	log                       *lib.AggregateLogger
}

func NewService(cfg lib.Config, conn *lib.SQLServerConnectionManager, log *lib.AggregateLogger) *Service {
	db := conn.GetQuery()
	return &Service{
		inventoryRepository:       inventory.NewClient(&cfg.ApiConfig, log),
		purchaseRequestRepository: purchase_request.NewRepository(db, log),
		purchaseOrderRepository:   purchase_order.NewRepository(db, log),
		supplierRepository:        supplier.NewClient(&cfg.ApiConfig, log),
		userRepository:            user.NewClient(&cfg.ApiConfig, log),
		counterRepository:         counter.NewRepository(db, log),
		invoiceRepository:         invoice.NewRepository(db, log),
		conn:                      conn,
		db:                        db,
		log:                       log,
	}
}

func (s *Service) WithTransaction() {
	s.tx = s.conn.GetTransaction()
	s.purchaseRequestRepository = purchase_request.NewRepository(s.tx, s.log)
	s.counterRepository = counter.NewRepository(s.tx, s.log)
	s.purchaseOrderRepository = purchase_order.NewRepository(s.tx, s.log)
	s.invoiceRepository = invoice.NewRepository(s.tx, s.log)
}

func (s *Service) WithoutTransaction() {
	s.purchaseRequestRepository = purchase_request.NewRepository(s.db, s.log)
	s.counterRepository = counter.NewRepository(s.db, s.log)
	s.purchaseOrderRepository = purchase_order.NewRepository(s.db, s.log)
	s.invoiceRepository = invoice.NewRepository(s.db, s.log)
}

/*
Purchase Request Service
*/

func (s *Service) FindAllPurchaseRequestForPO(ctx context.Context, request GetAllPurchaseRequestParams) (response GetPurchaseRequestListResponse, err error) {
	if request.Gudang == "" {
		request.Gudang = "01"
	}

	dataEntity, metaEntity, err := s.purchaseRequestRepository.FindAllForPO(ctx, request.Paginate, request.Gudang)
	if err != nil {
		return
	}

	supplierIDs := []string{}
	userIDs := []int64{}
	for _, v := range dataEntity {
		supplierIDs = append(supplierIDs, v.KodeSupplier)
		userIDs = append(userIDs, v.UserID)
	}

	suppliers, err := s.supplierRepository.GetSupplierByIDs(ctx, supplierIDs)
	if err != nil {
		return
	}

	mapSupplier := map[string]supplier.Supplier{}
	for _, v := range suppliers {
		mapSupplier[v.ID] = v
	}

	users, err := s.userRepository.GetUserByIDs(ctx, userIDs)
	if err != nil {
		return
	}

	mapUser := map[int64]user.UserDetail{}
	for _, v := range users {
		mapUser[v.ID] = v
	}

	for _, v := range dataEntity {
		p := PurchaseRequestHeader{}
		p.FromEntity(v, mapSupplier[v.KodeSupplier], mapUser[v.UserID], user.UserDetail{})
		response.Data = append(response.Data, p)
	}

	response.Meta = metaEntity
	return
}

func (s *Service) FindAllPurchaseRequest(ctx context.Context, request GetAllPurchaseRequestParams) (response GetPurchaseRequestListResponse, err error) {
	if request.Gudang == "" {
		request.Gudang = "01"
	}

	dataEntity, metaEntity, err := s.purchaseRequestRepository.FindAll(ctx, request.Paginate, request.Gudang)
	if err != nil {
		return
	}

	supplierIDs := []string{}
	userIDs := []int64{}
	for _, v := range dataEntity {
		supplierIDs = append(supplierIDs, v.KodeSupplier)
		userIDs = append(userIDs, v.UserID)
		if v.UserApproved != nil {
			userIDs = append(userIDs, *v.UserApproved)
		}
	}

	suppliers, err := s.supplierRepository.GetSupplierByIDs(ctx, supplierIDs)
	if err != nil {
		return
	}

	mapSupplier := map[string]supplier.Supplier{}
	for _, v := range suppliers {
		mapSupplier[v.ID] = v
	}

	users, err := s.userRepository.GetUserByIDs(ctx, userIDs)
	if err != nil {
		return
	}

	mapUser := map[int64]user.UserDetail{}
	for _, v := range users {
		mapUser[v.ID] = v
	}

	for _, v := range dataEntity {
		p := PurchaseRequestHeader{}
		if v.UserApproved == nil {
			p.FromEntity(v, mapSupplier[v.KodeSupplier], mapUser[v.UserID], user.UserDetail{})
		} else {
			p.FromEntity(v, mapSupplier[v.KodeSupplier], mapUser[v.UserID], mapUser[*v.UserApproved])
		}
		response.Data = append(response.Data, p)
	}

	response.Meta = metaEntity
	return
}

func (s *Service) FindByPRID(ctx context.Context, id int) (data GetPurchaseRequestResponse, err error) {
	headerEntity, err := s.purchaseRequestRepository.FindByID(ctx, id)
	if err != nil {
		return
	}

	detailEntity, err := s.purchaseRequestRepository.FindDetailByID(ctx, id)
	if err != nil {
		return
	}

	kdBrgdgs := []string{}
	for _, v := range detailEntity {
		kdBrgdgs = append(kdBrgdgs, v.KodeBarang)
	}

	barang, err := s.inventoryRepository.GetBarangByIDs(ctx, kdBrgdgs)
	if err != nil {
		return
	}

	mapBarang := map[string]inventory.MasterBarang{}
	for _, v := range barang {
		mapBarang[v.KodeBarang] = v
	}

	idSupplier := []string{headerEntity.KodeSupplier}
	suppliers, err := s.supplierRepository.GetSupplierByIDs(ctx, idSupplier)
	if err != nil {
		return
	}

	userIDs := []int64{}
	userIDs = append(userIDs, headerEntity.UserID)
	if headerEntity.UserApproved != nil {
		userIDs = append(userIDs, *headerEntity.UserApproved)
	}

	users, err := s.userRepository.GetUserByIDs(ctx, userIDs)
	if err != nil {
		return
	}

	mapUser := map[int64]user.UserDetail{}
	for _, v := range users {
		mapUser[v.ID] = v
	}

	// data.Header.FromEntity(headerEntity, suppliers[0], mapUser[headerEntity.UserID], mapUser[*headerEntity.UserApproved])
	if headerEntity.UserApproved == nil {
		data.Header.FromEntity(headerEntity, suppliers[0], mapUser[headerEntity.UserID], user.UserDetail{})
	} else {
		data.Header.FromEntity(headerEntity, suppliers[0], mapUser[headerEntity.UserID], mapUser[*headerEntity.UserApproved])
	}
	for _, v := range detailEntity {
		p := PurchaseRequestDetail{}
		p.FromEntity(v, mapBarang[v.KodeBarang])
		data.Detail = append(data.Detail, p)
	}

	return
}

func (s *Service) CreatePurchaseRequest(ctx context.Context, request CreatePurchaseRequest) (err error) {
	s.WithTransaction()
	defer func() {
		if p := recover(); p != nil {
			s.log.ErrorF("panic: %v", p)
			s.tx.Rollback(ctx)
			err = fmt.Errorf("panic: %v", p)
		} else if err != nil {
			s.tx.Rollback(ctx)
		} else {
			s.tx.Commit(ctx)
		}
		s.WithoutTransaction()
	}()

	user := lib.GetUserContext(ctx)

	s.tx.Begin(ctx)

	counter, err := s.counterRepository.FindByPrefixAndBulan(ctx, "PR", time.Now().Format("200601"))
	if err != nil {
		if err == sql.ErrNoRows {
			err = s.counterRepository.CreateCounter(ctx, "PR", time.Now().Format("200601"))
			if err != nil {
				return
			}
			counter.Counter = 0
		} else {
			return
		}
	}

	counter.Counter++

	var kodeBarangs []string
	for _, v := range request.Detail {
		kodeBarangs = append(kodeBarangs, v.KodeBarang)
	}

	barang, err := s.inventoryRepository.GetBarangByIDs(ctx, kodeBarangs)
	if err != nil {
		return
	}

	mapBarang := map[string]inventory.MasterBarang{}
	for _, v := range barang {
		mapBarang[v.KodeBarang] = v
	}

	var total float64
	for _, v := range request.Detail {
		total += float64(v.QtyPesan) * mapBarang[v.KodeBarang].HargaBeli
	}

	header := purchase_request.PurchaseRequestHeader{
		No:           fmt.Sprintf("%s%04d", time.Now().Format("200601"), counter.Counter),
		Tanggal:      time.Now(),
		Keterangan:   request.Keterangan,
		UserID:       user.ID,
		KodeSupplier: request.KodeSupplier,
		Total:        total,
		CreatedBy:    user.ID,
		UpdatedBy:    user.ID,
	}

	headerRes, err := s.purchaseRequestRepository.CreatePurchaseRequestHeader(ctx, &header)
	if err != nil {
		return
	}

	for i, v := range request.Detail {
		detail := purchase_request.PurchaseRequestDetail{
			Detail:     i + 1,
			KodeBarang: v.KodeBarang,
			QtyPesan:   v.QtyPesan,
			Isi:        mapBarang[v.KodeBarang].Isi,
			HargaNPPN:  mapBarang[v.KodeBarang].HargaBeli,
			IDHPR:      headerRes.ID,
			CreatedBy:  user.ID,
			UpdatedBy:  user.ID,
		}

		err = s.purchaseRequestRepository.CreatePurchaseRequestDetail(ctx, &detail)
		if err != nil {
			return
		}
	}

	err = s.counterRepository.UpdateCounter(ctx, "PR", time.Now().Format("200601"), counter.Counter)
	if err != nil {
		return
	}

	return
}

func (s *Service) SwitchGudangPurchaseRequest(ctx context.Context, id int, gudang string) (err error) {
	if gudang == "" {
		gudang = "01"
	}

	if id == 0 {
		err = fmt.Errorf("id is required")
		return
	}

	data, err := s.purchaseRequestRepository.FindByID(ctx, id)
	if err != nil {
		return
	}

	if data.StatusApproved == "Y" {
		err = fmt.Errorf("purchase request sudah di approve tidak bisa diubah gudang")
		return
	}

	err = s.purchaseRequestRepository.SwitchGudang(ctx, id, gudang)
	if err != nil {
		return
	}

	return
}

func (s *Service) ApprovePurchaseRequest(ctx context.Context, id int) (err error) {
	if id == 0 {
		err = fmt.Errorf("id is required")
		return
	}

	data, err := s.purchaseRequestRepository.FindByID(ctx, id)
	if err != nil {
		return
	}

	if data.StatusApproved == "Y" {
		err = fmt.Errorf("purchase request sudah di approve")
		return
	}

	err = s.purchaseRequestRepository.Approve(ctx, id)
	if err != nil {
		return
	}

	return
}

/*
Purchase Order Service
*/
func (s *Service) FindAllPurchaseOrder(ctx context.Context, request GetAllPurchaseOrderParams) (response GetPurchaseOrderListResponse, err error) {
	dataEntity, metaEntity, err := s.purchaseOrderRepository.FindAll(ctx, request.Paginate)
	if err != nil {
		return
	}

	supplierIDs := []string{}
	userIDs := []int64{}
	for _, v := range dataEntity {
		supplierIDs = append(supplierIDs, v.KodeSupplier)
		userIDs = append(userIDs, v.UserID)
		if v.UserApproved1 != nil {
			userIDs = append(userIDs, *v.UserApproved1)
		}
		if v.UserApproved2 != nil {
			userIDs = append(userIDs, *v.UserApproved2)
		}
	}

	suppliers, err := s.supplierRepository.GetSupplierByIDs(ctx, supplierIDs)
	if err != nil {
		return
	}

	mapSupplier := map[string]supplier.Supplier{}
	for _, v := range suppliers {
		mapSupplier[v.ID] = v
	}

	users, err := s.userRepository.GetUserByIDs(ctx, userIDs)
	if err != nil {
		return
	}

	mapUser := map[int64]user.UserDetail{}
	for _, v := range users {
		mapUser[v.ID] = v
	}

	for _, v := range dataEntity {
		p := PurchaseOrderHeader{}
		p.FromEntity(v)
		p.Supplier = mapSupplier[v.KodeSupplier]
		p.User = mapUser[v.UserID]
		if v.UserApproved1 != nil {
			p.UserApproved1 = mapUser[*v.UserApproved1]
		}
		if v.UserApproved2 != nil {
			p.UserApproved2 = mapUser[*v.UserApproved2]
		}
		response.Data = append(response.Data, p)
	}

	response.Meta = metaEntity
	return
}

func (s *Service) FindByPOID(ctx context.Context, id int) (data GetPurchaseOrderResponse, err error) {
	headerEntity, err := s.purchaseOrderRepository.FindByID(ctx, id)
	if err != nil {
		return
	}

	detailEntity, err := s.purchaseOrderRepository.FindDetailByID(ctx, id)
	if err != nil {
		return
	}

	kdBrgdgs := []string{}
	for _, v := range detailEntity {
		kdBrgdgs = append(kdBrgdgs, v.KdBrgdg)
	}

	barang, err := s.inventoryRepository.GetBarangByIDs(ctx, kdBrgdgs)
	if err != nil {
		return
	}

	mapBarang := map[string]inventory.MasterBarang{}
	for _, v := range barang {
		mapBarang[v.KodeBarang] = v
	}

	idSupplier := []string{headerEntity.KodeSupplier}
	suppliers, err := s.supplierRepository.GetSupplierByIDs(ctx, idSupplier)
	if err != nil {
		return
	}

	userIDs := []int64{}
	userIDs = append(userIDs, headerEntity.UserID)
	if headerEntity.UserApproved1 != nil {
		userIDs = append(userIDs, *headerEntity.UserApproved1)
	}
	if headerEntity.UserApproved2 != nil {
		userIDs = append(userIDs, *headerEntity.UserApproved2)
	}
	users, err := s.userRepository.GetUserByIDs(ctx, userIDs)
	if err != nil {
		return
	}

	mapUser := map[int64]user.UserDetail{}
	for _, v := range users {
		mapUser[v.ID] = v
	}
	// fmt.Println("map all params : %+v", mapBarang, mapUser, suppliers)
	data.Header.FromEntity(headerEntity)
	data.Header.Supplier = suppliers[0]
	data.Header.User = mapUser[headerEntity.UserID]
	if headerEntity.UserApproved1 != nil {
		data.Header.UserApproved1 = mapUser[*headerEntity.UserApproved1]
	}
	if headerEntity.UserApproved2 != nil {
		data.Header.UserApproved2 = mapUser[*headerEntity.UserApproved2]
	}

	for _, v := range detailEntity {
		p := PurchaseOrderDetail{}
		p.FromEntity(v, mapBarang[v.KdBrgdg])
		data.Detail = append(data.Detail, p)
	}

	return
}

func (s *Service) CreatePurchaseOrder(ctx context.Context, request CreatePurchaseOrder) (err error) {
	s.WithTransaction()
	defer func() {
		if p := recover(); p != nil {
			s.log.ErrorF("panic: %v", p)
			s.tx.Rollback(ctx)
			err = fmt.Errorf("panic: %v", p)
		} else if err != nil {
			s.tx.Rollback(ctx)
		} else {
			s.tx.Commit(ctx)
		}
		s.WithoutTransaction()
	}()

	user := lib.GetUserContext(ctx)

	s.tx.Begin(ctx)

	counter, err := s.counterRepository.FindByPrefixAndBulan(ctx, "PO", time.Now().Format("200601"))
	if err != nil {
		if err == sql.ErrNoRows {
			err = s.counterRepository.CreateCounter(ctx, "PO", time.Now().Format("200601"))
			if err != nil {
				return
			}
			counter.Counter = 0
		} else {
			return
		}
	}

	counter.Counter++

	idSupplier := []string{request.KodeSupplier}
	suppliers, err := s.supplierRepository.GetSupplierByIDs(ctx, idSupplier)
	if err != nil {
		return
	}

	if len(suppliers) == 0 {
		err = fmt.Errorf("supplier not found")
		return
	}

	var kodeBarangs []string
	for _, v := range request.Detail {
		kodeBarangs = append(kodeBarangs, v.KdBrgdg)
	}

	barang, err := s.inventoryRepository.GetBarangByIDs(ctx, kodeBarangs)
	if err != nil {
		return
	}

	mapBarang := map[string]inventory.MasterBarang{}
	for _, v := range barang {
		mapBarang[v.KodeBarang] = v
	}

	var total float64
	var totalDiskon float64
	var totalPPN float64
	var totalNoPPN float64

	for _, v := range request.Detail {
		// detail.reduce((acc, item) => acc + (item.barang.harga_beli * item.qty) - item.disc_nominal, 0) + (detail.reduce((acc, item) => acc + (item.barang.harga_beli * item.qty) - item.disc_nominal, 0) * ppn / 100)
		total += (float64(v.Qty) * mapBarang[v.KdBrgdg].HargaBeli) - v.DiscNominal + ((float64(v.Qty)*mapBarang[v.KdBrgdg].HargaBeli)-v.DiscNominal)*v.Ppn/100
		totalDiskon += v.DiscNominal
		// detail.reduce((acc, item) => acc + (item.barang.harga_beli * item.qty) - item.disc_nominal, 0) * ppn / 100
		totalPPN += ((float64(v.Qty) * mapBarang[v.KdBrgdg].HargaBeli) - v.DiscNominal) * v.Ppn / 100
		// detail.reduce((acc, item) => acc + (item.barang.harga_beli * item.qty) - item.disc_nominal, 0)
		totalNoPPN += (float64(v.Qty) * mapBarang[v.KdBrgdg].HargaBeli) - v.DiscNominal
	}

	thPR, err := s.purchaseRequestRepository.FindByID(ctx, int(request.IDHpr))
	if err != nil {
		return
	}

	header := purchase_order.PurchaseOrderHeader{
		NoPO:         fmt.Sprintf("%s%04d", time.Now().Format("200601"), counter.Counter),
		IDHpr:        request.IDHpr,
		TglPO:        time.Now(),
		UserID:       user.ID,
		NoRef:        thPR.No,
		TglRef:       thPR.Tanggal,
		KodeSupplier: request.KodeSupplier,
		Total:        float64(round((total))),
		TotalDiskon:  totalDiskon,
		TotalPPN:     float64(round((totalPPN))),
		BiayaLain:    request.BiayaLain,
		TotalNet:     totalNoPPN,
		Round:        0,
		Gudang:       thPR.Gudang,
		CreatedBy:    user.ID,
		UpdatedBy:    user.ID,
	}

	headerRes, err := s.purchaseOrderRepository.CreatePurchaseOrderHeader(ctx, &header)
	if err != nil {
		return
	}

	for i, v := range request.Detail {
		data := v.ToEntity()
		data.IDHeader = headerRes.IDHpo
		data.IDDetail = int64(i + 1)
		data.IDHpr = header.IDHpr
		data.CreatedBy = user.ID
		data.UpdatedBy = user.ID
		data.HrgNppn = mapBarang[v.KdBrgdg].HargaBeli
		data.Ppn = v.Ppn
		data.HrgPpn = float64(round((mapBarang[v.KdBrgdg].HargaBeli * v.Ppn / 100)))
		data.Disc = v.Disc
		data.DiscNominal = v.DiscNominal
		data.TotDisc = 0
		data.TotalNppn = float64((mapBarang[v.KdBrgdg].HargaBeli*float64(v.Qty) - v.DiscNominal))
		data.TotalPpn = float64(round((mapBarang[v.KdBrgdg].HargaBeli*float64(v.Qty) - v.DiscNominal) * v.Ppn / 100))
		data.Total = float64(round((mapBarang[v.KdBrgdg].HargaBeli*float64(v.Qty) - v.DiscNominal) + ((mapBarang[v.KdBrgdg].HargaBeli*float64(v.Qty) - v.DiscNominal) * v.Ppn / 100)))
		if data.Batch == "" {
			data.Batch = "0"
		}

		err = s.purchaseOrderRepository.CreatePurchaseOrderDetail(ctx, &data)
		if err != nil {
			return
		}

		if !v.NewItem {
			err = s.purchaseRequestRepository.UpdateTerpenuhi(ctx, int(request.IDHpr), v.Detail, int(v.Qty))
			if err != nil {
				return
			}
		}

	}

	err = s.counterRepository.UpdateCounter(ctx, "PO", time.Now().Format("200601"), counter.Counter)
	if err != nil {
		return
	}

	detailPR, err := s.purchaseRequestRepository.FindDetailByID(ctx, int(request.IDHpr))
	if err != nil {
		return
	}

	for _, v := range detailPR {
		if v.QtyPesan != v.QtyTerpenuhi {
			return
		}
	}

	err = s.purchaseRequestRepository.UpdateSuccess(ctx, int(request.IDHpr))
	if err != nil {
		return
	}

	return
}

func (s *Service) ApprovePurchaseOrder(ctx context.Context, id int) (err error) {
	if id == 0 {
		err = lib.NewErrBadRequest("id is required")
		return
	}

	user := lib.GetUserContext(ctx)

	data, err := s.purchaseOrderRepository.FindByID(ctx, id)
	if err != nil {
		return
	}

	switch user.Role.Name {
	case "APOTEKER":
		if data.UserApproved1 != nil {
			err = lib.NewErrBadRequest("purchase order sudah di approve")
			return
		}

		err = s.purchaseOrderRepository.ApproveApoteker(ctx, id, user.ID)
		if err != nil {
			return
		}
	case "MANAGER":
		if data.UserApproved2 != nil {
			err = lib.NewErrBadRequest("purchase order sudah di approve")
			return
		}

		err = s.purchaseOrderRepository.ApproveManager(ctx, id, user.ID)
		if err != nil {
			return
		}
	default:
		err = lib.NewErrBadRequest("role tidak diizinkan melakukan approve")
		return
	}

	return
}

func (s *Service) DeletePurchaseRequest(ctx context.Context, id int) (err error) {
	if id == 0 {
		err = lib.NewErrBadRequest("id is required")
		return
	}

	data, err := s.purchaseRequestRepository.FindByID(ctx, id)
	if err != nil {
		return
	}

	if data.StatusApproved == "Y" {
		err = lib.NewErrBadRequest("purchase request sudah di approve tidak bisa di hapus")
		return
	}

	err = s.purchaseRequestRepository.DeletePurchaseRequest(ctx, id)
	if err != nil {
		return
	}

	return
}

func (s *Service) DeletePurchaseOrder(ctx context.Context, id int) (err error) {
	if id == 0 {
		err = lib.NewErrBadRequest("id is required")
		return
	}

	data, err := s.purchaseOrderRepository.FindByID(ctx, id)
	if err != nil {
		return
	}

	if data.UserApproved1 != nil || data.UserApproved2 != nil {
		err = lib.NewErrBadRequest("purchase order sudah di approve tidak bisa di hapus")
		return
	}

	err = s.purchaseOrderRepository.DeletePurchaseOrder(ctx, id)
	if err != nil {
		return
	}

	err = s.purchaseRequestRepository.BackSuccess(ctx, int(data.IDHpr))
	if err != nil {
		return
	}

	err = s.purchaseRequestRepository.UpdateTerpenuhiAll(ctx, int(data.IDHpr), 0)
	if err != nil {
		return
	}

	return
}

/*
Invoice Service
*/

func (s *Service) CreateInvoice(ctx context.Context, request CreateInvoice) (err error) {
	s.WithTransaction()
	defer func() {
		if p := recover(); p != nil {
			s.log.ErrorF("panic: %v", p)
			s.tx.Rollback(ctx)
			err = fmt.Errorf("panic: %v", p)
		} else if err != nil {
			s.tx.Rollback(ctx)
		} else {
			s.tx.Commit(ctx)
		}
		s.WithoutTransaction()
	}()

	s.tx.Begin(ctx)

	dataPo, err := s.purchaseOrderRepository.FindByID(ctx, request.IDPo)
	if err != nil {
		return
	}

	if dataPo.UserApproved2 == nil {
		err = lib.NewErrBadRequest("purchase order belum di approve manager")
		return
	}

	user := lib.GetUserContext(ctx)

	var tglJthTempo time.Time
	if request.TglJatuhTempo == "" {
		tglJthTempo = time.Now().AddDate(0, 0, 30)
	} else {
		tglJthTempo, err = time.Parse("2006-01-02", request.TglJatuhTempo)
		if err != nil {
			return
		}
	}

	counter, err := s.counterRepository.FindByPrefixAndBulan(ctx, "INV", time.Now().Format("200601"))
	if err != nil {
		if err == sql.ErrNoRows {
			err = s.counterRepository.CreateCounter(ctx, "INV", time.Now().Format("200601"))
			if err != nil {
				return
			}
			counter.Counter = 0
		} else {
			return
		}
	}

	counter.Counter++

	idSupplier := []string{dataPo.KodeSupplier}
	suppliers, err := s.supplierRepository.GetSupplierByIDs(ctx, idSupplier)
	if err != nil {
		return
	}

	if len(suppliers) == 0 {
		err = fmt.Errorf("supplier not found")
		return
	}

	var statusInvoice string = "N"
	if request.MetodePembayaran == "CASH" {
		statusInvoice = "Y"
	}

	header := invoice.Invoice{
		NoInvoice:        fmt.Sprintf("%s%04d", time.Now().Format("200601"), counter.Counter),
		IDPo:             request.IDPo,
		KodeSupplier:     dataPo.KodeSupplier,
		NamaSupplier:     suppliers[0].Nama,
		TglInvoice:       time.Now(),
		TglJatuhTempo:    tglJthTempo,
		Total:            dataPo.Total,
		TotalPPN:         dataPo.TotalPPN,
		TotalNet:         dataPo.TotalNet,
		TotalDiskon:      dataPo.TotalDiskon,
		MetodePembayaran: request.MetodePembayaran,
		StatusInvoice:    statusInvoice,
		Gudang:           dataPo.Gudang,
		NoReff:           dataPo.NoPO,
		TglReff:          dataPo.TglPO,
		CreatedBy:        user.ID,
		UpdatedBy:        user.ID,
	}

	err = s.invoiceRepository.CreateInvoice(ctx, &header)
	if err != nil {
		if err.Error() == "pq: duplicate key value violates unique constraint \"invoice_id_po_key\"" {
			err = lib.NewErrBadRequest("invoice sudah dibuat")
			return
		}
		return
	}

	if request.MetodePembayaran == "CASH" {
		statusInvoice = "Y"
		// create pembayaran
		err = s.invoiceRepository.CreatePembayaranInvoice(ctx, &invoice.PembayaranInvoice{
			IDInvoice:        header.ID,
			TglPembayaran:    time.Now(),
			TotalPembayaran:  header.Total,
			CreatedBy:        user.ID,
			UpdatedBy:        user.ID,
			Keterangan:       "Pembayaran Cash",
			MetodePembayaran: "CASH",
		})
		if err != nil {
			return
		}
	}

	detailPo, err := s.purchaseOrderRepository.FindDetailByID(ctx, request.IDPo)
	if err != nil {
		return
	}

	idBarang := []string{}
	for _, v := range detailPo {
		idBarang = append(idBarang, v.KdBrgdg)
	}

	barang, err := s.inventoryRepository.GetBarangByIDs(ctx, idBarang)
	if err != nil {
		return
	}

	mapBarang := map[string]inventory.MasterBarang{}
	for _, v := range barang {
		mapBarang[v.KodeBarang] = v
	}

	for _, v := range detailPo {
		detail := invoice.InvoiceDetail{
			IDInvoice:   header.ID,
			KodeBarang:  v.KdBrgdg,
			NamaBarang:  mapBarang[v.KdBrgdg].NamaBarang,
			Batch:       v.Batch,
			TglExpired:  v.TglExpired,
			Qty:         v.Qty,
			Isi:         v.Isi,
			Harga:       v.HrgNppn,
			Disc:        v.Disc,
			DiscNominal: v.DiscNominal,
			Total:       v.Total,
			CreatedBy:   user.ID,
			UpdatedBy:   user.ID,
		}

		err = s.invoiceRepository.CreateInvoiceDetail(ctx, &detail)
		if err != nil {
			return
		}

	}

	err = s.counterRepository.UpdateCounter(ctx, "INV", time.Now().Format("200601"), counter.Counter)
	if err != nil {
		return
	}

	return
}

func (s *Service) FindAllInvoice(ctx context.Context, request GetAllInvoiceParams) (response GetInvoiceListResponse, err error) {
	if request.Gudang == "" {
		request.Gudang = "01"
	}

	if request.Paginate.Page == 0 {
		request.Paginate.Page = 1
	}

	if request.Paginate.PageSize == 0 {
		request.Paginate.PageSize = 10
	}

	dataEntity, metaEntity, err := s.invoiceRepository.FindAll(ctx, request.Paginate, request.Gudang)
	if err != nil {
		return
	}

	for _, v := range dataEntity {
		p := InvoiceHeader{}
		p.FromEntity(v)
		response.Data = append(response.Data, p)
	}

	response.Meta = metaEntity
	return
}

func (s *Service) FindByInvoiceID(ctx context.Context, id int64) (data GetInvoiceResponse, err error) {
	headerEntity, err := s.invoiceRepository.FindByID(ctx, id)
	if err != nil {
		return
	}

	detailEntity, err := s.invoiceRepository.FindDetailByID(ctx, id)
	if err != nil {
		return
	}

	pembayaran, err := s.invoiceRepository.FindPembayaranByID(ctx, id)
	if err != nil {
		if err == sql.ErrNoRows {
			err = nil
		} else {
			return
		}
	}

	if pembayaran.ID != 0 {
		data.Pembayaran.FromEntity(pembayaran)
	}

	data.Header.FromEntity(headerEntity)

	for _, v := range detailEntity {
		p := InvoiceDetail{}
		p.FromEntity(v)
		// p.Barang = mapBarang[v.KodeBarang]
		data.Detail = append(data.Detail, p)
	}

	return
}

func (s *Service) PelunasanInvoice(ctx context.Context, id int64, request CreatePembayaranInvoice) (err error) {
	if id == 0 {
		err = lib.NewErrBadRequest("id is required")
		return
	}

	user := lib.GetUserContext(ctx)

	data, err := s.invoiceRepository.FindByID(ctx, id)
	if err != nil {
		return
	}

	if data.StatusInvoice == "Y" {
		err = lib.NewErrBadRequest("invoice sudah lunas")
		return
	}

	// create pembayaran
	err = s.invoiceRepository.CreatePembayaranInvoice(ctx, &invoice.PembayaranInvoice{
		IDInvoice:        id,
		TglPembayaran:    time.Now(),
		TotalPembayaran:  data.Total,
		CreatedBy:        user.ID,
		UpdatedBy:        user.ID,
		Keterangan:       request.Keterangan,
		MetodePembayaran: request.MetodePembayaran,
	})

	if err != nil {
		return
	}

	err = s.invoiceRepository.UpdateStatusInvoice(ctx, id, "Y")
	if err != nil {
		return
	}

	return
}

func round(num float64) int64 {
	return int64(num + 0.5)
}
