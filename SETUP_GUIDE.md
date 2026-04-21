### Nguyên nhân gốc rễ

Vấn đề cốt lõi là do **thiếu cấu hình phía người dùng**, không phải lỗi trong mã nguồn. Kiến trúc của ứng dụng được thiết kế để gửi điểm số đến một dịch vụ trung gian (webhook), và URL của dịch vụ này phải được cung cấp thông qua một biến môi trường tên là `SHEETS_ENDPOINT`.

Khi người dùng hoàn thành một bài quiz, luồng hoạt động như sau:
1.  `GamePage.tsx` gọi hàm `postScore` để gửi dữ liệu điểm đến API nội bộ: `/api/score`.
2.  API route tại `src/app/api/score/route.ts` nhận yêu cầu này.
3.  Route này cố gắng đọc biến môi trường `SHEETS_ENDPOINT`.
4.  **Nếu biến này không tồn tại**, route sẽ không làm gì cả và trả về mã trạng thái thành công (204). Điều này tạo cảm giác rằng việc gửi điểm đã thành công, nhưng thực tế dữ liệu đã bị loại bỏ.
5.  **Nếu biến này tồn tại**, route sẽ chuyển tiếp dữ liệu điểm đến URL được cung cấp.

Do đó, điểm không được gửi lên Google Sheet vì ứng dụng không biết địa chỉ webhook để gửi tới.

### Hướng dẫn chi tiết cách setup để gửi điểm lên Google Sheet

Để khắc phục, bạn cần tạo một Google Apps Script Web App và kết nối nó với dự án Next.js.

**Bước 1: Tạo Google Sheet**
1.  Truy cập [sheets.google.com](https://sheets.google.com) và tạo một trang tính mới.
2.  Đặt tên cho nó, ví dụ: "Bao Tang Lich Su - Scores".
3.  Tạo các cột tiêu đề ở hàng đầu tiên, ví dụ: `timestamp`, `playerName`, `kind`, `timeMs`, `attempts`.

**Bước 2: Tạo Google Apps Script**
1.  Trong Google Sheet vừa tạo, vào `Tiện ích mở rộng` (Extensions) > `Apps Script`.
2.  Xóa toàn bộ mã mặc định trong file `Code.gs` và thay thế bằng đoạn mã sau:

```javascript
// ID của bảng tính bạn đang dùng.
const SHEET_ID = "ID_CUA_SHEET"; 
// Tên của trang tính (sheet tab) bạn muốn ghi dữ liệu vào.
const SHEET_NAME = "Sheet1"; 

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    const data = JSON.parse(e.postData.contents);

    // Dựa trên dữ liệu gửi từ GamePage.tsx
    const timestamp = data.at || new Date().toISOString();
    const playerName = data.playerName || "Không tên";
    const kind = data.kind || "unknown";
    let timeMs = 0;
    let attempts = 0;

    if (kind === 'main') {
      timeMs = data.mainTotalTimeMs || 0;
      attempts = data.mainAttempts || 0;
    } else if (kind === 'side') {
      timeMs = data.sideTotalTimeMs || 0;
      attempts = data.sideAttempts || 0;
    }

    // Ghi dữ liệu vào hàng mới
    sheet.appendRow([timestamp, playerName, kind, timeMs, attempts]);

    return ContentService.createTextOutput(JSON.stringify({ "status": "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3.  **Quan trọng:** Thay thế `ID_CUA_SHEET` bằng ID của Google Sheet của bạn. Bạn có thể lấy ID từ URL của sheet (ví dụ: `https://docs.google.com/spreadsheets/d/SHEET_ID_NAM_O_DAY/edit`). Nếu bạn đã đổi tên tab, hãy cập nhật `SHEET_NAME`.

**Bước 3: Triển khai (Deploy) Web App**
1.  Nhấn vào nút **`Triển khai` (Deploy)** ở góc trên bên phải, sau đó chọn **`Lần triển khai mới` (New deployment)**.
2.  Nhấn vào biểu tượng bánh răng (⚙️) bên cạnh "Chọn loại" và chọn **`Ứng dụng web` (Web app)**.
3.  Trong phần cấu hình:
    *   **Mô tả (Description):** `Bao Tang Lich Su Score Webhook`
    *   **Thực thi với quyền (Execute as):** `Tôi` (Me)
    *   **Ai có quyền truy cập (Who has access):** `Bất kỳ ai` (Anyone)
4.  Nhấn **`Triển khai` (Deploy)**.
5.  Google sẽ yêu cầu bạn cấp quyền. Hãy chọn tài khoản Google của bạn và cấp quyền cho script. Bạn có thể gặp màn hình cảnh báo "Ứng dụng chưa được xác minh", hãy chọn "Nâng cao" (Advanced) và "Tiếp tục" (Go to ...).
6.  Sau khi triển khai thành công, một cửa sổ sẽ hiện ra. **Sao chép URL ứng dụng web (Web app URL)**. Đây chính là URL webhook của bạn.

**Bước 4: Cấu hình dự án Next.js**
1.  Trong thư mục gốc của dự án `bao-tang-lich-su`, tạo một file mới tên là `.env.local` (nếu chưa có).
2.  Thêm nội dung sau vào file `.env.local`:

```
SHEETS_ENDPOINT="URL_WEBHOOK_BAN_VUA_SAO_CHEP"
```

3.  Thay thế `URL_WEBHOOK_BAN_VUA_SAO_CHEP` bằng URL bạn đã sao chép ở Bước 3.
4.  Khởi động lại server Next.js của bạn (`npm run dev`).

Bây giờ, khi bạn chơi game và hoàn thành các mốc gửi điểm, dữ liệu sẽ được gửi đến API route của Next.js, sau đó được chuyển tiếp đến Google Apps Script và cuối cùng được ghi vào Google Sheet của bạn.
