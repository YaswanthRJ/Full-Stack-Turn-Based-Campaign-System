package repository

import (
	"backend/domain"
	"context"
	"fmt"
)

type CampaignRepository interface {
	Create(ctx context.Context, db DBTX, campaign domain.CampaignTemplate) error
	AddCreaturesToCampaign(ctx context.Context, db DBTX, campaignID string, creatureIDs []string) error
	AddStagesToCampaign(ctx context.Context, db DBTX, campaignID string, stages []domain.CampaignStage) error
	GetAllCampaigns(ctx context.Context, db DBTX) ([]domain.CampaignTemplate, error)
	GetCampaign(ctx context.Context, db DBTX, campaignId string) ([]domain.Campaign, error)
	UpdateStage(ctx context.Context, db DBTX, campaignId string, stage domain.CampaignStage) error
	DeleteStage(ctx context.Context, db DBTX, campaignId string, stageIndex int) error
	DeleteCampaign(ctx context.Context, db DBTX, campaignId string) error
	Count(ctx context.Context, db DBTX) (int, error)
}

type campaignRepo struct {
}

func NewCampaignRepo() CampaignRepository {
	return &campaignRepo{}
}

func (r *campaignRepo) Create(ctx context.Context, db DBTX, campaign domain.CampaignTemplate) error {
	_, err := db.ExecContext(ctx,
		"INSERT INTO campaign_templates (id,name,description,status) VALUES ($1,$2,$3,$4)",
		campaign.ID, campaign.Name, campaign.Description, campaign.Status,
	)
	return err
}

func (r *campaignRepo) AddCreaturesToCampaign(ctx context.Context, db DBTX, campaignID string, creatureIDs []string) error {
	query := `INSERT INTO campaign_playable_creatures (campaign_template_id, creature_id) VALUES `
	values := []interface{}{}
	for i, creatureID := range creatureIDs {
		if i > 0 {
			query += ","
		}
		query += fmt.Sprintf("($%d, $%d)", i*2+1, i*2+2)
		values = append(values, campaignID, creatureID)
	}
	query += ` ON CONFLICT (campaign_template_id, creature_id) DO NOTHING`
	_, err := db.ExecContext(ctx, query, values...)
	return err
}

func (r *campaignRepo) AddStagesToCampaign(ctx context.Context, db DBTX, campaignID string, stages []domain.CampaignStage) error {
	query := `INSERT INTO campaign_stages (campaign_template_id, stage_index, enemy_creature_id) VALUES `
	values := []interface{}{}
	for i, stage := range stages {
		if i > 0 {
			query += ", "
		}
		query += fmt.Sprintf("($%d, $%d, $%d)", i*3+1, i*3+2, i*3+3)
		values = append(values, campaignID, stage.StageIndex, stage.EnemyCreatureID)
	}
	query += ` ON CONFLICT (campaign_template_id, stage_index) DO NOTHING`
	_, err := db.ExecContext(ctx, query, values...)
	return err
}

func (r *campaignRepo) GetAllCampaigns(ctx context.Context, db DBTX) ([]domain.CampaignTemplate, error) {
	var campaigns []domain.CampaignTemplate

	query := `SELECT id, name, description, status FROM campaign_templates`

	rows, err := db.QueryContext(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("campaignRepo.GetAllCampaigns query error: %w", err)
	}
	defer rows.Close()

	for rows.Next() {
		var c domain.CampaignTemplate

		if err := rows.Scan(
			&c.ID,
			&c.Name,
			&c.Description,
			&c.Status,
		); err != nil {
			return nil, fmt.Errorf("campaignRepo.GetAllCampaigns scan error: %w", err)
		}

		campaigns = append(campaigns, c)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("campaignRepo.GetAllCampaigns rows error: %w", err)
	}

	return campaigns, nil
}

func (r *campaignRepo) GetCampaign(ctx context.Context, db DBTX, campaignId string) ([]domain.Campaign, error) {
	rows, err := r.fetchCampaignRows(ctx, db, campaignId)
	if err != nil {
		return nil, fmt.Errorf("campaignRepo.GetCampaign fetch error: %w", err)
	}
	if len(rows) == 0 {
		return []domain.Campaign{}, nil
	}
	campaign := buildCampaign(rows)
	if campaign == nil {
		return []domain.Campaign{}, nil
	}
	return []domain.Campaign{*campaign}, nil
}

