-- Legacy XPlanner demo seed: rebuild "Acme Web Store" (3 sprints) mirroring the new app.
-- Ids in the 5000+ block (TableHiLo app allocation is ~300, never reaches this during demos).
-- All names ASCII to avoid the mojibake seen in earlier web-form seeding.
SET NAMES utf8;
-- The demo person this seed attaches everything to. It used to be looked up
-- and never created, so on a database that had not already had 'alex' made by
-- hand the lookup returned NULL and line 33 died with "Column 'person_id'
-- cannot be null", leaving the fixture half-applied: the project row inserted
-- and no iteration, story, task or time entry. Found at Stage 3 by deploying a
-- clean isolated instance, where Liquibase seeds exactly one person, sysadmin.
-- Created idempotently here so the seed is reproducible on an empty database.
INSERT INTO person (id, last_update, name, email, initials, userId, password, is_hidden)
  SELECT 5100, NOW(), 'Alex Doe', 'alex@example.invalid', 'AD', 'alex', NULL, 0
  FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM person WHERE userId = 'alex');
SET @alex := (SELECT id FROM person WHERE userId = 'alex');
SET @sys := 1;
SET @editor := (SELECT id FROM roles WHERE role = 'editor');

-- ---- wipe existing projects + children (keep people & roles) ----
DELETE FROM datasample;
DELETE FROM time_entry;
DELETE FROM task;
DELETE FROM story;
DELETE FROM note;
DELETE FROM iteration;
DELETE FROM person_role WHERE project_id <> 0;
-- db-changelog.xml declares two foreign keys onto project.id: iteration.project_id
-- (FK8904EEDD8A94A401) and notification_receivers.project_id (FK90D2EE108A94A401).
-- Only the first was cleared, so DELETE FROM project fails on any database where a
-- project has a notification receiver -- exactly what the project editor creates --
-- and leaves the fixture half-deleted. Found at Stage 2 pass 020.
DELETE FROM notification_receivers;
-- These three reference deleted objects by id but carry no foreign key, so the
-- delete succeeds and leaves orphans behind. Cleared so a reseed is repeatable.
DELETE FROM history;
DELETE FROM attribute;
DELETE FROM integration;
DELETE FROM project;

-- ---- project ----
INSERT INTO project (id, last_update, name, description, is_hidden, backlog_id) VALUES
 (5000, NOW(), 'Acme Web Store', 'Demo project: e-commerce store rebuild (checkout, search, user accounts).', 0, NULL);
INSERT INTO person_role (person_id, role_id, project_id) VALUES (@alex, @editor, 5000);

-- ---- iterations: S1 closed(inactive,past), S2 active, S3 future(inactive) ----
INSERT INTO iteration (id, last_update, project_id, name, description, start_date, end_date, status, days_worked) VALUES
 (5001, NOW(), 5000, 'Sprint 1', NULL, DATE_SUB(CURDATE(), INTERVAL 35 DAY), DATE_SUB(CURDATE(), INTERVAL 21 DAY), 1, 10),
 (5002, NOW(), 5000, 'Sprint 2', NULL, DATE_SUB(CURDATE(), INTERVAL 7 DAY),  DATE_ADD(CURDATE(), INTERVAL 7 DAY),  0, 5),
 (5003, NOW(), 5000, 'Sprint 3', NULL, DATE_ADD(CURDATE(), INTERVAL 14 DAY), DATE_ADD(CURDATE(), INTERVAL 28 DAY), 1, 10);

-- ---- stories (status d=draft, disposition p=planned; codes proven valid) ----
INSERT INTO story (id, last_update, name, description, iteration_id, tracker_id, estimated_hours, priority, customer_id, status, original_estimated_hours, disposition, postponed_hours, it_start_estimated_hours, orderNo) VALUES
 (5010, NOW(), 'Project setup',   NULL, 5001, @alex, 9,  4, @sys, 'd', 9,  'p', 0, 9,  1),
 (5011, NOW(), 'Checkout flow',   NULL, 5002, @alex, 16, 1, @sys, 'd', 16, 'p', 0, 16, 1),
 (5012, NOW(), 'Product search',  NULL, 5002, @alex, 10, 2, @sys, 'd', 10, 'p', 0, 10, 2),
 (5013, NOW(), 'User accounts',   NULL, 5002, @alex, 7,  3, @sys, 'd', 7,  'p', 0, 7,  3),
 (5014, NOW(), 'Recommendations', NULL, 5003, @alex, 13, 3, @sys, 'd', 13, 'p', 0, 13, 1);

