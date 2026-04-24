-- =====================================================
-- DEV SEED DATA (UUID + Shared Actions)
-- =====================================================

-- =====================================================
-- USERS
-- =====================================================

INSERT INTO users (id) VALUES
('10000000-0000-0000-0000-000000000001');


-- =====================================================
-- ACTIONS (shared across all creatures)
-- =====================================================

INSERT INTO actions (
    id, name, description, type,
    multiplier, tag, accuracy, action_weight
) VALUES

-- Offensive Basics
('20000000-0000-0000-0000-000000000001', 'Bite',         'A quick biting attack',              'offensive', 1.00, 'physical', 0.90, 2),
('20000000-0000-0000-0000-000000000002', 'Scratch',      'A light scratching attack',          'offensive', 0.80, 'physical', 0.95, 2),
('20000000-0000-0000-0000-000000000003', 'Tackle',       'A forceful body slam',               'offensive', 1.40, 'physical', 0.80, 4),
('20000000-0000-0000-0000-000000000004', 'Punch',        'A basic punch',                      'offensive', 0.90, 'physical', 0.95, 2),
('20000000-0000-0000-0000-000000000005', 'Kick',         'A stronger kick',                    'offensive', 1.20, 'physical', 0.85, 3),
('20000000-0000-0000-0000-000000000006', 'Slash',        'A standard weapon slash',            'offensive', 1.10, 'physical', 0.90, 3),
('20000000-0000-0000-0000-000000000007', 'Heavy Slash',  'A heavy committed strike',           'offensive', 1.50, 'physical', 0.85, 5),
('20000000-0000-0000-0000-000000000008', 'Stab',         'A quick precise stab',               'offensive', 1.10, 'physical', 0.95, 2),
('20000000-0000-0000-0000-000000000009', 'Shield Bash',  'Strike with shield weight',          'offensive', 1.20, 'control',  0.90, 3),
('20000000-0000-0000-0000-000000000010', 'Maul',         'A savage crushing attack',           'offensive', 1.60, 'physical', 0.85, 5),

-- Special
('20000000-0000-0000-0000-000000000011', 'Flamethrower', 'A stream of burning flame',          'offensive', 1.80, 'fire',     0.85, 6),
('20000000-0000-0000-0000-000000000012', 'Sky Attack',   'A diving strike from above',         'offensive', 2.00, 'physical', 0.75, 7),

-- Defensive
('20000000-0000-0000-0000-000000000013', 'Dodge',        'Evade incoming attacks',             'defensive', 0.50, 'evasion',  1.00, 2),
('20000000-0000-0000-0000-000000000014', 'Block',        'Reduce incoming damage',             'defensive', 0.70, 'defense',  1.00, 2);


-- =====================================================
-- CREATURES
-- =====================================================

INSERT INTO creatures (
    id, name, description, is_playable
) VALUES

('30000000-0000-0000-0000-000000000001', 'Human Peasant', 'A common villager who havent touched a weapon before', TRUE),
('30000000-0000-0000-0000-000000000002', 'Human Soldier', 'A trained frontline fighter', TRUE),
('30000000-0000-0000-0000-000000000003', 'Wolf',          'A fast aggressive pack hunter', FALSE),
('30000000-0000-0000-0000-000000000004', 'Dragon',        'A legendary ancient beast', TRUE);


-- =====================================================
-- CREATURE STATS
-- Baseline:
-- HP avg 50, max 100
-- AP avg 10, max 20
-- Stats avg 10
-- =====================================================

INSERT INTO creature_stats (
    id, creature_id, max_hp, attack, defence, action_point, speed
) VALUES

-- Peasant (true baseline)
('40000000-0000-0000-0000-000000000001',
 '30000000-0000-0000-0000-000000000001',
 30, 10, 10, 10, 10),

-- Soldier (stronger than average)
('40000000-0000-0000-0000-000000000002',
 '30000000-0000-0000-0000-000000000002',
 50, 12, 12, 10, 10),

