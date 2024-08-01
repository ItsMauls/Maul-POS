package counter

import (
	"context"

	"github.com/apotek-pbf/monorepo-pbf/lib"
)

type repository struct {
	db  lib.Connection
	log *lib.AggregateLogger
}

func NewRepository(db lib.Connection, log *lib.AggregateLogger) *repository {
	return &repository{db, log}
}

func (r *repository) FindByPrefixAndBulan(ctx context.Context, prefix, bulan string) (data Counter, err error) {
	err = r.db.Get(ctx, &data, "SELECT * FROM counter WHERE prefix = $1 AND bulan = $2", prefix, bulan)
	if err != nil {
		r.log.ErrorF("error get counter by prefix and bulan: %v", err)
	}
	return
}

func (r *repository) CreateCounter(ctx context.Context, prefix, bulan string) (err error) {
	_, err = r.db.Exec(ctx, "INSERT INTO counter (prefix, bulan, counter) VALUES ($1, $2, 0)", prefix, bulan)
	if err != nil {
		r.log.ErrorF("error create counter: %v", err)
	}
	return
}

func (r *repository) UpdateCounter(ctx context.Context, prefix, bulan string, counter int) (err error) {
	_, err = r.db.Exec(ctx, "UPDATE counter SET counter = $1 WHERE prefix = $2 AND bulan = $3", counter, prefix, bulan)
	if err != nil {
		r.log.ErrorF("error update counter: %v", err)
	}
	return
}
