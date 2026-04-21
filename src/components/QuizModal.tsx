"use client";

//UI
import React, { useMemo, useState } from "react";
import styles from "@/components/ui.module.css";
import { shuffleInPlace } from "@/game/util/MathUtil";
import type { Question, QuizId } from "@/data/questions";

type ShuffledQuestion = {
  id: string;
  prompt: string;
  choices: string[];
  correctIndex: number;
};

function buildAttempt(questions: Question[]) {
  const qIdx = questions.map((_, i) => i);
  shuffleInPlace(qIdx);

  const out: ShuffledQuestion[] = [];
  for (let i = 0; i < qIdx.length; i++) {
    const q = questions[qIdx[i]];
    const aIdx = [0, 1, 2, 3];
    shuffleInPlace(aIdx);

    const newChoices = aIdx.map((k) => q.choices[k]);
    const newCorrect = aIdx.indexOf(q.correctIndex);

    out.push({
      id: q.id,
      prompt: q.prompt,
      choices: newChoices,
      correctIndex: newCorrect,
    });
  }
  return out;
}

export function QuizModal(props: {
  visible: boolean;
  quizId: QuizId;
  title: string;
  questions: Question[];
  onClose: () => void;
  onComplete: (result: { quizId: QuizId; totalTimeMs: number; attempts: number }) => void;
}) {
  const [attempts, setAttempts] = useState(1);
  const [startMs] = useState(() => Date.now());

  const [attemptQs, setAttemptQs] = useState<ShuffledQuestion[]>(() => buildAttempt(props.questions));
  const [idx, setIdx] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);
  const [failed, setFailed] = useState(false);
  const [finished, setFinished] = useState(false);

  const q = attemptQs[idx];

  const canNext = useMemo(() => locked && picked !== null && !failed && !finished, [locked, picked, failed, finished]);

  if (!props.visible) return null;

  const onPick = (i: number) => {
    if (!q || locked || finished) return;
    setPicked(i);
    setLocked(true);

    if (i === q.correctIndex) {
      const nextCorrect = correctCount + 1;
      setCorrectCount(nextCorrect);
      if (nextCorrect >= attemptQs.length) {
        setFinished(true);
      }
    } else {
      setFailed(true);
    }
  };

  const onNext = () => {
    if (!attemptQs.length) return;
    setIdx(Math.min(attemptQs.length - 1, idx + 1));
    setPicked(null);
    setLocked(false);
  };

  const onRetry = () => {
    setAttempts((a) => a + 1);
    setAttemptQs(buildAttempt(props.questions));
    setIdx(0);
    setCorrectCount(0);
    setPicked(null);
    setLocked(false);
    setFailed(false);
    setFinished(false);
  };

  const onFinish = () => {
    const totalTimeMs = Date.now() - startMs;
    props.onComplete({ quizId: props.quizId, totalTimeMs, attempts });
  };

  return (
    <div className={styles.root}>
      <div className={styles.backdrop} />
      <div className={styles.panel}>
        <div className={styles.header}>
          <div>
            <div className={styles.title}>{props.title}</div>
            <div className={styles.muted}>Quiz • {attemptQs.length} câu • Lần thử: {attempts}</div>
          </div>
          <button className={styles.close} onClick={props.onClose}>
            Đóng
          </button>
        </div>

        {!q ? (
          <div className={styles.muted}>Đang tải câu hỏi...</div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            <div>
              <div className={styles.muted}>
                Câu {idx + 1}/{attemptQs.length} • Đúng: {correctCount}
              </div>
              <div style={{ fontSize: 16, lineHeight: 1.5, marginTop: 6 }}>{q.prompt}</div>
            </div>

            <div style={{ display: "grid", gap: 10 }}>
              {q.choices.map((c, i) => {
                const isPicked = picked === i;
                const isCorrect = locked && i === q.correctIndex;
                const isWrongPick = locked && isPicked && i !== q.correctIndex;

                const cls = [styles.btn];
                if (isCorrect) cls.push(styles.btnPrimary);
                if (isWrongPick) cls.push(styles.btnDanger);

                return (
                  <button key={i} className={cls.join(" ")} onClick={() => onPick(i)}>
                    {String.fromCharCode(65 + i)}. {c}
                  </button>
                );
              })}
            </div>

            {failed ? (
              <div style={{ display: "grid", gap: 10 }}>
                <div className={styles.muted}>
                  Bạn đã chọn sai. Theo luật chơi: làm lại từ đầu, đảo lại thứ tự câu hỏi & đáp án.
                </div>
                <div className={styles.row}>
                  <button className={`${styles.btn} ${styles.btnDanger}`} onClick={onRetry}>
                    Làm lại
                  </button>
                </div>
              </div>
            ) : null}

            {finished ? (
              <div style={{ display: "grid", gap: 10 }}>
                <div>Chúc mừng! Bạn đã đúng toàn bộ.</div>
                <div className={styles.row}>
                  <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={onFinish}>
                    Hoàn thành
                  </button>
                </div>
              </div>
            ) : null}

            {!failed && !finished ? (
              <div className={styles.row}>
                <button className={styles.btn} onClick={props.onClose}>
                  Thoát
                </button>
                <button className={`${styles.btn} ${styles.btnPrimary}`} disabled={!canNext} onClick={onNext}>
                  Câu tiếp theo
                </button>
              </div>
            ) : null}

            <div className={styles.muted}>
              Dùng chuột trái để chọn đáp án.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