-- Wolf (fragile, fast, aggressive)
('40000000-0000-0000-0000-000000000003',
 '30000000-0000-0000-0000-000000000003',
 20, 13, 10, 12, 14),

-- Dragon (capstone)
('40000000-0000-0000-0000-000000000004',
 '30000000-0000-0000-0000-000000000004',
 60, 25, 25, 20, 12);


-- =====================================================
-- CREATURE ACTIONS
-- =====================================================

-- Human Peasant
INSERT INTO creature_actions (creature_id, action_id) VALUES
('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000004'), -- Punch
('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000005'), -- Kick
('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000013'); -- Dodge


-- Human Soldier
INSERT INTO creature_actions (creature_id, action_id) VALUES
('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000007'), -- Heavy Slash
('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000008'), -- Stab
('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000014'), -- Block
('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000009'); -- Shield Bash


-- Wolf
INSERT INTO creature_actions (creature_id, action_id) VALUES
('30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000001'), -- Bite
('30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000002'), -- Scratch
('30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000003'), -- Tackle
('30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000013'); -- Dodge


-- Dragon
INSERT INTO creature_actions (creature_id, action_id) VALUES
('30000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000011'), -- Flamethrower
('30000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000010'), -- Maul
('30000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000001'), -- Bite
('30000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000012'); -- Sky Attack


-- =====================================================
-- CAMPAIGNS
-- =====================================================

INSERT INTO campaign_templates (
    id, name, description, status
) VALUES

('50000000-0000-0000-0000-000000000001',
 'Wolf Pack',
 'Clear out a pack of wolves',
 'active'),

('50000000-0000-0000-0000-000000000002',
 'Recover Egg',
 'Punish the villains who destroyed your eggs',
 'active');


-- =====================================================
-- CAMPAIGN PLAYABLE CREATURES
-- =====================================================

-- Wolf Pack: Peasant or Soldier
INSERT INTO campaign_playable_creatures (
    campaign_template_id, creature_id
) VALUES
('50000000-0000-0000-0000-000000000001',
 '30000000-0000-0000-0000-000000000001'),

('50000000-0000-0000-0000-000000000001',
 '30000000-0000-0000-0000-000000000002');


-- Recover Egg: Dragon only
INSERT INTO campaign_playable_creatures (
    campaign_template_id, creature_id
) VALUES
('50000000-0000-0000-0000-000000000002',
 '30000000-0000-0000-0000-000000000004');


-- =====================================================
-- CAMPAIGN STAGES
-- =====================================================

-- Wolf Pack: 4 wolves
INSERT INTO campaign_stages (
    campaign_template_id, stage_index, enemy_creature_id
) VALUES
('50000000-0000-0000-0000-000000000001', 1, '30000000-0000-0000-0000-000000000003'),
('50000000-0000-0000-0000-000000000001', 2, '30000000-0000-0000-0000-000000000003'),
('50000000-0000-0000-0000-000000000001', 3, '30000000-0000-0000-0000-000000000003'),
('50000000-0000-0000-0000-000000000001', 4, '30000000-0000-0000-0000-000000000003');


-- Recover Egg: Soldier, Soldier, Peasant, Peasant
INSERT INTO campaign_stages (
    campaign_template_id, stage_index, enemy_creature_id
) VALUES
('50000000-0000-0000-0000-000000000002', 1, '30000000-0000-0000-0000-000000000002'),
('50000000-0000-0000-0000-000000000002', 2, '30000000-0000-0000-0000-000000000002'),
('50000000-0000-0000-0000-000000000002', 3, '30000000-0000-0000-0000-000000000001'),
('50000000-0000-0000-0000-000000000002', 4, '30000000-0000-0000-0000-000000000001');































-- -- Seed file: dummy data for all tables
-- -- IDs are fixed UUID v4 values so rows are stable and cross-referenceable.
-- -- Insertion order satisfies all foreign key constraints.
-- -- actions.type uses "offensive"/"defensive" to match engine_helpers.go scoreActions().
-- -- fights.status uses "player_won"/"player_lost"/"active" from domain constants.
-- -- campaign_sessions.status uses "active"/"completed"/"lost" from domain constants.

