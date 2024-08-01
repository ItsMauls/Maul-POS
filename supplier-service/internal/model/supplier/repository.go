package supplier

import (
	"context"

	"github.com/apotek-pbf/monorepo-pbf/lib"
	"github.com/jmoiron/sqlx"
)

type repository struct {
	db  lib.Connection
	log *lib.AggregateLogger
}

func NewRepository(db lib.Connection, log *lib.AggregateLogger) *repository {
	return &repository{db, log}
}

func (r *repository) FindAll(ctx context.Context, request lib.PaginationRequest) (data []Supplier, meta lib.Pagination, err error) {
	var suppliers []Supplier

	if request.Keyword != "" {
		err = r.db.Select(ctx, &suppliers, "SELECT id_supplier, nm_supplier, email, alamat FROM tmassup WHERE deleted_at IS NULL AND (id_supplier ILIKE $1 OR nm_supplier ILIKE $1) ORDER BY nm_supplier ASC LIMIT $2 OFFSET $3", "%"+request.Keyword+"%", request.Limit(), request.Offset())
		if err != nil {
			r.log.ErrorF("error get all suppliers: %v", err)
			return nil, lib.Pagination{}, err
		}

		var total int
		err = r.db.Get(ctx, &total, "SELECT COUNT(*) FROM tmassup WHERE deleted_at IS NULL AND (id_supplier ILIKE $1 OR nm_supplier ILIKE $1)", "%"+request.Keyword+"%")
		if err != nil {
			r.log.ErrorF("error get total suppliers: %v", err)

			return nil, lib.Pagination{}, err
		}
		meta = lib.NewPagination(request.Page, request.PageSize, total)
		return suppliers, meta, nil
	}

	err = r.db.Select(ctx, &suppliers, "SELECT id_supplier, nm_supplier, email, alamat FROM tmassup WHERE deleted_at IS NULL ORDER BY nm_supplier ASC LIMIT $1 OFFSET $2", request.Limit(), request.Offset())
	if err != nil {
		r.log.ErrorF("error get all suppliers: %v", err)
		return nil, lib.Pagination{}, err
	}

	var total int
	err = r.db.Get(ctx, &total, "SELECT COUNT(*) FROM tmassup WHERE deleted_at IS NULL")
	if err != nil {
		r.log.ErrorF("error get total suppliers: %v", err)
		return nil, lib.Pagination{}, err
	}
	meta = lib.NewPagination(request.Page, request.PageSize, total)
	return suppliers, meta, nil
}

func (r *repository) FindByIDs(ctx context.Context, ids []string) (data []Supplier, err error) {
	if len(ids) == 0 {
		return
	}

	query, args, err := sqlx.In("SELECT id_supplier, nm_supplier, email, alamat FROM tmassup WHERE id_supplier IN (?)", ids)
	if err != nil {
		r.log.ErrorF("error get supplier by ids: %v", err)
		return nil, err
	}

	err = r.db.Select(ctx, &data, r.db.Rebind(query), args...)
	if err != nil {
		r.log.ErrorF("error get supplier by ids: %v", err)
		return
	}

	return
}
