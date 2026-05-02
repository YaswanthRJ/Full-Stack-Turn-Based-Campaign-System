package repository

import (
	"backend/domain"
	"context"
	"database/sql"
	"errors"
	"fmt"
)

type UserRepository interface {
	Create(ctx context.Context, db DBTX, user *domain.User) error
	Count(ctx context.Context, db DBTX) (int, error)
	Register(ctx context.Context, db DBTX, user *domain.User) error
	GetByUsername(ctx context.Context, db DBTX, username string) (*domain.User, error)
	GetByUserId(ctx context.Context, db DBTX, userID string) (string, error)
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

func (r *userRepo) Register(ctx context.Context, db DBTX, user *domain.User) error {
	result, err := db.ExecContext(
		ctx,
		`UPDATE users
		 SET username = $2,
		     password_hash = $3
		 WHERE id = $1`,
		user.ID,
		user.Username,
		user.PasswordHash,
	)
	if err != nil {
		return fmt.Errorf("userRepo.Register: %w", err)
	}
	rows, _ := result.RowsAffected()
	if rows == 0 {
		return errors.New("user not found")
	}
	return nil
}

func (r *userRepo) GetByUsername(ctx context.Context, db DBTX, username string) (*domain.User, error) {
	row := db.QueryRowContext(
		ctx,
		`SELECT id, username, password_hash
		 FROM users
		 WHERE username = $1`,
		username,
	)

	var user domain.User

	err := row.Scan(
		&user.ID,
		&user.Username,
		&user.PasswordHash,
	)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, errors.New("invalid credentials")
		}
		return nil, fmt.Errorf("userRepo.GetByUsername: %w", err)
	}

	return &user, nil
}

func (r *userRepo) GetByUserId(ctx context.Context, db DBTX, userID string) (string, error) {
	var username sql.NullString
	err := db.QueryRowContext(
		ctx,
		`SELECT username FROM users WHERE id = $1`,
		userID,
	).Scan(&username)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return "", sql.ErrNoRows
		}
		return "", fmt.Errorf("userRepo.GetByUserId: %w", err)
	}

	if !username.Valid {
		return "", nil
	}

	return username.String, nil
}
