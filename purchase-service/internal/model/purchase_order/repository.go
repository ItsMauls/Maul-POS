package purchase_order

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

// conditional if user_approve_2 is not null and invoice is not null
// func (r *repository) FindAllForInvoice(ctx context.Context, request lib.PaginationRequest, gudang string) (data []PurchaseOrderHeader, meta lib.Pagination, err error) {
// 	var purchaseOrders []PurchaseOrderHeader

// 	if request.Keyword != "" {

// }

func (r *repository) FindAll(ctx context.Context, request lib.PaginationRequest) (data []PurchaseOrderHeader, meta lib.Pagination, err error) {
	var purchaseOrders []PurchaseOrderHeader

	if request.Keyword != "" {
		err = r.db.Select(
			ctx, &purchaseOrders,
			`SELECT thpo.* FROM thpo
			LEFT JOIN tmassup on thpo.kd_sup = tmassup.id_supplier
			WHERE
				thpo.deleted_at IS NULL AND
				(no_po ILIKE $1 OR tmassup.nm_sup ILIKE $1)
			ORDER BY created_at DESC 
			LIMIT $2 OFFSET $3
			`,
			"%"+request.Keyword+"%", request.Limit(), request.Offset(),
		)

		if err != nil {
			r.log.ErrorF("error get all purchase_orders keyword: %v", err)
			return nil, lib.Pagination{}, err
		}

		var total int
		err = r.db.Get(ctx, &total,
			`SELECT COUNT(*) FROM thpo
			LEFT JOIN tmassup on thpo.kd_sup = tmassup.id_supplier
			WHERE 
				thpo.deleted_at IS NULL AND
				(no_po ILIKE $1 OR tmassup.nm_sup ILIKE $1)
			`,
			"%"+request.Keyword+"%",
		)
		if err != nil {
			r.log.ErrorF("error get total purchase_order keyword: %v", err)

			return nil, lib.Pagination{}, err
		}

		meta = lib.NewPagination(request.Page, request.PageSize, total)

		return purchaseOrders, meta, nil
	}

	err = r.db.Select(
		ctx, &purchaseOrders,
		`SELECT * FROM thpo
		WHERE deleted_at IS NULL
		ORDER BY created_at DESC LIMIT $1 OFFSET $2
		`,
		request.Limit(), request.Offset(),
	)
	if err != nil {
		r.log.ErrorF("error get all purchase_orders: %v", err)
		return nil, lib.Pagination{}, err
	}

	var total int
	err = r.db.Get(ctx, &total,
		`SELECT COUNT(*) FROM thpo
		WHERE deleted_at IS NULL
		`)
	if err != nil {
		r.log.ErrorF("error get total purchase_orders: %v", err)
		return nil, lib.Pagination{}, err
	}

	meta = lib.NewPagination(request.Page, request.PageSize, total)

	return purchaseOrders, meta, nil
}

func (r *repository) FindByID(ctx context.Context, id int) (data PurchaseOrderHeader, err error) {
	err = r.db.Get(ctx, &data, "SELECT * FROM thpo WHERE id_hpo = $1", id)
	if err != nil {
		r.log.ErrorF("error get purchase_order by id: %v", err)
		return PurchaseOrderHeader{}, err
	}
	return
}

func (r *repository) FindDetailByID(ctx context.Context, id int) (data []PurchaseOrderDetail, err error) {
	err = r.db.Select(ctx, &data, "SELECT * FROM tdpo WHERE id_hpo = $1", id)
	if err != nil {
		r.log.ErrorF("error get purchase_order_detail by id: %v", err)
		return nil, err
	}
	return
}

