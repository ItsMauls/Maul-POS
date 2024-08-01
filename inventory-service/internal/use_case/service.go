package use_case

import (
	"context"
	"database/sql"
	"errors"
	"time"

	"github.com/apotek-pbf/monorepo-pbf/inventory-service/internal/model/barang"
	"github.com/apotek-pbf/monorepo-pbf/inventory-service/internal/model/satuan"
	"github.com/apotek-pbf/monorepo-pbf/lib"
)

type repoBarang interface {
	FindAll(ctx context.Context, request lib.PaginationRequest) (data []barang.MasterBarang, meta lib.Pagination, err error)
	FindByIDs(ctx context.Context, ids []string) (data []barang.MasterBarang, err error)
	FindByID(ctx context.Context, id string) (data barang.MasterBarang, err error)
	Create(ctx context.Context, data *barang.MasterBarang) (err error)
	Update(ctx context.Context, data *barang.MasterBarang) (err error)
	Delete(ctx context.Context, id string) (err error)
}

type repoSatuan interface {
	FindAll(ctx context.Context) (data []satuan.Satuan, err error)
	FindByIDs(ctx context.Context, ids []int) (data []satuan.Satuan, err error)
}

type Service struct {
	repo       repoBarang
	repoSatuan repoSatuan
	conn       *lib.SQLServerConnectionManager
	db         *lib.SingleInstruction
	tx         *lib.MultiInstruction
	log        *lib.AggregateLogger
}

func NewService(conn *lib.SQLServerConnectionManager, log *lib.AggregateLogger) *Service {
	db := conn.GetQuery()
	return &Service{
		repo:       barang.NewRepository(db, log),
		repoSatuan: satuan.NewRepository(db, log),
		conn:       conn,
		db:         db,
		log:        log,
	}
}

func (s *Service) GetAllMasterBarang(ctx context.Context, request lib.PaginationRequest) (response *GetAllMasterBarangResponse, err error) {
	barangs, meta, err := s.repo.FindAll(ctx, request)
	if err != nil {
		return nil, err
	}

	var satuanIDs []int
	for _, barang := range barangs {
		satuanIDs = append(satuanIDs, barang.IDSatuan)
	}

	satuans, err := s.repoSatuan.FindByIDs(ctx, satuanIDs)
	if err != nil {
		return nil, err
	}

	mapSatuan := make(map[int]satuan.Satuan)
	for _, satuan := range satuans {
		mapSatuan[satuan.ID] = satuan
	}

	var barangsResponse []MasterBarang
	for _, barang := range barangs {
		masterBarang := MasterBarang{}
		masterBarang.FromModel(barang, mapSatuan[barang.IDSatuan])
		barangsResponse = append(barangsResponse, masterBarang)
	}

	return &GetAllMasterBarangResponse{
		Barangs: barangsResponse,
		Meta:    meta,
	}, nil
}

func (s *Service) GetMasterBarangByIDs(ctx context.Context, ids []string) (response []MasterBarang, err error) {
	barangs, err := s.repo.FindByIDs(ctx, ids)
	if err != nil {
		return nil, err
	}

	var satuanIDs []int
	for _, barang := range barangs {
		satuanIDs = append(satuanIDs, barang.IDSatuan)
	}

	satuans, err := s.repoSatuan.FindByIDs(ctx, satuanIDs)
	if err != nil {
		return nil, err
	}

	mapSatuan := make(map[int]satuan.Satuan)
	for _, satuan := range satuans {
		mapSatuan[satuan.ID] = satuan
	}

	for _, barang := range barangs {
		masterBarang := MasterBarang{}
		masterBarang.FromModel(barang, mapSatuan[barang.IDSatuan])
		response = append(response, masterBarang)
	}

	return response, nil
}

func (s *Service) GetMasterBarangByID(ctx context.Context, id string) (response *MasterBarang, err error) {
	barang, err := s.repo.FindByID(ctx, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, lib.NewErrNotFound("Barang not found")
		} else {
			return nil, err
		}
	}

	satuan, err := s.repoSatuan.FindByIDs(ctx, []int{barang.IDSatuan})
	if err != nil {
		return nil, err
	}

	masterBarang := MasterBarang{}
	masterBarang.FromModel(barang, satuan[0])

	return &masterBarang, nil
}

func (s *Service) CreateMasterBarang(ctx context.Context, request *CreateMasterBarangRequest) (err error) {
	err = request.Validate()
	if err != nil {
		return err
	}

	barang := request.ToModel()
	err = s.repo.Create(ctx, barang)
	if err != nil {
		return err
	}

	return nil
}

func (s *Service) UpdateMasterBarang(ctx context.Context, request *CreateMasterBarangRequest, id string) (err error) {
	user := lib.GetUserContext(ctx)

	barang, err := s.repo.FindByID(ctx, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return lib.NewErrNotFound("Barang not found")
		} else {
			return err
		}
	}

	// if request.KodeBarang == "" {
	// 	return lib.NewErrBadRequest("KodeBarang is required")
	// }

	if request.NamaBarang != "" {
		barang.NamaBarang = request.NamaBarang
	}

	if request.Isi != 0 {
		barang.Isi = request.Isi
	}

	if request.IDSatuan != 0 {
		barang.IDSatuan = request.IDSatuan
	}

	if request.HargaJual != 0 {
		barang.HargaJual = request.HargaJual
	}

	if request.HargaBeli != 0 {
		barang.HargaBeli = request.HargaBeli
	}

	barang.UpdatedAt = time.Now()
	barang.UpdatedBy = user.ID

	err = s.repo.Update(ctx, &barang)
	if err != nil {
		return err
	}

	return nil
}

func (s *Service) DeleteMasterBarang(ctx context.Context, id string) (err error) {
	err = s.repo.Delete(ctx, id)
	if err != nil {
		return err
	}

	return nil
}

func (s *Service) GetAllSatuan(ctx context.Context) (response []satuan.Satuan, err error) {
	satuans, err := s.repoSatuan.FindAll(ctx)
	if err != nil {
		return nil, err
	}

	return satuans, nil
}
