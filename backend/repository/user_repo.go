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
	RecordFightResult(ctx context.Context, db DBTX, userID string, victory bool) error
	RecordCampaignComplete(ctx context.Context, db DBTX, userID string, campaignTemplateId string) error
	GetCompletedCampaignCount(ctx context.Context, db DBTX, userID string) (int, error)
	GetFightStats(ctx context.Context, db DBTX, userID string) (fights int, wins int, losses int, err error)
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

func (r *userRepo) RecordFightResult(ctx context.Context, db DBTX, userID string, victory bool) error {
	query := `
		INSERT INTO user_analytics (user_id, fights, victories)
		VALUES ($1, 1, CASE WHEN $2 THEN 1 ELSE 0 END)
		ON CONFLICT (user_id)
		DO UPDATE SET
			fights = user_analytics.fights + 1,
			victories = user_analytics.victories + CASE WHEN $2 THEN 1 ELSE 0 END;
	`

	_, err := db.ExecContext(ctx, query, userID, victory)
	return err
}

func (r *userRepo) RecordCampaignComplete(ctx context.Context, db DBTX, userID string, campaignTemplateId string) error {

	query := `
		INSERT INTO user_campaign_completions (user_id, campaign_template_id)
		VALUES ($1, $2)
		ON CONFLICT (user_id, campaign_template_id)
		DO NOTHING;
	`

	_, err := db.ExecContext(ctx, query, userID, campaignTemplateId)
	return err
}

func (r *userRepo) GetCompletedCampaignCount(ctx context.Context, db DBTX, userID string) (int, error) {
	var count int

	err := db.QueryRowContext(ctx, `
		SELECT COUNT(*)
		FROM user_campaign_completions
		WHERE user_id = $1
	`, userID).Scan(&count)

	if err != nil {
		return 0, fmt.Errorf("userRepo.GetCompletedCampaignCount: %w", err)
	}

	return count, nil
}

func (r *userRepo) GetFightStats(ctx context.Context, db DBTX, userID string) (int, int, int, error) {
	var fights, wins int

	err := db.QueryRowContext(ctx, `
		SELECT fights, victories
		FROM user_analytics
		WHERE user_id = $1
	`, userID).Scan(&fights, &wins)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return 0, 0, 0, nil // user has no stats yet
		}
		return 0, 0, 0, fmt.Errorf("userRepo.GetFightStats: %w", err)
	}

	losses := fights - wins
	if losses < 0 {
		losses = 0
	}

	return fights, wins, losses, nil
}
