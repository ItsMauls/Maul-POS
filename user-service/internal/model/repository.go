package model

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

func (r *repository) FindAll(ctx context.Context, request lib.PaginationRequest) (data []User, meta lib.Pagination, err error) {
	var users []User

	if request.Keyword != "" {
		err = r.db.Select(ctx, &users, "SELECT * FROM users WHERE deleted_at IS NULL AND (name ILIKE $1 OR username ILIKE $1 OR email ILIKE $1) ORDER BY created_at DESC LIMIT $2 OFFSET $3", "%"+request.Keyword+"%", request.Limit(), request.Offset())
		if err != nil {
			r.log.ErrorF("error get all users: %v", err)
			return nil, lib.Pagination{}, err
		}

		var total int
		err = r.db.Get(ctx, &total, "SELECT COUNT(*) FROM users WHERE deleted_at IS NULL AND (name ILIKE $1 OR username ILIKE $1 OR email ILIKE $1)", "%"+request.Keyword+"%")
		if err != nil {
			r.log.ErrorF("error get total users: %v", err)

			return nil, lib.Pagination{}, err
		}
		meta = lib.NewPagination(request.Page, request.PageSize, total)
		return users, meta, nil
	}

	err = r.db.Select(ctx, &users, "SELECT * FROM users WHERE deleted_at IS NULL ORDER BY created_at DESC LIMIT $1 OFFSET $2", request.Limit(), request.Offset())
	if err != nil {
		r.log.ErrorF("error get all users: %v", err)
		return nil, lib.Pagination{}, err
	}

	var total int
	err = r.db.Get(ctx, &total, "SELECT COUNT(*) FROM users WHERE deleted_at IS NULL")
	if err != nil {
		r.log.ErrorF("error get total users: %v", err)
		return nil, lib.Pagination{}, err
	}

	meta = lib.NewPagination(request.Page, request.PageSize, total)

	return users, meta, nil
}

func (r *repository) FindById(ctx context.Context, id string) (*User, error) {
	var user User
	err := r.db.Get(ctx, &user, "SELECT * FROM users WHERE id = $1", id)
	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (r *repository) FindByIDs(ctx context.Context, ids []int64) (res []User, err error) {
	if len(ids) == 0 {
		return
	}

	query, args, err := sqlx.In("SELECT * FROM users WHERE id IN (?)", ids)
	if err != nil {
		return nil, err
	}

	err = r.db.Select(ctx, &res, r.db.Rebind(query), args...)
	if err != nil {
		return nil, err
	}

	return
}

func (r *repository) Create(ctx context.Context, user *User) error {
	_, err := r.db.NamedExec(ctx, "INSERT INTO users (name, username, email, password, address, role_id, created_by, updated_by) VALUES (:name, :username, :email, :password, :address, :role_id, :created_by, :updated_by)", user)
	if err != nil {
		return err
	}

	return nil
}

func (r *repository) Update(ctx context.Context, user *User) error {
	_, err := r.db.NamedExec(ctx, "UPDATE users SET name = :name, username = :username, email = :email, password = :password, role_id = :role_id WHERE id = :id", user)
	if err != nil {
		return err
	}

	return nil
}

func (r *repository) Delete(ctx context.Context, id int64) error {
	user := lib.GetUserContext(ctx)
	_, err := r.db.Exec(ctx, "UPDATE users SET deleted_at = NOW(), deleted_by = $1 WHERE id = $2", user.ID, id)
	if err != nil {
		return err
	}

	return nil
}

func (r *repository) CekUsername(ctx context.Context, username string) (bool, error) {
	var count int
	err := r.db.Get(ctx, &count, "SELECT COUNT(*) FROM users WHERE username = $1", username)
	if err != nil {
		return false, err
	}

	return count > 0, nil
}

func (r *repository) CekEmail(ctx context.Context, email string) (bool, error) {
	var count int
	err := r.db.Get(ctx, &count, "SELECT COUNT(*) FROM users WHERE email = $1", email)
	if err != nil {
		return false, err
	}

	return count > 0, nil
}

func (r *repository) FindRoleById(ctx context.Context, id int) (*Role, error) {
	var role Role
	err := r.db.Get(ctx, &role, "SELECT * FROM roles WHERE id = $1", id)
	if err != nil {
		return nil, err
	}

	return &role, nil
}

func (r *repository) GetRoleByIDs(ctx context.Context, ids []int) ([]Role, error) {
	if len(ids) == 0 {
		return nil, nil
	}

	var roles []Role
	query, args, err := sqlx.In("SELECT * FROM roles WHERE id IN (?)", ids)
	if err != nil {
		return nil, err
	}

	query = r.db.Rebind(query)

	err = r.db.Select(ctx, &roles, query, args...)
	if err != nil {
		return nil, err
	}

	return roles, nil
}

func (r *repository) FindRoleByName(ctx context.Context, name string) (*Role, error) {
	var role Role
	err := r.db.Get(ctx, &role, "SELECT * FROM roles WHERE name = $1", name)
	if err != nil {
		return nil, err
	}

	return &role, nil
}

func (r *repository) CreateRole(ctx context.Context, role *Role) error {
	_, err := r.db.NamedExec(ctx, "INSERT INTO roles (name) VALUES (:name)", role)
	if err != nil {
		return err
	}

	return nil
}

func (r *repository) UpdateRole(ctx context.Context, role *Role) error {
	_, err := r.db.NamedExec(ctx, "UPDATE roles SET name = :name WHERE id = :id", role)
	if err != nil {
		return err
	}

	return nil
}

func (r *repository) DeleteRole(ctx context.Context, id string) error {
	_, err := r.db.Exec(ctx, "DELETE FROM roles WHERE id = $1", id)
	if err != nil {
		return err
	}

	return nil
}

func (r *repository) FindAllRoles(ctx context.Context) ([]Role, error) {
	var roles []Role
	err := r.db.Select(ctx, &roles, "SELECT * FROM roles")
	if err != nil {
		return nil, err
	}

	return roles, nil
}

func (r *repository) FindAllRolesByUserId(ctx context.Context, userId string) ([]Role, error) {
	var roles []Role
	err := r.db.Select(ctx, &roles, "SELECT r.* FROM roles r JOIN users u ON r.id = u.role_id WHERE u.id = $1", userId)
	if err != nil {
		return nil, err
	}

	return roles, nil
}

func (r *repository) UpdateSignature(ctx context.Context, id int64, signature string) error {
	_, err := r.db.Exec(ctx, "UPDATE users SET signature = $1 WHERE id = $2", signature, id)
	if err != nil {
		return err
	}

	return nil
}