-- -- users
-- INSERT INTO users (id) VALUES
--     ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
--     ('b1ffcd00-0d1c-5fg9-cc7e-7cc0ce491b22');

-- -- actions  (type must be "offensive" or "defensive" — used by engine scoreActions switch)
-- INSERT INTO actions (id, name, description, type, multiplier, tag, accuracy, action_weight) VALUES
--     ('11111111-0000-4000-8000-000000000001', 'Slash',        'A quick slashing attack.',           'offensive', 1.0, 'physical', 0.95, 3),
--     ('11111111-0000-4000-8000-000000000002', 'Fireball',     'Hurl a ball of flame at the enemy.', 'offensive', 1.5, 'magic',    0.85, 5),
--     ('11111111-0000-4000-8000-000000000003', 'Heavy Strike', 'A slow but devastating blow.',       'offensive', 2.0, 'physical', 0.70, 7),
--     ('11111111-0000-4000-8000-000000000004', 'Shield Bash',  'Strike and reduce incoming damage.', 'defensive', 0.8, 'physical', 0.90, 3),
--     ('11111111-0000-4000-8000-000000000005', 'Guard',        'Take a defensive stance.',           'defensive', 0.5, 'support',  1.00, 2),
--     ('11111111-0000-4000-8000-000000000006', 'Parry',        'Deflect the next incoming attack.',  'defensive', 1.0, 'physical', 0.85, 4);

-- -- creatures (playable and non-playable)
-- INSERT INTO creatures (id, name, description, is_playable) VALUES
--     ('22222222-0000-4000-8000-000000000001', 'Knight',  'A stalwart warrior clad in plate armour.',      TRUE),
--     ('22222222-0000-4000-8000-000000000002', 'Mage',    'A scholarly spellcaster wielding arcane fire.', TRUE),
--     ('22222222-0000-4000-8000-000000000003', 'Rogue',   'A swift shadow who strikes from the dark.',     TRUE),
--     ('22222222-0000-4000-8000-000000000004', 'Goblin',  'A small but cunning green menace.',             FALSE),
--     ('22222222-0000-4000-8000-000000000005', 'Troll',   'A massive regenerating brute.',                 FALSE),
--     ('22222222-0000-4000-8000-000000000006', 'Dragon',  'An ancient wyrm of tremendous power.',          FALSE);

-- -- creature_stats (one-to-one; creature_id is UNIQUE)
-- INSERT INTO creature_stats (id, creature_id, max_hp, attack, defence, action_point, speed) VALUES
--     ('33333333-0000-4000-8000-000000000001', '22222222-0000-4000-8000-000000000001', 120, 18, 20,  8,  6),
--     ('33333333-0000-4000-8000-000000000002', '22222222-0000-4000-8000-000000000002',  70, 25,  8, 12,  9),
--     ('33333333-0000-4000-8000-000000000003', '22222222-0000-4000-8000-000000000003',  90, 22, 12, 10, 14),
--     ('33333333-0000-4000-8000-000000000004', '22222222-0000-4000-8000-000000000004',  40, 12,  6,  6, 10),
--     ('33333333-0000-4000-8000-000000000005', '22222222-0000-4000-8000-000000000005', 180, 20, 14,  6,  4),
--     ('33333333-0000-4000-8000-000000000006', '22222222-0000-4000-8000-000000000006', 300, 35, 22, 10,  8);