func (r *campaignRepo) fetchCampaignRows(
	ctx context.Context,
	db DBTX,
	campaignID string,
) ([]campaignRow, error) {
	query := `
		SELECT t.id, t.name, t.description, t.status, pc.creature_id, s.stage_index, s.enemy_creature_id FROM campaign_templates t LEFT JOIN campaign_playable_creatures pc ON pc.campaign_template_id = t.id LEFT JOIN campaign_stages s ON s.campaign_template_id = t.id WHERE t.id = $1 ORDER BY s.stage_index`
	rows, err := db.QueryContext(ctx, query, campaignID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var result []campaignRow

	for rows.Next() {
		var row campaignRow
		if err := rows.Scan(
			&row.ID,
			&row.Name,
			&row.Description,
			&row.Status,
			&row.CreatureID,
			&row.StageIndex,
			&row.EnemyCreatureID,
		); err != nil {
			return nil, err
		}
		result = append(result, row)
	}

	return result, rows.Err()
}

func buildCampaign(rows []campaignRow) *domain.Campaign {
	if len(rows) == 0 {
		return nil
	}

	c := &domain.Campaign{
		Template: domain.CampaignTemplate{
			ID:          rows[0].ID,
			Name:        rows[0].Name,
			Description: rows[0].Description,
			Status:      rows[0].Status,
		},
	}

	creatures := map[string]struct{}{}
	stages := map[int]domain.CampaignStage{}

	for _, r := range rows {

		if r.CreatureID.Valid {
			creatures[r.CreatureID.String] = struct{}{}
		}

		if r.StageIndex.Valid && r.EnemyCreatureID.Valid {
			stages[int(r.StageIndex.Int64)] = domain.CampaignStage{
				StageIndex:      int(r.StageIndex.Int64),
				EnemyCreatureID: r.EnemyCreatureID.String,
			}
		}
	}

	for id := range creatures {
		c.PlayableCreatureIDs = append(c.PlayableCreatureIDs, id)
	}

	for _, s := range stages {
		c.Stages = append(c.Stages, s)
	}

	return c
}

func (r *campaignRepo) UpdateStage(ctx context.Context, db DBTX, campaignId string, stage domain.CampaignStage) error {
	res, err := db.ExecContext(ctx, `
		UPDATE campaign_stages
		SET enemy_creature_id = $3
		WHERE campaign_template_id = $1 AND stage_index = $2
	`, campaignId, stage.StageIndex, stage.EnemyCreatureID)
	if err != nil {
		return err
	}
	rows, err := res.RowsAffected()
	if err != nil {
		return fmt.Errorf("rows affected check: %w", err)
	}
	if rows == 0 {
		return fmt.Errorf("campaign stage not found")
	}
	return nil
}

func (r *campaignRepo) DeleteStage(ctx context.Context, db DBTX, campaignId string, stageIndex int) error {
	res, err := db.ExecContext(ctx, `
		DELETE FROM campaign_stages
		WHERE campaign_template_id = $1 AND stage_index = $2
	`, campaignId, stageIndex)
	if err != nil {
		return fmt.Errorf("delete stage: %w", err)
	}

	rows, err := res.RowsAffected()
	if err != nil {
		return fmt.Errorf("rows affected check: %w", err)
	}
	if rows == 0 {
		return fmt.Errorf("stage not found")
	}
	_, err = db.ExecContext(ctx, `
		UPDATE campaign_stages
		SET stage_index = stage_index - 1
		WHERE campaign_template_id = $1 AND stage_index > $2
	`, campaignId, stageIndex)
	if err != nil {
		return fmt.Errorf("reorder stages: %w", err)
	}

	return nil
}

func (r *campaignRepo) DeleteCampaign(ctx context.Context, db DBTX, campaignId string) error {
	res, err := db.ExecContext(ctx, `
		DELETE FROM campaign_templates
		WHERE id = $1
	`, campaignId)
	if err != nil {
		return fmt.Errorf("delete campaign: %w", err)
	}

	rows, err := res.RowsAffected()
	if err != nil {
		return fmt.Errorf("rows affected check: %w", err)
	}
	if rows == 0 {
		return fmt.Errorf("campaign not found")
	}

	return nil
}

func (r *campaignRepo) Count(ctx context.Context, db DBTX) (int, error) {
	var count int

	err := db.QueryRowContext(ctx, `SELECT COUNT(*) FROM campaign_templates`).Scan(&count)
	if err != nil {
		return 0, fmt.Errorf("campaignRepo.Count: %w", err)
	}
	return count, nil
}
