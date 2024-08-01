package satuan

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

func (r *repository) FindAll(ctx context.Context) (data []Satuan, err error) {
	err = r.db.Select(ctx, &data, "SELECT id_satuan, nm_satuan FROM msatuan")
	if err != nil {
		r.log.ErrorF("error get all satuan: %v", err)
		return nil, err
	}
	return
}

func (r *repository) FindByID(ctx context.Context, id int) (data Satuan, err error) {
	err = r.db.Get(ctx, &data, "SELECT id_satuan, nm_satuan FROM msatuan WHERE id_satuan = $1", id)
	if err != nil {
		r.log.ErrorF("error get satuan by id: %v", err)
		return Satuan{}, err
	}
	return
}

func (r *repository) FindByIDs(ctx context.Context, ids []int) (data []Satuan, err error) {
	if len(ids) == 0 {
		return
	}

	query, args, err := sqlx.In("SELECT id_satuan, nm_satuan FROM msatuan WHERE id_satuan IN (?)", ids)
	if err != nil {
		r.log.ErrorF("error get satuan by ids: %v", err)
		return nil, err
	}

	err = r.db.Select(ctx, &data, r.db.Rebind(query), args...)
	if err != nil {
		r.log.ErrorF("error get satuan by ids: %v", err)
		return nil, err
	}

	return
}
