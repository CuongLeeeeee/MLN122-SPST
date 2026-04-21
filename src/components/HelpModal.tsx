"use client";

//UI
import React from "react";
import styles from "@/components/ui.module.css";

export function HelpModal(props: { visible: boolean; onClose: () => void }) {
  if (!props.visible) return null;

  return (
    <div className={styles.root}>
      <div className={styles.backdrop} onClick={props.onClose} />
      <div className={styles.panel}>
        <div className={styles.header}>
          <div className={styles.title}>Hướng dẫn nhanh</div>
          <button className={styles.close} onClick={props.onClose}>
            Đóng
          </button>
        </div>

        <div style={{ display: "grid", gap: 10, lineHeight: 1.5 }}>
          <div>
            - Di chuyển tự do quanh bảo tàng, đọc nội dung ở các bục trưng bày (flipbook).
            <br />- Đi tới cửa (màn 1, 2) hoặc sân khấu (màn 3) để làm quiz.
            <br />- Quiz: đúng toàn bộ mới qua màn; sai bất kỳ câu nào sẽ phải làm lại từ đầu (đảo lại thứ tự).
            <br />- Trong Pause có nút <b>Quay lại màn trước</b> để quay về màn đã vượt qua (chỉ quay lại, không có nút nhảy lên màn sau).
          </div>

          <div>
            Phím: <span className={styles.kbd}>WASD</span> / <span className={styles.kbd}>←↑→↓</span>
            , tương tác <span className={styles.kbd}>E</span>, pause <span className={styles.kbd}>Esc</span>.
          </div>

          <div className={styles.muted}>
            Mẹo: Âm thanh (SFX) chỉ hoạt động sau khi bạn bấm Start (AudioContext chỉ tạo sau thao tác của bạn).
          </div>
        </div>
      </div>
    </div>
  );
}
