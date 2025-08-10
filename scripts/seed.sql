INSERT INTO organizations(id, name) VALUES(gen_random_uuid(), 'CliniGlobal') RETURNING id; -- capture this id manually if running raw
-- For Docker init, we will add default roles
INSERT INTO roles(name) VALUES ('admin') ON CONFLICT DO NOTHING;
INSERT INTO roles(name) VALUES ('sales') ON CONFLICT DO NOTHING;
INSERT INTO roles(name) VALUES ('support') ON CONFLICT DO NOTHING;
INSERT INTO roles(name) VALUES ('marketing') ON CONFLICT DO NOTHING;