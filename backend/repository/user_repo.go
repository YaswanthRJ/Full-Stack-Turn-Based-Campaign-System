package repository

import (
	"backend/domain"
	"context"
	"fmt"
)

type UserRepository interface {
	Create(ctx context.Context, db DBTX, user *domain.User) error
	Count(ctx context.Context, db DBTX) (int, error)
}

type userRepo struct {
}

func NewUserRepo() UserRepository {
	return &userRepo{}
}

func (r *userRepo) Create(ctx context.Context, db DBTX, user *domain.User) error {
	_, err := db.ExecContext(ctx, "INSERT INTO users (id) VALUES($1)", user.ID)
	if err != nil {
		return fmt.Errorf("userRepo.Create:  %w", err)
	}
	return nil
}

func (r *userRepo) Count(ctx context.Context, db DBTX) (int, error) {
	var count int

	err := db.QueryRowContext(ctx, `SELECT COUNT(*) FROM users`).Scan(&count)
	if err != nil {
		return 0, fmt.Errorf("userRepo.Count: %w", err)
	}
	return count, nil
}
