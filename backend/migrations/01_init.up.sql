CREATE TABLE users (
    id TEXT PRIMARY KEY, 
    username TEXT UNIQUE,
    password_hash TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE user_analytics (
    user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    fights INTEGER NOT NULL DEFAULT 0,
    victories INTEGER NOT NULL DEFAULT 0
);


CREATE TABLE actions(
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL,
    multiplier NUMERIC,
    tag TEXT,
    accuracy NUMERIC,
    action_weight NUMERIC,
    icon_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE creatures (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    image_public_id TEXT,
    is_playable BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE creature_stats (
    id TEXT PRIMARY KEY,
    creature_id TEXT UNIQUE NOT NULL REFERENCES creatures(id) ON DELETE CASCADE,
    max_hp INTEGER NOT NULL,
    attack INTEGER NOT NULL,
    defence INTEGER NOT NULL,
    action_point INTEGER NOT NULL,
    speed INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE creature_actions (
    creature_id TEXT REFERENCES creatures(id) ON DELETE CASCADE,
    action_id TEXT REFERENCES actions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (creature_id, action_id)
);

CREATE TABLE campaign_templates (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    outro_text TEXT,
    outro_image TEXT,
    status TEXT NOT NULL DEFAULT 'inactive'
);

CREATE TABLE campaign_playable_creatures (
    campaign_template_id TEXT REFERENCES campaign_templates(id) ON DELETE CASCADE,
    creature_id TEXT REFERENCES creatures(id) ON DELETE CASCADE,
    PRIMARY KEY (campaign_template_id, creature_id)
);

CREATE TABLE campaign_stages (
    campaign_template_id TEXT REFERENCES campaign_templates(id) ON DELETE CASCADE,
    stage_index INTEGER NOT NULL,
    enemy_creature_id TEXT REFERENCES creatures(id) ON DELETE CASCADE,
    PRIMARY KEY (campaign_template_id, stage_index)
);

CREATE TABLE user_campaign_completions (
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    campaign_template_id TEXT REFERENCES campaign_templates(id) ON DELETE CASCADE,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, campaign_template_id)
);


CREATE INDEX idx_creatures_is_playable ON creatures(is_playable);
CREATE INDEX idx_creature_actions_action_id ON creature_actions(action_id);
CREATE INDEX idx_actions_type ON actions(type);
CREATE INDEX idx_creatures_name ON creatures(name);
