package service

import (
	"backend/domain"
	"backend/repository"
	"context"
	"fmt"

	"github.com/google/uuid"
)

type UserService interface {
	CreateUser(ctx context.Context) (*domain.User, error)
}

type userService struct {
	repo repository.UserRepository
}

func NewUserService(repo repository.UserRepository) UserService {
	return &userService{repo: repo}
}

func (s *userService) CreateUser(ctx context.Context) (*domain.User, error) {
	user := &domain.User{
		ID: uuid.New().String(),
	}
	if err := s.repo.Create(ctx, user); err != nil {
		return nil, fmt.Errorf("create user: %w", err)
	}
	return user, nil
}
