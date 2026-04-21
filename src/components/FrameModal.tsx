"use client";

import React from "react";
import styles from "@/components/ui.module.css";

const DEFAULT_FRAME_IMAGE = "https://i.pinimg.com/736x/af/1c/90/af1c90a42802cd8678988be18d47ee8e.jpg";

export function FrameModal(props: {
  visible: boolean;
  frameId: string;
  title: string;
  imageSrc?: string;
  onClose: () => void;
}) {
  void props.frameId;
  const imageSrc = props.imageSrc ?? DEFAULT_FRAME_IMAGE;

  if (!props.visible) return null;

  return (
    <div className={styles.root}>
      <div className={styles.backdrop} onClick={props.onClose} />
      <div className={styles.panel}>
        <div className={styles.header}>
          <div className={styles.title}>{props.title}</div>
          <button className={styles.close} onClick={props.onClose}>
            Đóng
          </button>
        </div>

        <div style={{ display: "grid", gap: 12 }}>
          <div className={styles.muted}>Ảnh phóng to để xem rõ hơn.</div>
          <div style={{ width: "100%", overflow: "auto", borderRadius: 12 }}>
            <img
              src={imageSrc}
              alt={props.title}
              style={{ display: "block", maxWidth: "100%", borderRadius: 12 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
