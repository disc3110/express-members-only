BEGIN;

-- case-insensitive text for usernames/emails
CREATE EXTENSION IF NOT EXISTS citext;

DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id                BIGSERIAL PRIMARY KEY,
  username          CITEXT NOT NULL UNIQUE,
  first_name        TEXT NOT NULL,
  last_name         TEXT NOT NULL,
  email             CITEXT NOT NULL UNIQUE,
  password_hash     TEXT NOT NULL,
  membership_status BOOLEAN NOT NULL DEFAULT FALSE,
  is_admin          BOOLEAN NOT NULL DEFAULT FALSE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE messages (
  id          BIGSERIAL PRIMARY KEY,
  user_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  title       TEXT NOT NULL,
  body        TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE comments (
  id          BIGSERIAL PRIMARY KEY,
  message_id  BIGINT NOT NULL REFERENCES messages(id) ON DELETE RESTRICT,
  user_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  body        TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Helpful indexes for lookups
CREATE INDEX idx_messages_user_id ON messages(user_id);
CREATE INDEX idx_comments_message_id ON comments(message_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);

-- Auto-update messages.updated_at on UPDATE
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_messages_updated_at
BEFORE UPDATE ON messages
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

COMMIT;