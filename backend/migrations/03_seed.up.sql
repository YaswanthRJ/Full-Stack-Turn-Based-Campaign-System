-- =====================================================
-- ACTIONS
-- =====================================================

INSERT INTO actions (
    id, name, description, type,
    multiplier, tag, accuracy, action_weight
) VALUES

('20000000-0000-0000-0000-000000000001', 'Maul', 'Target is rended with powerful jaws and claws', 'offensive', 1.2, 'physical', 0.80, 3),
('20000000-0000-0000-0000-000000000002', 'Flamethrower', 'Target is blasted with a fiery breath', 'offensive', 1.5, 'physical', 0.90, 5),
('20000000-0000-0000-0000-000000000003', 'Harden', 'Harden the body in an attempt to mitigate incoming damage', 'defensive', 0.6, 'physical', 0.90, 2),
('20000000-0000-0000-0000-000000000004', 'Sky Attack', 'A devastating diving hit, if it connects', 'offensive', 2.0, 'physical', 0.70, 5),

('20000000-0000-0000-0000-000000000010','Slash','A controlled, reliable sword strike','offensive',1.1,'physical',0.90,3),
('20000000-0000-0000-0000-000000000011','Block','Raise guard to reduce incoming damage','defensive',0.90,'physical',1.00,2),
('20000000-0000-0000-0000-000000000012','Shield Bash','Strike with shield','offensive',0.8,'physical',0.75,3),
('20000000-0000-0000-0000-000000000013','Holy Strike','A devastating empowered strike infused with divine force','offensive',2.4,'physical',0.80,8),

('20000000-0000-0000-0000-000000000020','Stab','A simple spear thrust','offensive',1.0,'physical',0.80,2),
('20000000-0000-0000-0000-000000000021','Dodge','Wild evasive movement, hoping to avoid damage','defensive',0.90,'physical',0.35,1),
('20000000-0000-0000-0000-000000000022','Punch','Desperate close-range strike','offensive',0.7,'physical',0.85,2),
('20000000-0000-0000-0000-000000000023','Tackle','A full body tackle','offensive',1.0,'physical',0.75,3),

('20000000-0000-0000-0000-000000000030','Bite','Basic biting attack used by beasts','offensive',1.0,'physical',0.85,2);


-- =====================================================
-- CREATURES
-- =====================================================

INSERT INTO creatures (
    id, name, description, image_url, image_public_id, is_playable
) VALUES

('30000000-0000-0000-0000-000000000001', 'Dragon', 'A legendary creature','https://res.cloudinary.com/dr9lh95nh/image/upload/v1777790238/creatures/e146fc4d-b36e-46e6-82bd-272e7c09d613.png','creatures/e146fc4d-b36e-46e6-82bd-272e7c09d613',TRUE),
('30000000-0000-0000-0000-000000000002', 'Hero', 'A human champion devoted to righteousness', 'https://res.cloudinary.com/dr9lh95nh/image/upload/v1777874898/creatures/690e706f-eec6-4ab0-9a94-c2fe8337876d.jpg', 'creatures/690e706f-eec6-4ab0-9a94-c2fe8337876d', TRUE),
('30000000-0000-0000-0000-000000000003', 'Guard', 'A trained militia soldier', 'https://res.cloudinary.com/dr9lh95nh/image/upload/v1777874950/creatures/fc4c61f2-0820-497c-99d5-7d12a3b49107.jpg', 'creatures/fc4c61f2-0820-497c-99d5-7d12a3b49107', TRUE),
('30000000-0000-0000-0000-000000000005', 'Wolf', 'A fast predatory beast', 'https://res.cloudinary.com/dr9lh95nh/image/upload/v1777875003/creatures/e7218bc8-0947-480a-8af1-f7ee46d01c43.jpg', 'creatures/e7218bc8-0947-480a-8af1-f7ee46d01c43', TRUE),
('30000000-0000-0000-0000-000000000006', 'Werewolf', 'A cursed beast-human hybrid', 'https://res.cloudinary.com/dr9lh95nh/image/upload/v1777875056/creatures/d0f3ea9e-5e63-4335-9478-b3104f548032.jpg', 'creatures/d0f3ea9e-5e63-4335-9478-b3104f548032', TRUE),
('30000000-0000-0000-0000-000000000007', 'Bandit', 'A ruthless highway robber', 'https://res.cloudinary.com/dr9lh95nh/image/upload/v1777875108/creatures/dc709011-d1c9-4bc4-867c-00baef6bbb44.jpg', 'creatures/dc709011-d1c9-4bc4-867c-00baef6bbb44', TRUE);


