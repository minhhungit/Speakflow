# SpeakFlow — AI Speaking Coach (mini)

Luyện nói tiếng Anh bằng cách **mở rộng câu từng bước** theo hai framework **5W1H** và **PREP**.
Mỗi đoạn (phrase) được gạch chân **dotted theo màu của đoạn** để dễ phân biệt từng phần khi câu dài dần;
đoạn đang đọc nổi bật bằng màu nhấn. Có **tìm kiếm bài học**, **nhóm theo lĩnh vực nghề nghiệp**,
**theme sáng/tối**, và **auto-play** đọc cả câu.

## Files
- `index.html` — ứng dụng (mở trực tiếp trong trình duyệt).
- `lessons.db` — database SQLite chứa toàn bộ bài học (app nạp trực tiếp file này).
- `data/lessons.json` — nguồn dữ liệu bài học (source of truth để sinh DB).
- `db/schema.sql` — định nghĩa bảng SQLite (`lesson`, `phrase`).
- `db/seed.mjs` — script Node sinh `lessons.db` từ `data/lessons.json`.
- `package.json` — khai báo phụ thuộc `better-sqlite3`.

## Cách dùng nhanh
Mở `index.html` qua một server tĩnh. App `fetch('lessons.db')`, nạp bằng sql.js
và truy vấn bảng `lesson` / `phrase` để hiển thị (badge xanh `● lessons.db`).
Nếu không fetch được file (vd mở bằng `file://`), app tự dựng DB SQLite in-memory từ
dữ liệu seed, rồi cuối cùng mới fallback sang JS.

```bash
npx serve            # rồi mở http://localhost:3000/SpeakFlow.dc.html
```

## Sinh lessons.db bằng Node (tuỳ chọn)
```bash
npm install
npm run seed         # -> tạo lessons.db ở thư mục gốc từ data/lessons.json
```

## Schema
```
lesson(id, field, framework, icon, title, title_vi, ord)
phrase(id, lesson_id, ord, label, label_vi, color, text, vi)
```
`field` = lĩnh vực nghề nghiệp: `dev` | `business` | `healthcare` | `education`
(app hiển thị icon + tên cho mỗi nhóm). Mỗi nhóm chỉ hiển thị tối đa 24 thẻ —
dùng ô tìm kiếm để lọc tới bài cần luyện.

## Thêm lesson mới
1. Thêm một object vào `data/lessons.json` (format: `field`, `fw`, `icon`, `title`, `titleVi`, `steps[]`).
2. Chạy lại `npm run seed` để cập nhật `lessons.db`.
3. (Để app dùng ngay khi không có server) thêm tương ứng vào mảng `LESSONS` trong `SpeakFlow.dc.html`.

## Phát âm
- App đọc cả câu hiện tại bằng Web Speech API (giọng `en-US`).
- **Auto-play**: tự đọc lại toàn bộ câu mỗi lần mở rộng (có nút bật/tắt).