-- -- creature_actions (many-to-many)
-- INSERT INTO creature_actions (creature_id, action_id) VALUES
--     ('22222222-0000-4000-8000-000000000001', '11111111-0000-4000-8000-000000000001'), -- knight: slash
--     ('22222222-0000-4000-8000-000000000001', '11111111-0000-4000-8000-000000000004'), -- knight: shield bash
--     ('22222222-0000-4000-8000-000000000001', '11111111-0000-4000-8000-000000000005'), -- knight: guard
--     ('22222222-0000-4000-8000-000000000002', '11111111-0000-4000-8000-000000000002'), -- mage: fireball
--     ('22222222-0000-4000-8000-000000000002', '11111111-0000-4000-8000-000000000003'), -- mage: heavy strike
--     ('22222222-0000-4000-8000-000000000002', '11111111-0000-4000-8000-000000000006'), -- mage: parry
--     ('22222222-0000-4000-8000-000000000003', '11111111-0000-4000-8000-000000000001'), -- rogue: slash
--     ('22222222-0000-4000-8000-000000000003', '11111111-0000-4000-8000-000000000003'), -- rogue: heavy strike
--     ('22222222-0000-4000-8000-000000000003', '11111111-0000-4000-8000-000000000006'), -- rogue: parry
--     ('22222222-0000-4000-8000-000000000004', '11111111-0000-4000-8000-000000000001'), -- goblin: slash
--     ('22222222-0000-4000-8000-000000000004', '11111111-0000-4000-8000-000000000005'), -- goblin: guard
--     ('22222222-0000-4000-8000-000000000005', '11111111-0000-4000-8000-000000000001'), -- troll: slash
--     ('22222222-0000-4000-8000-000000000005', '11111111-0000-4000-8000-000000000004'), -- troll: shield bash
--     ('22222222-0000-4000-8000-000000000006', '11111111-0000-4000-8000-000000000002'), -- dragon: fireball
--     ('22222222-0000-4000-8000-000000000006', '11111111-0000-4000-8000-000000000003'); -- dragon: heavy strike

-- -- campaign_templates
-- INSERT INTO campaign_templates (id, name, description, status) VALUES
--     ('44444444-0000-4000-8000-000000000001', 'Goblin Raid',  'Drive back the goblin horde threatening the village.', 'active'),
--     ('44444444-0000-4000-8000-000000000002', 'Troll Lair',   'Venture into the mountain lair and slay the troll.',   'active'),
--     ('44444444-0000-4000-8000-000000000003', 'Dragon Keep',  'Storm the ancient keep and face the dragon lord.',     'inactive');

-- -- campaign_playable_creatures
-- INSERT INTO campaign_playable_creatures (campaign_template_id, creature_id) VALUES
--     ('44444444-0000-4000-8000-000000000001', '22222222-0000-4000-8000-000000000001'), -- goblin raid: knight
--     ('44444444-0000-4000-8000-000000000001', '22222222-0000-4000-8000-000000000002'), -- goblin raid: mage
--     ('44444444-0000-4000-8000-000000000001', '22222222-0000-4000-8000-000000000003'), -- goblin raid: rogue
--     ('44444444-0000-4000-8000-000000000002', '22222222-0000-4000-8000-000000000001'), -- troll lair: knight
--     ('44444444-0000-4000-8000-000000000002', '22222222-0000-4000-8000-000000000002'), -- troll lair: mage
--     ('44444444-0000-4000-8000-000000000003', '22222222-0000-4000-8000-000000000001'), -- dragon keep: knight
--     ('44444444-0000-4000-8000-000000000003', '22222222-0000-4000-8000-000000000002'), -- dragon keep: mage
--     ('44444444-0000-4000-8000-000000000003', '22222222-0000-4000-8000-000000000003'); -- dragon keep: rogue