-- ---- tasks ----
INSERT INTO task (id, last_update, name, type, description, acceptor_id, created_date, estimated_hours, original_estimate, is_complete, story_id, disposition) VALUES
 (5020, NOW(), 'CI pipeline',                  'Overhead', NULL, @alex, DATE_SUB(CURDATE(), INTERVAL 34 DAY), 5, 5, 1, 5010, 'p'),
 (5021, NOW(), 'Dev environment',              'Feature',  NULL, @sys,  DATE_SUB(CURDATE(), INTERVAL 33 DAY), 4, 4, 1, 5010, 'p'),
 (5022, NOW(), 'Payment gateway integration', 'Feature',  NULL, @alex, DATE_SUB(CURDATE(), INTERVAL 6 DAY),  8, 8, 0, 5011, 'p'),
 (5023, NOW(), 'Order confirmation email',     'Feature',  NULL, @sys,  DATE_SUB(CURDATE(), INTERVAL 6 DAY),  5, 5, 1, 5011, 'p'),
 (5024, NOW(), 'Cart validation',              'FTest',    NULL, @alex, DATE_SUB(CURDATE(), INTERVAL 5 DAY),  3, 3, 0, 5011, 'p'),
 (5025, NOW(), 'Search indexing',              'Feature',  NULL, @alex, DATE_SUB(CURDATE(), INTERVAL 5 DAY),  6, 6, 0, 5012, 'p'),
 (5026, NOW(), 'Search UI',                    'Feature',  NULL, @sys,  DATE_SUB(CURDATE(), INTERVAL 4 DAY),  4, 4, 0, 5012, 'p'),
 (5027, NOW(), 'Login page',                   'Feature',  NULL, @sys,  DATE_SUB(CURDATE(), INTERVAL 6 DAY),  4, 4, 1, 5013, 'p'),
 (5028, NOW(), 'Password reset',               'Defect',   NULL, @alex, DATE_SUB(CURDATE(), INTERVAL 3 DAY),  3, 3, 0, 5013, 'p'),
 (5029, NOW(), 'Model prototype',              'Feature',  NULL, @alex, DATE_ADD(CURDATE(), INTERVAL 14 DAY), 8, 8, 0, 5014, 'p'),
 (5030, NOW(), 'A/B test harness',             'Feature',  NULL, @sys,  DATE_ADD(CURDATE(), INTERVAL 14 DAY), 5, 5, 0, 5014, 'p');

-- ---- time entries (Sprint 2 progress) ----
INSERT INTO time_entry (id, last_update, start_time, end_time, duration, person1_id, person2_id, task_id, report_date, description) VALUES
 (5040, NOW(), NULL, NULL, 3, @alex, 0, 5022, DATE_SUB(CURDATE(), INTERVAL 6 DAY), 'stripe sandbox'),
 (5041, NOW(), NULL, NULL, 3, @alex, @sys, 5022, DATE_SUB(CURDATE(), INTERVAL 4 DAY), 'webhooks (paired)'),
 (5042, NOW(), NULL, NULL, 5, @sys,  0, 5023, DATE_SUB(CURDATE(), INTERVAL 5 DAY), 'smtp + template'),
 (5043, NOW(), NULL, NULL, 4, @sys,  0, 5027, DATE_SUB(CURDATE(), INTERVAL 6 DAY), 'login form'),
 (5044, NOW(), NULL, NULL, 2, @alex, 0, 5025, DATE_SUB(CURDATE(), INTERVAL 3 DAY), 'lucene spike'),
 (5045, NOW(), NULL, NULL, 1, @alex, 0, 5024, DATE_SUB(CURDATE(), INTERVAL 2 DAY), 'edge cases');

