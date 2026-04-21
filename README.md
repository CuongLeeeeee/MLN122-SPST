# Bảo tàng lịch sử

Một chuyến tham quan bảo tàng lịch sử theo phong cách game 2D. Bạn sẽ đi dạo qua các phòng trưng bày, dừng lại trước những hiện vật nổi bật, đọc thông tin tóm tắt và trả lời câu hỏi để mở khóa khu vực tiếp theo. Mỗi lần hoàn thành quiz, game ghi lại tổng thời gian và số lần thử để tạo nên “điểm tham quan” cuối cùng.

## Trải nghiệm dành cho người chơi
- **Khám phá theo tuyến**: di chuyển qua nhiều phòng, mỗi phòng có nội dung trưng bày riêng.
- **Tương tác hiện vật**: nhấn phím tương tác để xem nội dung chi tiết dưới dạng flipbook/khung ảnh.
- **Làm quiz ngắn**: trả lời câu hỏi để tiếp tục hành trình; điểm số dựa trên thời gian và số lần thử.
- **Lưu tiến trình tự động**: có thể quay lại chơi tiếp mà không mất dữ liệu.
- **Chia sẻ kết quả**: điểm có thể được ghi lên Google Sheets (tuỳ cấu hình).

## Điểm nổi bật
- Bản đồ liên hoàn với cửa chuyển khu.
- Quiz nhiều câu, có tổng hợp thời gian và số lần thử.
- Nội dung trưng bày trực quan qua flipbook/khung ảnh.
- Trang báo cáo liêm chính học thuật tại `/academic-integrity`.

## Công nghệ
- Next.js App Router, React, TypeScript
- Canvas 2D game loop
- Google Sheets (Apps Script Webhook hoặc Sheets API)

## Điều khiển
- Di chuyển: WASD hoặc Arrow Keys
- Tương tác: E
- Tạm dừng: Esc

## Cấu trúc thư mục (rút gọn)
- [src/app](src/app): routes và layout
- [src/components](src/components): UI, modal, overlay
- [src/game](src/game): engine, input, map, player, save, VFX
- [src/data](src/data): câu hỏi quiz và flipbook data
- [public/assets](public/assets): hình nền/map assets

## Cài đặt & chạy local
```bash
npm install
npm run dev
```

Mở http://localhost:3000

## Scripts
- `npm run dev` – chạy môi trường dev
- `npm run build` – build production
- `npm run start` – chạy bản build
- `npm run lint` – kiểm tra lint

## Gửi điểm lên Google Sheets
Khi hoàn thành game, hệ thống sẽ gửi điểm qua `POST /api/score`. API sẽ:
1) Ưu tiên gửi trực tiếp qua Sheets API nếu đủ biến môi trường.
2) Nếu không đủ, sẽ fallback sang webhook Apps Script.
3) Nếu không cấu hình gì, API trả 204 (best-effort).

### Payload gửi từ game
```json
{
  "kind": "score",
  "playerName": "...",
  "totalTimeMs": 123456,
  "attempts": 3,
  "at": "2026-01-17T12:34:56.000Z"
}
```

### Cách 1: Apps Script Webhook
Thiết lập nhanh theo hướng dẫn tại [HUONG_DAN_GOOGLE_SHEET.md](HUONG_DAN_GOOGLE_SHEET.md).

Tạo file [.env.local](.env.local) ở root và thêm:
```
SHEETS_ENDPOINT=https://script.google.com/macros/s/<DEPLOYMENT_ID>/exec
```

Tuỳ chọn ẩn dòng nhắc trong UI endgame:
```
NEXT_PUBLIC_SHEETS_ENDPOINT=1
```

### Cách 2: Google Sheets API (Service Account)
Thiết lập chi tiết tại [HUONG_DAN_GOOGLE_SHEETS_SERVICE_ACCOUNT.md](HUONG_DAN_GOOGLE_SHEETS_SERVICE_ACCOUNT.md).

Trong file [.env.local](.env.local):
```
GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id
GOOGLE_SHEETS_SHEET_NAME=Scores
GOOGLE_SHEETS_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

## Tài liệu bổ sung
- [SETUP_GUIDE.md](SETUP_GUIDE.md)
- [HUONG_DAN_GOOGLE_SHEET.md](HUONG_DAN_GOOGLE_SHEET.md)
- [HUONG_DAN_GOOGLE_SHEETS_SERVICE_ACCOUNT.md](HUONG_DAN_GOOGLE_SHEETS_SERVICE_ACCOUNT.md)
