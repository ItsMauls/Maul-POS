package use_case

import (
	"context"

	"github.com/apotek-pbf/monorepo-pbf/lib"
	"github.com/apotek-pbf/monorepo-pbf/supplier-service/internal/model/supplier"
)

type supplierRepository interface {
	FindAll(ctx context.Context, request lib.PaginationRequest) (data []supplier.Supplier, meta lib.Pagination, err error)
	FindByIDs(ctx context.Context, ids []string) (data []supplier.Supplier, err error)
}

type Service struct {
	supplierRepository supplierRepository
	conn               *lib.SQLServerConnectionManager
	db                 *lib.SingleInstruction
	tx                 *lib.MultiInstruction
	log                *lib.AggregateLogger
}

func NewService(cfg lib.Config, conn *lib.SQLServerConnectionManager, log *lib.AggregateLogger) *Service {
	db := conn.GetQuery()
	return &Service{
		supplierRepository: supplier.NewRepository(db, log),
		conn:               conn,
		db:                 db,
		log:                log,
	}
}

func (s *Service) FindAllSupplier(ctx context.Context, request lib.PaginationRequest) (response GetListSupplierResponse, err error) {
	dataEntity, metaEntity, err := s.supplierRepository.FindAll(ctx, request)
	if err != nil {
		return
	}

	response.Data = dataEntity
	response.Meta = metaEntity
	return
}

func (s *Service) FindSupplierByIDs(ctx context.Context, ids []string) (response []supplier.Supplier, err error) {
	dataEntity, err := s.supplierRepository.FindByIDs(ctx, ids)
	if err != nil {
		return
	}

	response = dataEntity
	return
}
