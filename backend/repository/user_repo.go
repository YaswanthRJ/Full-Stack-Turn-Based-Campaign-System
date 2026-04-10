package repository

import (
	"backend/domain"
	"context"
	"database/sql"
	"fmt"
)

type UserRepository interface {
	Create(ctx context.Context, user *domain.User) error
}

type userRepo struct {
	db *sql.DB
}

func NewUserRepo(db *sql.DB) UserRepository {
	return &userRepo{db: db}
}

func (r *userRepo) Create(ctx context.Context, user *domain.User) error {
	_, err := r.db.Exec("INSERT INTO users (id) VALUES($1)", user.ID)
	if err != nil {
		return fmt.Errorf("userRepo.Create:  %w", err)
	}
	return nil
}
