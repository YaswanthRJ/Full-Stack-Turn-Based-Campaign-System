package service

import (
	"backend/domain"
	"backend/repository"
	"context"
	"database/sql"
	"fmt"

	"github.com/google/uuid"
)

type UserService interface {
	CreateUser(ctx context.Context) (*domain.User, error)
}

type userService struct {
	repo repository.UserRepository
	db   *sql.DB
}

func NewUserService(repo repository.UserRepository, db *sql.DB) UserService {
	return &userService{
		repo: repo,
		db:   db,
	}
}

func (s *userService) CreateUser(ctx context.Context) (*domain.User, error) {
	user := &domain.User{
		ID: uuid.New().String(),
	}
	if err := s.repo.Create(ctx, s.db, user); err != nil {
		return nil, fmt.Errorf("create user: %w", err)
	}
	return user, nil
}
