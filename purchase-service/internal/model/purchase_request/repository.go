package purchase_request

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

func (r *repository) FindAll(ctx context.Context, request lib.PaginationRequest, gudang string) (data []PurchaseRequestHeader, meta lib.Pagination, err error) {
	var purchaseRequests []PurchaseRequestHeader

	if request.Keyword != "" {
		err = r.db.Select(ctx, &purchaseRequests, "SELECT thpr.* FROM thpr left join tmassup on thpr.kd_sup = tmassup.id_supplier WHERE thpr.deleted_at IS NULL AND (no_pr ILIKE $1 OR tmassup.nm_sup ILIKE $1) AND gudang = $2 ORDER BY created_at DESC LIMIT $3 OFFSET $4", "%"+request.Keyword+"%", gudang, request.Limit(), request.Offset())
		if err != nil {
			r.log.ErrorF("error get all purchase_requests: %v", err)
			return nil, lib.Pagination{}, err
		}

		var total int
		err = r.db.Get(ctx, &total, "SELECT COUNT(*) FROM thpr left join tmassup on thpr.kd_sup = tmassup.id_supplier WHERE thpr.deleted_at IS NULL AND (no_pr ILIKE $1 OR tmassup.nm_sup ILIKE $1) AND gudang = $2", "%"+request.Keyword+"%", gudang)
		if err != nil {
			r.log.ErrorF("error get total purchase_requests: %v", err)

			return nil, lib.Pagination{}, err
		}
		meta = lib.NewPagination(request.Page, request.PageSize, total)
		return purchaseRequests, meta, nil
	}

	err = r.db.Select(ctx, &purchaseRequests, "SELECT * FROM thpr WHERE deleted_at IS NULL AND gudang = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3", gudang, request.Limit(), request.Offset())
	if err != nil {
		r.log.ErrorF("error get all purchase_requests: %v", err)
		return nil, lib.Pagination{}, err
	}

	var total int
	err = r.db.Get(ctx, &total, "SELECT COUNT(*) FROM thpr WHERE deleted_at IS NULL AND gudang = $1", gudang)
	if err != nil {
		r.log.ErrorF("error get total purchase_requests: %v", err)
		return nil, lib.Pagination{}, err
	}

	meta = lib.NewPagination(request.Page, request.PageSize, total)

	return purchaseRequests, meta, nil
}

// condition is_success = false and status_approved = 'Y'
func (r *repository) FindAllForPO(ctx context.Context, request lib.PaginationRequest, gudang string) (data []PurchaseRequestHeader, meta lib.Pagination, err error) {
	var purchaseRequests []PurchaseRequestHeader

	if request.Keyword != "" {
		err = r.db.Select(ctx, &purchaseRequests, "SELECT thpr.* FROM thpr left join tmassup on thpr.kd_sup = tmassup.id_supplier WHERE thpr.deleted_at IS NULL AND thpr.is_success = false AND thpr.status_approved = 'Y' AND (no_pr ILIKE $1 OR tmassup.nm_sup ILIKE $1) AND gudang = $2 ORDER BY created_at DESC LIMIT $3 OFFSET $4", "%"+request.Keyword+"%", gudang, request.Limit(), request.Offset())
		if err != nil {
			r.log.ErrorF("error get all purchase_requests: %v", err)
			return nil, lib.Pagination{}, err
		}

		var total int
		err = r.db.Get(ctx, &total, "SELECT COUNT(*) FROM thpr left join tmassup on thpr.kd_sup = tmassup.id_supplier WHERE thpr.deleted_at IS NULL AND thpr.is_success = false AND thpr.status_approved = 'Y' AND (no_pr ILIKE $1 OR tmassup.nm_sup ILIKE $1) AND gudang = $2", "%"+request.Keyword+"%", gudang)
		if err != nil {
			r.log.ErrorF("error get total purchase_requests: %v", err)

			return nil, lib.Pagination{}, err
		}
		meta = lib.NewPagination(request.Page, request.PageSize, total)
		return purchaseRequests, meta, nil
	}

	err = r.db.Select(ctx, &purchaseRequests, "SELECT * FROM thpr WHERE deleted_at IS NULL AND is_success = false AND status_approved = 'Y' AND gudang = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3", gudang, request.Limit(), request.Offset())
	if err != nil {
		r.log.ErrorF("error get all purchase_requests: %v", err)
		return nil, lib.Pagination{}, err
	}

	var total int
	err = r.db.Get(ctx, &total, "SELECT COUNT(*) FROM thpr WHERE deleted_at IS NULL AND is_success = false AND status_approved = 'Y' AND gudang = $1", gudang)
	if err != nil {
		r.log.ErrorF("error get total purchase_requests: %v", err)
		return nil, lib.Pagination{}, err
	}

	meta = lib.NewPagination(request.Page, request.PageSize, total)

	return purchaseRequests, meta, nil
}

func (r *repository) FindByID(ctx context.Context, id int) (data PurchaseRequestHeader, err error) {
	err = r.db.Get(ctx, &data, "SELECT * FROM thpr WHERE id_hpr = $1", id)
	if err != nil {
		r.log.ErrorF("error get purchase_request by id: %v", err)
		return PurchaseRequestHeader{}, err
	}
	return
}

