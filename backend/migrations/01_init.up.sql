CREATE TABLE users (
    id TEXT PRIMARY KEY, 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE creatures (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    is_playable BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE creature_stats (
    creature_id TEXT PRIMARY KEY REFERENCES creatures(id) ON DELETE CASCADE,
    max_hp INTEGER NOT NULL,
    attack INTEGER NOT NULL,
    defense INTEGER NOT NULL,
    action_point INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE creature_actions (
    creature_id TEXT REFERENCES creatures(id) ON DELETE CASCADE,
    action_id TEXT REFERENCES actions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (creature_id, action_id)
);

CREATE INDEX idx_creatures_is_playable ON creatures(is_playable);
CREATE INDEX idx_creature_actions_action_id ON creature_actions(action_id);
CREATE INDEX idx_actions_type ON actions(type);
CREATE INDEX idx_creatures_name ON creatures(name);
