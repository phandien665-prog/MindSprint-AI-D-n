# Kết quả kiểm thử Issue #15 — Thay thế mẫu từ vựng bằng dataset Kaggle

## Thông tin chung
- **Issue:** #15 — Thay thế mẫu từ vựng bằng dataset Kaggle
- **Chủ trì:** tuanlinh0511
- **Mô phôi (Sprint):** Sprint 3
- **Ưu tiên:** P1

## Baseline
- **Commit:** `267072d` (main)
- **Cấu hình:** ASP.NET Core 8.0.8, EF Core 8.0.8, PostgreSQL, Node.js v24.21.0
- **Fixture:** vocab_seed.json (1.021 bản ghi), generate-seed-data.js

## Tóm tắt kết quả

| Tiêu chí | Kỳ vọng | Thực tế | Kết luận |
|----------|---------|---------|----------|
| ExternalId ổn định | ID không đổi khi tái tạo seed | Đạt (MD5 hash của `category:question`) | Pass |
| --from-kaggle flag | Script đọc tham số và file nguồn Kaggle | Đạt (triển khai loadKaggleSource, convertKaggleToVocab) | Pass |
| Đánh đúng nghĩa | Acrobatic → nhào lộn, Bay → sủa | Đã sửa trong generate-seed-data.js và vocab_seed.json | Pass |
| Thẻ hệ thống được đối soát | Thẻ cũ không trong seed mới bị réforme, thẻ cá nhân được bảo toàn | DataSeeder retire old cards (OwnerId=-1 nếu có progress, xóa nếu không) | Pass |
| Không nhân đôi thẻ | Upsert by ExternalId, chạy lại không tạo trùng | Đã kiểm thử trên SQLite (1.021 bản ghi) | Pass |

## Chi tiết từng tiêu chí

### 1. ExternalId ổn định (P1)
**Kịch bản:** Sinh vocab_seed.json hai lần, kiểm tra ExternalId của cùng một từ có giống nhau hay không.

**Kết quả:**
- Sử dụng `generateExternalId(category, question)` với MD5 hash: `v2-<md5(category:question)[:12]>`
- ID không phụ thuộc vào thứ tự hoặc vị trí trong mảng
- Không còn hiện tượng "thẻ SDK đổi thành npm" như trước

**Byron:** `backend/MindSprint.Api/Data/generate-seed-data.js`, `backend/MindSprint.Api/Data/vocab_seed.json`

### 2. --from-kaggle flag (P1)
**Kịch bản:** Chạy `node generate-seed-data.js --from-kaggle`, kiểm tra script đọc file `kaggle_source.json` và chuyển đổi dataset.

**Kết quả:**
- Script parse tham số `--from-kaggle` từ `process.argv`
- `loadKaggleSource()` đọc file `kaggle_source.json`
- `convertKaggleToVocab()` chuyển đổi định dạng Kaggle sang định dạng vocab của ứng dụng
- Hướng dẫn trong comment ghi rõ URL, version, license của Kaggle dataset

**Byron:** `backend/MindSprint.Api/Data/generate-seed-data.js` (phần header comment và hàm mới)

### 3. Đánh đúng nghĩa (P2)
**Kịch bản:** Kiểm tra các từ có nghĩa sai trước đây.

**Kết quả:**
- `Acrobatic`: đổi từ "Xiêu lép" → "Nhào lộn, phiêu lưu" (liên quan đến nhào lộn/phơi lưu)
- `Bay`: đổi từ "Bay" → "Sủa (con chó)" (động từ - hành為 của chó)
- Đã cập nhật trong cả `generate-seed-data.js` và `vocab_seed.json`

**Byron:** `backend/MindSprint.Api/Data/generate-seed-data.js` (lines chứa Acrobatic, Bay), `vocab_seed.json`

### 4. Thẻ hệ thống được đối soát (P2)
**Kịch bản:** Chạy DataSeeder trên DB đã có 1.814 thẻ Oxford, kiểm tra sau khi seed có 2.835 hay ít hơn.

**Kết quả:**
- DataSeeder retire old system cards không có trong new seed:
  - Nếu thẻ cũ có `CardProgress` → set `OwnerId = -1` (ẩn khỏi UI, bảo toàn lịch sử)
  - Nếu thẻ cũ không có `CardProgress` → xóa hoàn toàn
- Thẻ cá nhân (`OwnerId != null`) và lịch sử học (`CardProgress`) được bảo toàn
- FlashcardsController và ReviewController lọc bỏ `OwnerId == -1`

**Byron:** `backend/MindSprint.Api/Data/DataSeeder.cs`, `FlashcardsController.cs`, `ReviewController.cs`

### 5. Không nhân đôi thẻ (P2)
**Kịch bản:** Chạy DataSeeder hai lần liên tiếp, kiểm tra số lượng thẻ hệ thống.

**Kết quả:**
- Lần đầu: thêm 1.021 thẻ hệ thống mới
- Lần hai: upsert by ExternalId, cập nhật nội dung thẻ cũ, không tạo trùng
- Kiểm thử trên SQLite tạm nhập đủ 1.021 bản ghi, chạy lại không nhân đôi

**Byron:** `backend/MindSprint.Api/Data/DataSeeder.cs`

## Thay đổi mã nguồn

| File | Thay đổi |
|------|----------|
| `backend/MindSprint.Api/Data/generate-seed-data.js` | Stable ExternalId (MD5 hash), --from-kaggle implementation, fix translations |
| `backend/MindSprint.Api/Data/vocab_seed.json` | Regenerated với 1.021 entries, v2- hash IDs, correct translations |
| `backend/MindSprint.Api/Data/DataSeeder.cs` | Retire old Oxford cards, upsert by ExternalId, preserve personal cards |
| `backend/MindSprint.Api/Controllers/FlashcardsController.cs` | Exclude retired cards (OwnerId == -1) |
| `backend/MindSprint.Api/Controllers/ReviewController.cs` | Exclude retired cards (OwnerId == -1) |

## Kết luận
**Pass** — Tất cả 5 tiêu chí của Issue #15 đã đạt.

**Người chạy:** tuanlinh0511  
**Thời gian:** Asia/Saigon  
**Theo dõi:** Không có bug liên kết