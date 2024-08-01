package use_case

import (
	"context"
	"fmt"
	"log"

	"github.com/apotek-pbf/monorepo-pbf/lib"
	"github.com/apotek-pbf/monorepo-pbf/user-service/internal/model"
	"github.com/pkg/errors"
)

type userRepository interface {
	FindAll(ctx context.Context, request lib.PaginationRequest) ([]model.User, lib.Pagination, error)
	FindById(ctx context.Context, id string) (*model.User, error)
	GetRoleByIDs(ctx context.Context, ids []int) ([]model.Role, error)
	FindAllRoles(ctx context.Context) ([]model.Role, error)
	Create(ctx context.Context, user *model.User) error
	CekUsername(ctx context.Context, username string) (bool, error)
	CekEmail(ctx context.Context, email string) (bool, error)
	Delete(ctx context.Context, id int64) error
	FindByIDs(ctx context.Context, ids []int64) (res []model.User, err error)
	UpdateSignature(ctx context.Context, id int64, signature string) error
}

type Service struct {
	repo userRepository
	conn *lib.SQLServerConnectionManager
	db   *lib.SingleInstruction
	tx   *lib.MultiInstruction
	log  *lib.AggregateLogger
}

func NewService(conn *lib.SQLServerConnectionManager, log *lib.AggregateLogger) *Service {
	db := conn.GetQuery()
	userRepository := model.NewRepository(db, log)
	return &Service{
		repo: userRepository,
		conn: conn,
		db:   db,
		log:  log,
	}
}

func (s *Service) GetUserByIDs(ctx context.Context, ids []int64) (resp []*UserDetail, err error) {
	users, err := s.repo.FindByIDs(ctx, ids)
	if err != nil {
		errMsg := "service.GetUserByIDs.repo.FindByIDs"
		return resp, errors.Wrap(err, errMsg)
	}

	var roleIds []int
	for _, user := range users {
		roleIds = append(roleIds, user.RoleID)
	}

	roles, err := s.repo.GetRoleByIDs(ctx, roleIds)
	if err != nil {
		errMsg := "service.GetUserByIDs.repo.GetRoleByIDs"
		return resp, errors.Wrap(err, errMsg)
	}

	mapRoles := make(map[int]model.Role)
	for _, role := range roles {
		mapRoles[role.ID] = role
	}

	for _, user := range users {
		resp = append(resp, fromUserToUserDetail(&user, mapRoles[user.RoleID]))
	}

	return resp, nil
}

func (s *Service) DeleteUser(ctx context.Context, id int64) (err error) {
	// s.tx = s.conn.GetTransaction()

	// defer func() {
	// 	if r := recover(); r != nil {
	// 		log.Printf("Panic: %v", r)
	// 		s.tx.Rollback(ctx)
	// 	}

	// 	if err != nil {
	// 		s.tx.Rollback(ctx)
	// 	}

	// 	s.log.Info("Commit transaction CreateUser")
	// 	s.tx.Commit(ctx)
	// }()

	userLogin := lib.GetUserContext(ctx)
	if userLogin.Role.ID != 1 {
		return lib.NewErrForbidden("You don't have permission to delete user")
	}

	if id == userLogin.ID {
		return lib.NewErrBadRequest("You can't delete your own account")
	}

	err = s.repo.Delete(ctx, id)
	if err != nil {
		errMsg := "service.DeleteUser.repo.Delete"
		return errors.Wrap(err, errMsg)
	}

	return nil
}