-- -- campaign_stages (enemy encounters, 0-indexed)
-- INSERT INTO campaign_stages (campaign_template_id, stage_index, enemy_creature_id) VALUES
--     ('44444444-0000-4000-8000-000000000001', 0, '22222222-0000-4000-8000-000000000004'), -- goblin raid s0: goblin
--     ('44444444-0000-4000-8000-000000000001', 1, '22222222-0000-4000-8000-000000000004'), -- goblin raid s1: goblin
--     ('44444444-0000-4000-8000-000000000001', 2, '22222222-0000-4000-8000-000000000005'), -- goblin raid s2: troll
--     ('44444444-0000-4000-8000-000000000002', 0, '22222222-0000-4000-8000-000000000004'), -- troll lair s0: goblin
--     ('44444444-0000-4000-8000-000000000002', 1, '22222222-0000-4000-8000-000000000005'), -- troll lair s1: troll
--     ('44444444-0000-4000-8000-000000000003', 0, '22222222-0000-4000-8000-000000000004'), -- dragon keep s0: goblin
--     ('44444444-0000-4000-8000-000000000003', 1, '22222222-0000-4000-8000-000000000005'), -- dragon keep s1: troll
--     ('44444444-0000-4000-8000-000000000003', 2, '22222222-0000-4000-8000-000000000006'); -- dragon keep s2: dragon

-- -- campaign_sessions
-- INSERT INTO campaign_sessions (
--     id, user_id, campaign_template_id, player_creature_id,
--     current_stage_index, max_hp, current_hp, max_action_points, current_action_points, status
-- ) VALUES
--     (
--         '55555555-0000-4000-8000-000000000001',
--         'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
--         '44444444-0000-4000-8000-000000000001',
--         '22222222-0000-4000-8000-000000000001',
--         1, 120, 95, 8, 8, 'active'
--     ),
--     (
--         '55555555-0000-4000-8000-000000000002',
--         'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
--         '44444444-0000-4000-8000-000000000002',
--         '22222222-0000-4000-8000-000000000002',
--         0, 70, 70, 12, 12, 'active'
--     ),
--     (
--         '55555555-0000-4000-8000-000000000003',
--         'b1ffcd00-0d1c-5fg9-cc7e-7cc0ce491b22',
--         '44444444-0000-4000-8000-000000000001',
--         '22222222-0000-4000-8000-000000000003',
--         2, 90, 42, 10, 7, 'active'
--     ),
--     (
--         '55555555-0000-4000-8000-000000000004',
--         'b1ffcd00-0d1c-5fg9-cc7e-7cc0ce491b22',
--         '44444444-0000-4000-8000-000000000003',
--         '22222222-0000-4000-8000-000000000001',
--         0, 120, 120, 8, 8, 'completed'
--     );

-- -- fights
-- -- status values from domain: "active", "player_won", "player_lost"
-- INSERT INTO fights (
--     id, campaign_session_id, user_id,
--     player_current_hp, player_max_hp, player_current_action_points, player_max_action_points,
--     enemy_creature_id, enemy_current_hp, enemy_max_hp, enemy_current_action_points, enemy_max_action_points,
--     round_number, status
-- ) VALUES
--     (
--         '66666666-0000-4000-8000-000000000001',
--         '55555555-0000-4000-8000-000000000001',
--         'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
--         95, 120, 8, 8,
--         '22222222-0000-4000-8000-000000000004', 25, 40, 4, 6,
--         3, 'active'
--     ),
--     (
--         '66666666-0000-4000-8000-000000000002',
--         '55555555-0000-4000-8000-000000000002',
--         'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
--         60, 70, 10, 12,
--         '22222222-0000-4000-8000-000000000004', 0, 40, 0, 6,
--         4, 'player_won'
--     ),
--     (
--         '66666666-0000-4000-8000-000000000003',
--         '55555555-0000-4000-8000-000000000003',
--         'b1ffcd00-0d1c-5fg9-cc7e-7cc0ce491b22',
--         42, 90, 7, 10,
--         '22222222-0000-4000-8000-000000000005', 90, 180, 6, 6,
--         5, 'active'
--     ),
--     (
--         '66666666-0000-4000-8000-000000000004',
--         '55555555-0000-4000-8000-000000000004',
--         'b1ffcd00-0d1c-5fg9-cc7e-7cc0ce491b22',
--         0, 120, 0, 8,
--         '22222222-0000-4000-8000-000000000004', 15, 40, 3, 6,
--         6, 'player_lost'
--     );
