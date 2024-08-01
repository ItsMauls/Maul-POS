package barang

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

func (r *repository) FindAll(ctx context.Context, request lib.PaginationRequest) (data []MasterBarang, meta lib.Pagination, err error) {
	var barangs []MasterBarang

	if request.Keyword != "" {
		err = r.db.Select(ctx, &barangs, "SELECT * FROM master_barang WHERE deleted_at IS NULL AND (LOWER(nama_barang) ILIKE LOWER($1) OR kode_barang ILIKE $1) ORDER BY nama_barang ASC LIMIT $2 OFFSET $3", "%"+request.Keyword+"%", request.Limit(), request.Offset())
		if err != nil {
			r.log.ErrorF("error get all barangs: %v", err)
			return nil, lib.Pagination{}, err
		}

		var total int
		err = r.db.Get(ctx, &total, "SELECT COUNT(*) FROM master_barang WHERE deleted_at IS NULL AND (LOWER(nama_barang) ILIKE LOWER($1) OR kode_barang ILIKE $1)", "%"+request.Keyword+"%")
		if err != nil {
			r.log.ErrorF("error get total barangs: %v", err)

			return nil, lib.Pagination{}, err
		}
		meta = lib.NewPagination(request.Page, request.PageSize, total)
		return barangs, meta, nil
	}

	err = r.db.Select(ctx, &barangs, "SELECT * FROM master_barang WHERE deleted_at IS NULL ORDER BY nama_barang ASC LIMIT $1 OFFSET $2", request.Limit(), request.Offset())
	if err != nil {
		r.log.ErrorF("error get all barangs: %v", err)
		return nil, lib.Pagination{}, err
	}

	var total int
	err = r.db.Get(ctx, &total, "SELECT COUNT(*) FROM master_barang WHERE deleted_at IS NULL")
	if err != nil {
		r.log.ErrorF("error get total barangs: %v", err)
		return nil, lib.Pagination{}, err
	}

	meta = lib.NewPagination(request.Page, request.PageSize, total)

	return barangs, meta, nil
}

func (r *repository) FindByIDs(ctx context.Context, ids []string) (data []MasterBarang, err error) {
	if len(ids) == 0 {
		return
	}

	query, args, err := sqlx.In("SELECT * FROM master_barang WHERE kode_barang IN (?)", ids)
	if err != nil {
		r.log.ErrorF("error get barang by ids: %v", err)
		return nil, err
	}

	err = r.db.Select(ctx, &data, r.db.Rebind(query), args...)
	if err != nil {
		r.log.ErrorF("error get barang by ids: %v", err)
		return
	}

	return
}

func (r *repository) FindByID(ctx context.Context, id string) (data MasterBarang, err error) {
	err = r.db.Get(ctx, &data, "SELECT * FROM master_barang WHERE kode_barang = $1 AND deleted_at IS NULL", id)
	if err != nil {
		r.log.ErrorF("error get barang by id: %v", err)
		return
	}

	return
}

func (r *repository) Create(ctx context.Context, data *MasterBarang) (err error) {
	_, err = r.db.NamedExec(ctx, "INSERT INTO master_barang (kode_barang, nama_barang, isi, id_satuan, harga_jual, harga_beli, created_at, updated_at, created_by, updated_by) VALUES (:kode_barang, :nama_barang, :isi, :id_satuan, :harga_jual, :harga_beli, :created_at, :updated_at, :created_by, :updated_by)", data)
	if err != nil {
		r.log.ErrorF("error create barang: %v", err)
		return
	}

	return
}

func (r *repository) Update(ctx context.Context, data *MasterBarang) (err error) {
	_, err = r.db.NamedExec(ctx, "UPDATE master_barang SET nama_barang = :nama_barang, isi = :isi, id_satuan = :id_satuan, harga_jual = :harga_jual, harga_beli = :harga_beli, updated_at = :updated_at, updated_by = :updated_by WHERE kode_barang = :kode_barang", data)
	if err != nil {
		r.log.ErrorF("error update barang: %v", err)
		return
	}

	return
}

func (r *repository) Delete(ctx context.Context, id string) (err error) {
	user := lib.GetUserContext(ctx)
	_, err = r.db.Exec(ctx, "UPDATE master_barang SET deleted_at = NOW(), deleted_by = $1 WHERE kode_barang = $2", user.ID, id)
	if err != nil {
		r.log.ErrorF("error delete barang: %v", err)
		return
	}

	return
}