-- ---- datasample: burndown/progress series the legacy charts plot ----
-- Sprint 1 (closed): full burndown to zero.
INSERT INTO datasample (sampleTime, referenceId, aspect, value) VALUES
 (DATE_SUB(CURDATE(), INTERVAL 34 DAY), 5001, 'estimatedHours', 9), (DATE_SUB(CURDATE(), INTERVAL 34 DAY), 5001, 'remainingHours', 9), (DATE_SUB(CURDATE(), INTERVAL 34 DAY), 5001, 'actualHours', 0),
 (DATE_SUB(CURDATE(), INTERVAL 30 DAY), 5001, 'estimatedHours', 9), (DATE_SUB(CURDATE(), INTERVAL 30 DAY), 5001, 'remainingHours', 5), (DATE_SUB(CURDATE(), INTERVAL 30 DAY), 5001, 'actualHours', 4),
 (DATE_SUB(CURDATE(), INTERVAL 26 DAY), 5001, 'estimatedHours', 9), (DATE_SUB(CURDATE(), INTERVAL 26 DAY), 5001, 'remainingHours', 2), (DATE_SUB(CURDATE(), INTERVAL 26 DAY), 5001, 'actualHours', 7),
 (DATE_SUB(CURDATE(), INTERVAL 22 DAY), 5001, 'estimatedHours', 9), (DATE_SUB(CURDATE(), INTERVAL 22 DAY), 5001, 'remainingHours', 0), (DATE_SUB(CURDATE(), INTERVAL 22 DAY), 5001, 'actualHours', 9);
-- Sprint 2 (active): declining remaining, rising actual, flat estimate (33 total).
INSERT INTO datasample (sampleTime, referenceId, aspect, value) VALUES
 (DATE_SUB(CURDATE(), INTERVAL 7 DAY), 5002, 'estimatedHours', 33), (DATE_SUB(CURDATE(), INTERVAL 7 DAY), 5002, 'remainingHours', 33), (DATE_SUB(CURDATE(), INTERVAL 7 DAY), 5002, 'actualHours', 0),
 (DATE_SUB(CURDATE(), INTERVAL 6 DAY), 5002, 'estimatedHours', 33), (DATE_SUB(CURDATE(), INTERVAL 6 DAY), 5002, 'remainingHours', 29), (DATE_SUB(CURDATE(), INTERVAL 6 DAY), 5002, 'actualHours', 7),
 (DATE_SUB(CURDATE(), INTERVAL 5 DAY), 5002, 'estimatedHours', 33), (DATE_SUB(CURDATE(), INTERVAL 5 DAY), 5002, 'remainingHours', 24), (DATE_SUB(CURDATE(), INTERVAL 5 DAY), 5002, 'actualHours', 12),
 (DATE_SUB(CURDATE(), INTERVAL 4 DAY), 5002, 'estimatedHours', 33), (DATE_SUB(CURDATE(), INTERVAL 4 DAY), 5002, 'remainingHours', 19), (DATE_SUB(CURDATE(), INTERVAL 4 DAY), 5002, 'actualHours', 16),
 (DATE_SUB(CURDATE(), INTERVAL 3 DAY), 5002, 'estimatedHours', 33), (DATE_SUB(CURDATE(), INTERVAL 3 DAY), 5002, 'remainingHours', 14), (DATE_SUB(CURDATE(), INTERVAL 3 DAY), 5002, 'actualHours', 20),
 (DATE_SUB(CURDATE(), INTERVAL 2 DAY), 5002, 'estimatedHours', 33), (DATE_SUB(CURDATE(), INTERVAL 2 DAY), 5002, 'remainingHours', 10), (DATE_SUB(CURDATE(), INTERVAL 2 DAY), 5002, 'actualHours', 24),
 (DATE_SUB(CURDATE(), INTERVAL 1 DAY), 5002, 'estimatedHours', 33), (DATE_SUB(CURDATE(), INTERVAL 1 DAY), 5002, 'remainingHours', 7),  (DATE_SUB(CURDATE(), INTERVAL 1 DAY), 5002, 'actualHours', 28);

SELECT 'projects' t, COUNT(*) n FROM project
 UNION ALL SELECT 'iterations', COUNT(*) FROM iteration
 UNION ALL SELECT 'stories', COUNT(*) FROM story
 UNION ALL SELECT 'tasks', COUNT(*) FROM task
 UNION ALL SELECT 'time_entries', COUNT(*) FROM time_entry
 UNION ALL SELECT 'datasamples', COUNT(*) FROM datasample;

-- NOTE: after running, set any NULL time_entry.person2_id to 0 (legacy maps it to a primitive int):
--   UPDATE time_entry SET person2_id=0 WHERE person2_id IS NULL;
-- (this file already uses 0, kept as a reminder).
