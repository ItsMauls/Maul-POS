package invoice

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

func (r *repository) CreateInvoice(ctx context.Context, invoice *Invoice) (err error) {
	query := `INSERT INTO invoice (no_invoice, id_po, kode_supplier, nama_supplier, tgl_invoice, tgl_jatuh_tempo, total, total_ppn, total_diskon, total_net, metode_pembayaran, status_invoice, created_at, updated_at, created_by, updated_by, gudang, no_reff, tgl_reff) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, now(), now(), $13, $14, $15, $16, $17) RETURNING id`
	err = r.db.Get(ctx, &invoice.ID, query, invoice.NoInvoice, invoice.IDPo, invoice.KodeSupplier, invoice.NamaSupplier, invoice.TglInvoice, invoice.TglJatuhTempo, invoice.Total, invoice.TotalPPN, invoice.TotalDiskon, invoice.TotalNet, invoice.MetodePembayaran, invoice.StatusInvoice, invoice.CreatedBy, invoice.UpdatedBy, invoice.Gudang, invoice.NoReff, invoice.TglReff)
	if err != nil {
		r.log.ErrorF("error create invoice: %v", err)
		return err
	}

	return nil
}

func (r *repository) CreateInvoiceDetail(ctx context.Context, invoiceDetail *InvoiceDetail) (err error) {
	_, err = r.db.Exec(ctx, "INSERT INTO invoice_detail (id_invoice, kode_barang, nama_barang, batch, tgl_expired, qty, isi, harga, disc, disc_nominal, total, created_at, updated_at, created_by, updated_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, now(), now(), $12, $13)", invoiceDetail.IDInvoice, invoiceDetail.KodeBarang, invoiceDetail.NamaBarang, invoiceDetail.Batch, invoiceDetail.TglExpired, invoiceDetail.Qty, invoiceDetail.Isi, invoiceDetail.Harga, invoiceDetail.Disc, invoiceDetail.DiscNominal, invoiceDetail.Total, invoiceDetail.CreatedBy, invoiceDetail.UpdatedBy)
	if err != nil {
		r.log.ErrorF("error create invoice_detail: %v", err)
		return err
	}

	return nil
}

func (r *repository) CreatePembayaranInvoice(ctx context.Context, pembayaranInvoice *PembayaranInvoice) (err error) {
	_, err = r.db.Exec(ctx, "INSERT INTO pembayaran_invoice (id_invoice, tgl_pembayaran, total_pembayaran, metode_pembayaran, keterangan, created_at, updated_at, created_by, updated_by) VALUES ($1, $2, $3, $4, $5, now(), now(), $6, $7)", pembayaranInvoice.IDInvoice, pembayaranInvoice.TglPembayaran, pembayaranInvoice.TotalPembayaran, pembayaranInvoice.MetodePembayaran, pembayaranInvoice.Keterangan, pembayaranInvoice.CreatedBy, pembayaranInvoice.UpdatedBy)
	if err != nil {
		r.log.ErrorF("error create pembayaran_invoice: %v", err)
		return err
	}

	return nil
}

func (r *repository) FindAll(ctx context.Context, paginate lib.PaginationRequest, gudang string) (data []Invoice, meta lib.Pagination, err error) {
	if paginate.Keyword != "" {
		paginate.Keyword = "%" + paginate.Keyword + "%"
		query := `SELECT * FROM invoice WHERE deleted_at IS NULL AND gudang = $1 AND (no_invoice ILIKE $2 OR kode_supplier ILIKE $2 OR nama_supplier ILIKE $2) ORDER BY id DESC LIMIT $3 OFFSET $4`
		err = r.db.Select(ctx, &data, query, gudang, paginate.Keyword, paginate.Limit(), paginate.Offset())
		if err != nil {
			r.log.ErrorF("error get all invoices: %v", err)
			return
		}

		var total int
		err = r.db.Get(ctx, &total, `SELECT COUNT(*) FROM invoice WHERE deleted_at IS NULL AND gudang = $1 AND (no_invoice ILIKE $2 OR kode_supplier ILIKE $2 OR nama_supplier ILIKE $2)`, gudang, paginate.Keyword)
		if err != nil {
			r.log.ErrorF("error get total invoices: %v", err)
			return
		}

		meta = lib.NewPagination(paginate.Page, paginate.PageSize, total)

		return
	}

	query := `SELECT * FROM invoice WHERE deleted_at IS NULL AND gudang = $1 ORDER BY id DESC LIMIT $2 OFFSET $3`
	err = r.db.Select(ctx, &data, query, gudang, paginate.Limit(), paginate.Offset())
	if err != nil {
		r.log.ErrorF("error get all invoices: %v", err)
		return
	}

	var total int
	err = r.db.Get(ctx, &total, `SELECT COUNT(*) FROM invoice WHERE deleted_at IS NULL AND gudang = $1`, gudang)
	if err != nil {
		r.log.ErrorF("error get total invoices: %v", err)
		return
	}

	meta = lib.NewPagination(paginate.Page, paginate.PageSize, total)

	return
}

func (r *repository) FindByIDs(ctx context.Context, ids []int) (data []Invoice, err error) {
	query, args, err := sqlx.In("id", ids)
	if err != nil {
		r.log.ErrorF("error get invoice by ids: %v", err)
		return
	}

	err = r.db.Select(ctx, &data, r.db.Rebind("SELECT * FROM invoice WHERE deleted_at IS NULL AND id IN ("+query+")"), args...)
	if err != nil {
		r.log.ErrorF("error get invoice by ids: %v", err)
		return
	}

	return
}

func (r *repository) FindByID(ctx context.Context, id int64) (data Invoice, err error) {
	err = r.db.Get(ctx, &data, "SELECT * FROM invoice WHERE deleted_at IS NULL AND id = $1", id)
	if err != nil {
		r.log.ErrorF("error get invoice by id: %v", err)
		return
	}

	return
}

func (r *repository) FindDetailByID(ctx context.Context, id int64) (data []InvoiceDetail, err error) {
	err = r.db.Select(ctx, &data, "SELECT * FROM invoice_detail WHERE id_invoice = $1", id)
	if err != nil {
		r.log.ErrorF("error get invoice detail by id: %v", err)
		return
	}

	return
}

func (r *repository) FindPembayaranByID(ctx context.Context, id int64) (data PembayaranInvoice, err error) {
	err = r.db.Get(ctx, &data, "SELECT * FROM pembayaran_invoice WHERE id_invoice = $1", id)
	if err != nil {
		r.log.ErrorF("error get pembayaran invoice by id: %v", err)
		return
	}

	return
}

func (r *repository) UpdateStatusInvoice(ctx context.Context, id int64, status string) (err error) {
	_, err = r.db.Exec(ctx, "UPDATE invoice SET status_invoice = $1 WHERE id = $2", status, id)
	if err != nil {
		r.log.ErrorF("error update status invoice: %v", err)
		return
	}

	return
}
