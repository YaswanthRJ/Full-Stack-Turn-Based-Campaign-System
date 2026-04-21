CREATE TABLE campaign_sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    campaign_template_id TEXT NOT NULL REFERENCES campaign_templates(id) ON DELETE CASCADE,
    player_creature_id TEXT NOT NULL REFERENCES creatures(id) ON DELETE CASCADE,

    current_stage_index INTEGER DEFAULT 0,

    max_hp NUMERIC,
    current_hp NUMERIC,
    max_action_points NUMERIC,
    current_action_points NUMERIC,

    status TEXT,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE fights (
    id TEXT PRIMARY KEY,
    campaign_session_id TEXT NOT NULL REFERENCES campaign_sessions(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    player_current_hp NUMERIC,
    player_max_hp NUMERIC,
    player_current_action_points NUMERIC,
    player_max_action_points NUMERIC,

    enemy_creature_id TEXT NOT NULL REFERENCES creatures(id) ON DELETE CASCADE,
    enemy_current_hp NUMERIC,
    enemy_max_hp NUMERIC,
    enemy_current_action_points NUMERIC,
    enemy_max_action_points NUMERIC,

    round_number INTEGER DEFAULT 1,
    status TEXT,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_campaign_sessions_updated_at
BEFORE UPDATE ON campaign_sessions
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_fights_updated_at
BEFORE UPDATE ON fights
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();