func (r *repository) FindDetailByID(ctx context.Context, id int) (data []PurchaseRequestDetail, err error) {
	err = r.db.Select(ctx, &data, "SELECT * FROM tdpr WHERE id_hpr = $1", id)
	if err != nil {
		r.log.ErrorF("error get purchase_request_detail by id: %v", err)
		return nil, err
	}
	return
}

func (r *repository) CreatePurchaseRequestHeader(ctx context.Context, purchaseRequestHeader *PurchaseRequestHeader) (data PurchaseRequestHeader, err error) {
	_, err = r.db.Exec(ctx, "INSERT INTO thpr (no_pr, tgl_pr, keterangan, user_id, kd_sup, total, created_by, updated_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)", purchaseRequestHeader.No, purchaseRequestHeader.Tanggal, purchaseRequestHeader.Keterangan, purchaseRequestHeader.UserID, purchaseRequestHeader.KodeSupplier, purchaseRequestHeader.Total, purchaseRequestHeader.CreatedBy, purchaseRequestHeader.UpdatedBy)
	if err != nil {
		r.log.ErrorF("error create purchase_request_header: %v", err)
		return PurchaseRequestHeader{}, err

	}

	err = r.db.Get(ctx, &data, "SELECT * FROM thpr WHERE no_pr = $1", purchaseRequestHeader.No)
	if err != nil {
		r.log.ErrorF("error get purchase_request by no: %v", err)
		return PurchaseRequestHeader{}, err
	}

	return
}

func (r *repository) CreatePurchaseRequestDetail(ctx context.Context, purchaseRequestDetail *PurchaseRequestDetail) (err error) {
	_, err = r.db.Exec(ctx, "INSERT INTO tdpr (id_hpr, detail, kd_brgdg, qty_pesan, isi, hrg_nppn, created_by, updated_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)", purchaseRequestDetail.IDHPR, purchaseRequestDetail.Detail, purchaseRequestDetail.KodeBarang, purchaseRequestDetail.QtyPesan, purchaseRequestDetail.Isi, purchaseRequestDetail.HargaNPPN, purchaseRequestDetail.CreatedBy, purchaseRequestDetail.UpdatedBy)
	if err != nil {
		r.log.ErrorF("error create purchase_request_detail: %v", err)
		return err

	}

	return nil
}

func (r *repository) SwitchGudang(ctx context.Context, id int, gudang string) (err error) {
	user := lib.GetUserContext(ctx)
	_, err = r.db.Exec(ctx, "UPDATE thpr SET gudang = $1, updated_at = 'now()', updated_by = $2 WHERE id_hpr = $3", gudang, user.ID, id)
	if err != nil {
		r.log.ErrorF("error switch gudang: %v", err)
		return err
	}
	return nil
}

func (r *repository) Approve(ctx context.Context, id int) (err error) {
	user := lib.GetUserContext(ctx)
	_, err = r.db.Exec(ctx, "UPDATE thpr SET status_approved = 'Y', tanggal_approved = 'now()', user_approved = $1, updated_at = 'now()', updated_by = $1 WHERE id_hpr = $2", user.ID, id)
	if err != nil {
		r.log.ErrorF("error approve purchase_request: %v", err)
		return err
	}
	return nil
}

func (r *repository) UpdateTerpenuhi(ctx context.Context, idHPR, detail int, qty int) (err error) {
	_, err = r.db.Exec(ctx, "UPDATE tdpr SET qty_terpenuhi = qty_terpenuhi + $1 WHERE id_hpr = $2 AND detail = $3", qty, idHPR, detail)
	if err != nil {
		r.log.ErrorF("error update terpenuhi: %v", err)
		return err
	}
	return nil
}

func (r *repository) UpdateTerpenuhiAll(ctx context.Context, idHPR int, qty int) (err error) {
	_, err = r.db.Exec(ctx, "UPDATE tdpr SET qty_terpenuhi = $1 WHERE id_hpr = $2", qty, idHPR)
	if err != nil {
		r.log.ErrorF("error update terpenuhi all: %v", err)
		return err
	}
	return nil
}

func (r *repository) UpdateSuccess(ctx context.Context, id int) (err error) {
	_, err = r.db.Exec(ctx, "UPDATE thpr SET is_success = true WHERE id_hpr = $1", id)
	if err != nil {
		r.log.ErrorF("error update success: %v", err)
		return err
	}
	return nil
}

func (r *repository) BackSuccess(ctx context.Context, id int) (err error) {
	_, err = r.db.Exec(ctx, "UPDATE thpr SET is_success = false WHERE id_hpr = $1", id)
	if err != nil {
		r.log.ErrorF("error back success: %v", err)
		return err
	}
	return nil
}

func (r *repository) DeletePurchaseRequest(ctx context.Context, id int) (err error) {
	user := lib.GetUserContext(ctx)
	_, err = r.db.Exec(ctx, "UPDATE thpr SET deleted_at = 'now()', deleted_by = $1 WHERE id_hpr = $2", user.ID, id)
	if err != nil {
		r.log.ErrorF("error delete purchase_request: %v", err)
		return err
	}
	return nil
}