-- =====================================================
-- CREATURE STATS
-- =====================================================

INSERT INTO creature_stats (
    id, creature_id, max_hp, attack, defence, action_point, speed
) VALUES

('40000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 60, 25, 25, 20, 25),
('40000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000002', 42, 16, 14, 14, 16),
('40000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000003', 24, 8, 8, 10, 10),
('40000000-0000-0000-0000-000000000005', '30000000-0000-0000-0000-000000000005', 18, 9, 5, 10, 14),
('40000000-0000-0000-0000-000000000006', '30000000-0000-0000-0000-000000000006', 38, 15, 12, 13, 15),
('40000000-0000-0000-0000-000000000007', '30000000-0000-0000-0000-000000000007', 26, 10, 7, 11, 12);


-- =====================================================
-- CREATURE ACTIONS
-- =====================================================

INSERT INTO creature_actions (creature_id, action_id) VALUES

-- Dragon
('30000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001'),
('30000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000002'),
('30000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000003'),
('30000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000004'),

-- Hero
('30000000-0000-0000-0000-000000000002','20000000-0000-0000-0000-000000000010'),
('30000000-0000-0000-0000-000000000002','20000000-0000-0000-0000-000000000011'),
('30000000-0000-0000-0000-000000000002','20000000-0000-0000-0000-000000000012'),
('30000000-0000-0000-0000-000000000002','20000000-0000-0000-0000-000000000013'),

-- Guard
('30000000-0000-0000-0000-000000000003','20000000-0000-0000-0000-000000000020'),
('30000000-0000-0000-0000-000000000003','20000000-0000-0000-0000-000000000021'),
('30000000-0000-0000-0000-000000000003','20000000-0000-0000-0000-000000000022'),
('30000000-0000-0000-0000-000000000003','20000000-0000-0000-0000-000000000023'),

-- Wolf
('30000000-0000-0000-0000-000000000005','20000000-0000-0000-0000-000000000030'),
('30000000-0000-0000-0000-000000000005','20000000-0000-0000-0000-000000000001'),
('30000000-0000-0000-0000-000000000005','20000000-0000-0000-0000-000000000021'),

-- Werewolf
('30000000-0000-0000-0000-000000000006','20000000-0000-0000-0000-000000000030'),
('30000000-0000-0000-0000-000000000006','20000000-0000-0000-0000-000000000001'),
('30000000-0000-0000-0000-000000000006','20000000-0000-0000-0000-000000000010'),
('30000000-0000-0000-0000-000000000006','20000000-0000-0000-0000-000000000021'),

-- Bandit
('30000000-0000-0000-0000-000000000007','20000000-0000-0000-0000-000000000020'),
('30000000-0000-0000-0000-000000000007','20000000-0000-0000-0000-000000000022'),
('30000000-0000-0000-0000-000000000007','20000000-0000-0000-0000-000000000023');


-- -- =====================================================
-- -- CAMPAIGNS
-- -- =====================================================
INSERT INTO campaign_templates (
    id, name, description, image_url,image_public_key,
    outro_text, outro_image,outro_public_key, status
) VALUES

('50000000-0000-0000-0000-000000000001',
 'Howling Woods',
 'Villagers report strange sightings near the woods, and infants gone missing from their huts.',
 'https://res.cloudinary.com/dr9lh95nh/image/upload/v1777876572/campaigns/55a0ebb4-0bef-446c-af9b-c7dffbe9919f/intro.jpg',
 'campaigns/55a0ebb4-0bef-446c-af9b-c7dffbe9919f/intro',
 'With the threat gone, life slowly returns to normal, though the forest is still avoided after sunset.',
 'https://res.cloudinary.com/dr9lh95nh/image/upload/v1777876574/campaigns/2983db05-c365-4bf9-aa28-fd26d8f1b5b1/outro.jpg',
 'campaigns/2983db05-c365-4bf9-aa28-fd26d8f1b5b1/outro',
 'active'),

('50000000-0000-0000-0000-000000000002',
 'Bandit Lair',
 'Too many of your pack have fallen to the bandits lurking in the woods. You decide enough is enough',
 'https://res.cloudinary.com/dr9lh95nh/image/upload/v1777876608/campaigns/dbbd12ec-0dd7-432f-aed3-83a790bb1a43/intro.jpg',
 'campaigns/dbbd12ec-0dd7-432f-aed3-83a790bb1a43/intro',
 'The bandits are wiped out, their lair wiped out.',
 'https://res.cloudinary.com/dr9lh95nh/image/upload/v1777876609/campaigns/87588f7e-58c2-4d94-be00-6294084d4131/outro.jpg',
 'campaigns/87588f7e-58c2-4d94-be00-6294084d4131/outro',
 'active'),

('50000000-0000-0000-0000-000000000003',
 'Avenge Children',
 'You return to your lair to find your clutch of eggs shattered. Footprints lead toward a nearby human city.',
 'https://res.cloudinary.com/dr9lh95nh/image/upload/v1777876457/campaigns/708f1afd-21ba-4787-8cfa-b899b3ccafa6/intro.jpg',
 'campaigns/708f1afd-21ba-4787-8cfa-b899b3ccafa6/intro',
 'With the defenders vanquished, you reduce the city to ashes. You leave satisfied, knowing fewer humans will infest the world.',
 'https://res.cloudinary.com/dr9lh95nh/image/upload/v1777876458/campaigns/0dd7d3f3-a869-4c65-84cb-d0492d95ebd8/outro.jpg',
 'campaigns/0dd7d3f3-a869-4c65-84cb-d0492d95ebd8/outro',
 'active');

-- =====================================================
-- CAMPAIGN PLAYABLE CREATURES
-- =====================================================

INSERT INTO campaign_playable_creatures VALUES

-- Howling Woods
('50000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000002'), -- Hero
('50000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000003'), -- Guard

-- Bandit Lair
('50000000-0000-0000-0000-000000000002','30000000-0000-0000-0000-000000000005'), -- Wolf
('50000000-0000-0000-0000-000000000002','30000000-0000-0000-0000-000000000006'), -- Werewolf

-- Avenge Children
('50000000-0000-0000-0000-000000000003','30000000-0000-0000-0000-000000000001'); -- Dragon


-- =====================================================
-- CAMPAIGN STAGES
-- =====================================================

INSERT INTO campaign_stages (campaign_template_id, stage_index, enemy_creature_id) VALUES

-- Howling Woods: wolf, wolf, wolf, werewolf
('50000000-0000-0000-0000-000000000001', 0, '30000000-0000-0000-0000-000000000005'),
('50000000-0000-0000-0000-000000000001', 1, '30000000-0000-0000-0000-000000000005'),
('50000000-0000-0000-0000-000000000001', 2, '30000000-0000-0000-0000-000000000005'),
('50000000-0000-0000-0000-000000000001', 3, '30000000-0000-0000-0000-000000000006'),

-- Bandit Lair: bandit x4
('50000000-0000-0000-0000-000000000002', 0, '30000000-0000-0000-0000-000000000007'),
('50000000-0000-0000-0000-000000000002', 1, '30000000-0000-0000-0000-000000000007'),
('50000000-0000-0000-0000-000000000002', 2, '30000000-0000-0000-0000-000000000007'),
('50000000-0000-0000-0000-000000000002', 3, '30000000-0000-0000-0000-000000000007'),

-- Avenge Children: hero, guard, guard, guard
('50000000-0000-0000-0000-000000000003', 0, '30000000-0000-0000-0000-000000000002'),
('50000000-0000-0000-0000-000000000003', 1, '30000000-0000-0000-0000-000000000003'),
('50000000-0000-0000-0000-000000000003', 2, '30000000-0000-0000-0000-000000000003'),
('50000000-0000-0000-0000-000000000003', 3, '30000000-0000-0000-0000-000000000003');