func (r *repository) CreatePurchaseOrderHeader(ctx context.Context, purchaseOrderHeader *PurchaseOrderHeader) (data PurchaseOrderHeader, err error) {
	_, err = r.db.Exec(
		ctx,
		"INSERT INTO thpo (id_hpr, no_po, tgl_po, user_id, no_ref, tgl_ref, kd_sup, total, total_diskon, total_ppn, biaya_lain, total_net, round, created_by, updated_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)",
		purchaseOrderHeader.IDHpr, purchaseOrderHeader.NoPO, purchaseOrderHeader.TglPO, purchaseOrderHeader.UserID, purchaseOrderHeader.NoRef, purchaseOrderHeader.TglRef, purchaseOrderHeader.KodeSupplier, purchaseOrderHeader.Total, purchaseOrderHeader.TotalDiskon, purchaseOrderHeader.TotalPPN, purchaseOrderHeader.BiayaLain, purchaseOrderHeader.TotalNet, purchaseOrderHeader.Round, purchaseOrderHeader.CreatedBy, purchaseOrderHeader.UpdatedBy,
	)
	if err != nil {
		r.log.ErrorF("error create purchase_order_header: %v", err)
		return PurchaseOrderHeader{}, err

	}

	err = r.db.Get(ctx, &data, "SELECT * FROM thpo WHERE no_po = $1", purchaseOrderHeader.NoPO)
	if err != nil {
		r.log.ErrorF("error get purchase_order by no: %v", err)
		return PurchaseOrderHeader{}, err
	}

	return
}

func (r *repository) CreatePurchaseOrderDetail(ctx context.Context, purchaseOrderDetail *PurchaseOrderDetail) (err error) {
	_, err = r.db.Exec(
		ctx,
		"INSERT INTO tdpo (id_hpo, detail, kd_brgdg, batch, tgl_expired, qty, isi, hrg_nppn, ppn, hrg_ppn, disc, disc_nominal, tot_disc, total_nppn, total_ppn, total, id_hpr, created_by, updated_by, new_item) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)",
		purchaseOrderDetail.IDHeader, purchaseOrderDetail.Detail, purchaseOrderDetail.KdBrgdg, purchaseOrderDetail.Batch, purchaseOrderDetail.TglExpired, purchaseOrderDetail.Qty, purchaseOrderDetail.Isi, purchaseOrderDetail.HrgNppn, purchaseOrderDetail.Ppn, purchaseOrderDetail.HrgPpn, purchaseOrderDetail.Disc, purchaseOrderDetail.DiscNominal, purchaseOrderDetail.TotDisc, purchaseOrderDetail.TotalNppn, purchaseOrderDetail.TotalPpn, purchaseOrderDetail.Total, purchaseOrderDetail.IDHpr, purchaseOrderDetail.CreatedBy, purchaseOrderDetail.UpdatedBy, purchaseOrderDetail.NewItem,
	)
	if err != nil {
		r.log.ErrorF("error create purchase_order_detail: %v", err)
		return err

	}

	return nil
}

func (r *repository) ApproveManager(ctx context.Context, id int, userID int64) (err error) {
	_, err = r.db.Exec(ctx, "UPDATE thpo SET user_approved_2 = $1, updated_by = $1, updated_at = 'now()' WHERE id_hpo = $2", userID, id)
	if err != nil {
		r.log.ErrorF("error approve purchase_order: %v", err)
		return err
	}
	return nil
}

func (r *repository) ApproveApoteker(ctx context.Context, id int, userID int64) (err error) {
	_, err = r.db.Exec(ctx, "UPDATE thpo SET user_approved_1 = $1, updated_by = $1, updated_at = 'now()' WHERE id_hpo = $2", userID, id)
	if err != nil {
		r.log.ErrorF("error approve purchase_order: %v", err)
		return err
	}
	return nil
}

func (r *repository) DeletePurchaseOrder(ctx context.Context, id int) (err error) {
	_, err = r.db.Exec(ctx, "UPDATE thpo SET deleted_at = 'now()', deleted_by = $1 WHERE id_hpo = $2", lib.GetUserContext(ctx).ID, id)
	if err != nil {
		r.log.ErrorF("error delete purchase_order: %v", err)
		return err
	}
	return nil
}

func (r *repository) FindByIDs(ctx context.Context, ids []int) (data []PurchaseOrderHeader, err error) {
	query, args, err := sqlx.In("SELECT * FROM thpo WHERE id_hpo IN (?)", ids)
	if err != nil {
		r.log.ErrorF("error in query: %v", err)
		return nil, err
	}

	err = r.db.Select(ctx, &data, r.db.Rebind(query), args...)
	if err != nil {
		r.log.ErrorF("error get purchase_order by ids: %v", err)
		return nil, err
	}

	return
}
