package service

import (
	"backend/repository"
	"context"
	"database/sql"
)

type Stats struct {
	Users     int `json:"users"`
	Actions   int `json:"actions"`
	Creatures int `json:"creatures"`
	Campaigns int `json:"campaigns"`
}

type StatsService interface {
	GetStats(ctx context.Context) (*Stats, error)
}

type statsService struct {
	userRepo     repository.UserRepository
	actionRepo   repository.ActionRepository
	creatureRepo repository.CreatureRepository
	campaignRepo repository.CampaignRepository

	db *sql.DB
}

func NewStatsService(userRepo repository.UserRepository,
	actionRepo repository.ActionRepository,
	creatureRepo repository.CreatureRepository,
	campaignRepo repository.CampaignRepository, db *sql.DB) StatsService {
	return &statsService{
		userRepo:     userRepo,
		actionRepo:   actionRepo,
		creatureRepo: creatureRepo,
		campaignRepo: campaignRepo,
		db:           db,
	}
}

func (s *statsService) GetStats(ctx context.Context) (*Stats, error) {

	users, err := s.userRepo.Count(ctx, s.db)
	if err != nil {
		return nil, err
	}

	actions, err := s.actionRepo.Count(ctx, s.db)
	if err != nil {
		return nil, err
	}

	creatures, err := s.creatureRepo.Count(ctx, s.db)
	if err != nil {
		return nil, err
	}

	campaigns, err := s.campaignRepo.Count(ctx, s.db)
	if err != nil {
		return nil, err
	}

	return &Stats{
		Users:     users,
		Actions:   actions,
		Creatures: creatures,
		Campaigns: campaigns,
	}, nil
}
