// SpeakFlow seed script — builds lessons.db from data/lessons.json
// Usage:
//   npm install better-sqlite3
//   node db/seed.mjs
import Database from 'better-sqlite3';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dir = dirname(fileURLToPath(import.meta.url));
const schema  = readFileSync(join(__dir, 'schema.sql'), 'utf8');
const lessons = JSON.parse(readFileSync(join(__dir, '..', 'data', 'lessons.json'), 'utf8'));

const db = new Database(join(__dir, '..', 'lessons.db'));
db.pragma('journal_mode = WAL');
db.exec('DROP TABLE IF EXISTS phrase; DROP TABLE IF EXISTS lesson;');
db.exec(schema);

const insLesson = db.prepare(
  'INSERT INTO lesson (field, framework, icon, title, title_vi, ord) VALUES (?, ?, ?, ?, ?, ?)'
);
const insPhrase = db.prepare(
  'INSERT INTO phrase (lesson_id, ord, label, label_vi, color, text, vi) VALUES (?, ?, ?, ?, ?, ?, ?)'
);

const seedAll = db.transaction((data) => {
  data.forEach((ls, li) => {
    const { lastInsertRowid } = insLesson.run(ls.field, ls.fw, ls.icon, ls.title, ls.titleVi, li);
    ls.steps.forEach((st, si) =>
      insPhrase.run(lastInsertRowid, si, st.label, st.labelVi, st.color, st.text, st.vi)
    );
  });
});
seedAll(lessons);

const lc = db.prepare('SELECT COUNT(*) c FROM lesson').get().c;
const pc = db.prepare('SELECT COUNT(*) c FROM phrase').get().c;
console.log(`Seeded ${lc} lessons and ${pc} phrases -> lessons.db`);
db.close();
