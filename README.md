# SpeakFlow — English Speaking Coach

Luyện nói tiếng Anh bằng cách **mở rộng câu từng bước** theo hai framework **5W1H** và **PREP**.  
2 000 bài học · 4 lĩnh vực · tìm kiếm · theme sáng/tối · auto-play · tra từ điển AI · lưu từ vựng.

<img width="1381" height="1225" alt="image" src="https://github.com/user-attachments/assets/3191af04-9242-4c34-9387-dc642365944f" />

## Cách dùng nhanh

Mở thẳng `index.html` trong trình duyệt — không cần server.  
App đọc dữ liệu từ `lessons.js` (đã sinh sẵn, hoạt động với `file://`).

## Files

| File | Mô tả |
|------|-------|
| `index.html` | Toàn bộ ứng dụng |
| `lessons.js` | 2 000 bài học sinh từ `lessons.db` — tải qua `<script>`, không cần fetch |
| `lessons.db` | SQLite source (dùng khi deploy qua HTTP / GitHub Pages) |
| `data/lessons.json` | Nguồn dữ liệu gốc (source of truth) |
| `db/schema.sql` | Schema SQLite |
| `db/seed.mjs` | Script Node sinh `lessons.db` từ `data/lessons.json` |

## Thứ tự nạp dữ liệu

```
lessons.js  →  lessons.db (fetch, HTTP only)  →  12-lesson seed (last resort)
```

- **`lessons.js`** — ưu tiên 1, hoạt động khi mở file:// hoặc deploy HTTP
- **`lessons.db`** — ưu tiên 2, chỉ dùng khi không có lessons.js (HTTP/HTTPS only)
- **12-lesson seed** — fallback cuối, chỉ có 12 bài cứng trong code

## Cập nhật dữ liệu

Khi thêm/sửa bài học trong `data/lessons.json`:

```bash
# 1. Sinh lại lessons.db
npm install
npm run seed

# 2. Sinh lại lessons.js từ lessons.db
python3 -c "
import sqlite3, json
conn = sqlite3.connect('lessons.db')
conn.row_factory = sqlite3.Row
lessons = conn.execute('SELECT id,field,framework,icon,title,title_vi FROM lesson ORDER BY ord').fetchall()
phrases = {}
for r in conn.execute('SELECT lesson_id,label,label_vi,color,text,vi FROM phrase ORDER BY lesson_id,ord'):
    phrases.setdefault(r['lesson_id'], []).append({'label':r['label'],'labelVi':r['label_vi'],'color':r['color'],'text':r['text'],'vi':r['vi']})
out = [{'id':l['id'],'field':l['field'],'fw':l['framework'],'icon':l['icon'],'title':l['title'],'titleVi':l['title_vi'],'steps':phrases.get(l['id'],[])} for l in lessons]
conn.close()
open('lessons.js','w',encoding='utf-8').write('// Auto-generated from lessons.db — do not edit manually\nwindow.DB_LESSONS = ' + json.dumps(out,ensure_ascii=False,separators=(',',':')) + ';\n')
print(f'Done: {len(out)} lessons')
"
```

## Schema

```
lesson(id, field, framework, icon, title, title_vi, ord)
phrase(id, lesson_id, ord, label, label_vi, color, text, vi)
```

`field`: `dev` | `business` | `healthcare` | `education`

## Phát âm & Tra từ

- **Auto-play**: tự đọc câu mỗi lần mở rộng (Web Speech API, giọng `en-US`)
- **Tra từ**: click vào từ bất kỳ → AI tra IPA + nghĩa tiếng Việt + định nghĩa (cần cấu hình LLM ở ⚙)
- **Lưu từ vựng**: nhấn 🔖 khi đang tra → lưu vào localStorage
