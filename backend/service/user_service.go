package service

import (
	"backend/domain"
	"backend/repository"
	"context"
	"database/sql"
	"errors"
	"fmt"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type UserService interface {
	CreateUser(ctx context.Context) (*domain.User, error)
	RegisterUser(ctx context.Context, userID string, userName string, password string) (*domain.User, error)
	Login(ctx context.Context, userName string, password string) (*domain.User, error)
	CheckAuth(ctx context.Context, userID string) (*AuthCheckResult, error)
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

func (s *userService) RegisterUser(ctx context.Context, userID string, userName string, password string) (*domain.User, error) {
	hashedPasswordBytes, err := bcrypt.GenerateFromPassword(
		[]byte(password),
		bcrypt.DefaultCost,
	)
	if err != nil {
		return nil, err
	}

	hashedPassword := string(hashedPasswordBytes)

	user := &domain.User{
		ID:           userID,
		Username:     &userName,
		PasswordHash: &hashedPassword,
	}

	err = s.repo.Register(ctx, s.db, user)
	if err != nil {
		return nil, err
	}
	return user, nil
}

func (s *userService) Login(ctx context.Context, userName string, password string) (*domain.User, error) {
	user, err := s.repo.GetByUsername(ctx, s.db, userName)
	if err != nil {
		return nil, fmt.Errorf("login: %w", err)
	}

	if user.PasswordHash == nil {
		return nil, errors.New("invalid credentials")
	}

	err = bcrypt.CompareHashAndPassword(
		[]byte(*user.PasswordHash),
		[]byte(password),
	)
	if err != nil {
		return nil, errors.New("invalid credentials")
	}

	return user, nil
}

func (s *userService) CheckAuth(ctx context.Context, userID string) (*AuthCheckResult, error) {
	username, err := s.repo.GetByUserId(ctx, s.db, userID)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return &AuthCheckResult{
				IsAuthenticated: false,
				Username:        nil,
			}, nil
		}
		return nil, err
	}

	return &AuthCheckResult{
		IsAuthenticated: username != "",
		Username:        &username,
	}, nil
}
