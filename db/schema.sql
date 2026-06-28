-- SpeakFlow database schema
CREATE TABLE IF NOT EXISTS lesson (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  field      TEXT    NOT NULL,          -- career field: 'dev' | 'business' | 'healthcare' | 'education'
  framework  TEXT    NOT NULL,          -- '5W1H' | 'PREP'
  icon       TEXT,
  title      TEXT    NOT NULL,
  title_vi   TEXT,
  ord        INTEGER NOT NULL           -- display order
);

CREATE TABLE IF NOT EXISTS phrase (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  lesson_id  INTEGER NOT NULL REFERENCES lesson(id),
  ord        INTEGER NOT NULL,          -- expansion step order
  label      TEXT    NOT NULL,          -- WHO/WHAT/... or POINT/REASON/...
  label_vi   TEXT,
  color      TEXT,                      -- hex accent for the block
  text       TEXT    NOT NULL,          -- the English phrase chunk
  vi         TEXT                       -- Vietnamese gloss
);

CREATE INDEX IF NOT EXISTS idx_phrase_lesson ON phrase(lesson_id, ord);
