CREATE TABLE IF NOT EXISTS migrations (
  id INTEGER NOT NULL PRIMARY KEY,
  created TIMESTAMPTZ DEFAULT NOW()
);