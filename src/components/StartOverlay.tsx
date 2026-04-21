"use client";

//UI
import React, { useMemo, useState } from "react";
import styles from "@/components/ui.module.css";

export type StartChoice =
  | { type: "new"; playerName: string }
  | { type: "continue" }
  | { type: "reset" };

export function StartOverlay(props: {
  visible: boolean;
  hasSave: boolean;
  defaultName?: string;
  onChoose: (c: StartChoice) => void;
}) {
  const [name, setName] = useState(props.defaultName ?? "");

  const canStart = useMemo(() => name.trim().length >= 2, [name]);

  if (!props.visible) return null;

  return (
    <div className={styles.root}>
      <div className={styles.backdrop} />
      <div className={styles.panel}>
        <div className={styles.header}>
          <div className={styles.title}>Bảo tàng lịch sử</div>
          <div className={styles.muted}>Canvas 2D • NextJS + TS</div>
        </div>

        <div style={{ display: "grid", gap: 10 }}>
          <div className={styles.muted}>
            Nhập tên người chơi để bắt đầu. Game sẽ lưu tiến độ trong trình duyệt.
          </div>

          <input
            className={styles.input}
            placeholder="Tên người chơi (ít nhất 2 ký tự)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />

          <div className={styles.row}>
            <button
              className={`${styles.btn} ${styles.btnPrimary}`}
              disabled={!canStart}
              onClick={() => props.onChoose({ type: "new", playerName: name.trim() })}
            >
              Bấm để Start
            </button>

            {props.hasSave ? (
              <button className={styles.btn} onClick={() => props.onChoose({ type: "continue" })}>
                Load tiến trình chơi cũ
              </button>
            ) : null}

            {props.hasSave ? (
              <button
                className={`${styles.btn} ${styles.btnDanger}`}
                onClick={() => props.onChoose({ type: "reset" })}
              >
                Bắt đầu lại (xóa save)
              </button>
            ) : null}
          </div>

          <div className={styles.muted}>
            Điều khiển: <span className={styles.kbd}>W</span>
            <span className={styles.kbd}>A</span>
            <span className={styles.kbd}>S</span>
            <span className={styles.kbd}>D</span> / Phím mũi tên • Tương tác:
            <span className={styles.kbd}>E</span> • Pause:
            <span className={styles.kbd}>Esc</span>
          </div>
        </div>
      </div>
    </div>
  );
}
