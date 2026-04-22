"use client";

//UI
import React, { useMemo, useState } from "react";
import styles from "@/components/ui.module.css";
import { FLIPBOOKS, type FlipbookId } from "../data/flipbooks";

export function FlipbookModal(props: {
  visible: boolean;
  flipbookId: string;
  onClose: () => void;
}) {
  const book = useMemo(
    () => FLIPBOOKS[props.flipbookId as FlipbookId],
    [props.flipbookId],
  );
  const [page, setPage] = useState(0);

  if (!props.visible) return null;

  const pages = book?.pages ?? [];
  const title = book?.title ?? "Flipbook";
  const embedUrl = book?.embedUrl;
  const canPrev = page > 0;
  const canNext = page < pages.length - 1;
  const panelStyle = embedUrl
    ? {
        width: "min(980px, calc(100vw - 24px))",
        maxHeight: "88vh",
        overflow: "auto",
      }
    : {
        width: "min(820px, calc(100vw - 24px))",
        maxHeight: "88vh",
        overflow: "auto",
      };

  return (
    <div className={styles.root}>
      <div className={styles.backdrop} onClick={props.onClose} />
      <div className={styles.panel} style={panelStyle}>
        <div className={styles.header}>
          <div>
            <div className={styles.title}>{title}</div>
            {!embedUrl && (
              <div className={styles.muted}>
                Trang {Math.min(page + 1, pages.length)}/{pages.length}
              </div>
            )}
          </div>
          <button className={styles.close} onClick={props.onClose}>
            Đóng
          </button>
        </div>

        <div style={{ display: "grid", gap: 12 }}>
          {embedUrl ? (
            <div
              style={{
                borderRadius: 14,
                border: "1px solid rgba(148,163,184,0.18)",
                background: "rgba(15,23,42,0.4)",
                padding: 10,
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  paddingTop: "62.5%",
                }}
              >
                <iframe
                  src={embedUrl}
                  title={title}
                  loading="lazy"
                  allowFullScreen
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    border: 0,
                    borderRadius: 10,
                  }}
                />
              </div>
            </div>
          ) : (
            <>
              <div
                style={{
                  borderRadius: 14,
                  border: "1px solid rgba(148,163,184,0.18)",
                  background: "rgba(15,23,42,0.4)",
                  padding: 14,
                  lineHeight: 1.6,
                  minHeight: 130,
                  whiteSpace: "pre-line",
                }}
              >
                {pages[page] ?? "(Không có nội dung)"}
              </div>

              <div className={styles.row}>
                <button
                  className={styles.btn}
                  disabled={!canPrev}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                >
                  Trang trước
                </button>
                <button
                  className={`${styles.btn} ${styles.btnPrimary}`}
                  disabled={!canNext}
                  onClick={() =>
                    setPage((p) => Math.min(pages.length - 1, p + 1))
                  }
                >
                  Trang sau
                </button>
              </div>
            </>
          )}

          <div className={styles.muted}>
            Mẹo: Đọc xong thì đóng để tiếp tục di chuyển.
          </div>
        </div>
      </div>
    </div>
  );
}