func (s *Service) CreateUser(ctx context.Context, user *model.User) (err error) {
	s.tx = s.conn.GetTransaction()

	defer func() {
		if r := recover(); r != nil {
			log.Printf("Panic: %v", r)
			s.tx.Rollback(ctx)
		}

		if err != nil {
			s.tx.Rollback(ctx)
		}

		s.log.Info("Commit transaction CreateUser")
		s.tx.Commit(ctx)
	}()

	s.tx.Begin(ctx)

	userLogin := lib.GetUserContext(ctx)
	if userLogin.Role.ID != 1 {
		return lib.NewErrForbidden("You don't have permission to create user")
	}

	usernameExist, err := s.repo.CekUsername(ctx, user.Username)
	if err != nil {
		errMsg := "service.CreateUser.repo.CekUsername"
		return errors.Wrap(err, errMsg)
	}

	if usernameExist {
		return lib.NewErrBadRequest("Username already exist")
	}

	emailExist, err := s.repo.CekEmail(ctx, user.Email)
	if err != nil {
		errMsg := "service.CreateUser.repo.CekEmail"
		return errors.Wrap(err, errMsg)
	}

	if emailExist {
		return lib.NewErrBadRequest("Email already exist")
	}

	user.Password, err = lib.HashPassword(user.Password)
	if err != nil {
		errMsg := "service.CreateUser.lib.HashPassword"
		return errors.Wrap(err, errMsg)
	}

	user.CreatedBy = userLogin.ID
	user.UpdatedBy = userLogin.ID

	err = s.repo.Create(ctx, user)
	if err != nil {
		errMsg := "service.CreateUser.repo.Create"
		return errors.Wrap(err, errMsg)
	}

	return nil
}

func (s *Service) FindAllRoles(ctx context.Context) ([]*Role, error) {
	data, err := s.repo.FindAllRoles(ctx)
	if err != nil {
		errMsg := "service.FindAllRoles.repo.FindAllRoles"
		return nil, errors.Wrap(err, errMsg)
	}

	var roles []*Role
	for _, role := range data {
		roles = append(roles, fromModelRoleToRole(&role))
	}

	return roles, nil
}

func (s *Service) GetUsers(ctx context.Context, request lib.PaginationRequest) (res GetUserDetailResponse, err error) {
	if request.Page == 0 {
		request.Page = 1
	}

	if request.PageSize == 0 {
		request.PageSize = 10
	}

	listUser, meta, err := s.repo.FindAll(ctx, request)
	if err != nil {
		errMsg := "service.GetUsers.repo.FindAll"
		return res, errors.Wrap(err, errMsg)
	}

	var userDetail []*UserDetail
	var roleIds []int
	for _, user := range listUser {
		roleIds = append(roleIds, user.RoleID)
	}

	log.Printf("roleIds: %+v", roleIds)

	roles, err := s.repo.GetRoleByIDs(ctx, roleIds)
	if err != nil {
		errMsg := "service.GetUsers.repo.GetRoleByIDs"
		return res, errors.Wrap(err, errMsg)
	}

	mapRoles := make(map[int]model.Role)
	for _, role := range roles {
		mapRoles[role.ID] = role
	}

	for i, role := range mapRoles {
		log.Printf("role: %+v %v", role, i)
	}

	for _, user := range listUser {
		log.Printf("user: %+v", user)
		userDetail = append(userDetail, fromUserToUserDetail(&user, mapRoles[user.RoleID]))
	}

	res.Users = userDetail
	res.Meta = meta

	return res, nil
}

func (s *Service) AddSignature(ctx context.Context, signatureBase64 string) error {
	userLogin := lib.GetUserContext(ctx)

	// save base64 to image
	fileName := fmt.Sprintf("signature_%d", userLogin.ID)
	_, imageFormat, err := lib.SaveImage(signatureBase64, fileName, "storage/signature")
	if err != nil {
		errMsg := "service.AddSignature.lib.SaveImage"
		return errors.Wrap(err, errMsg)
	}

	// update user signature
	err = s.repo.UpdateSignature(ctx, userLogin.ID, fileName+"."+imageFormat)
	if err != nil {
		errMsg := "service.AddSignature.repo.UpdateSignature"
		return errors.Wrap(err, errMsg)
	}

	return nil
}
