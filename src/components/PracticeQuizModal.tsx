"use client";

import React, { useState } from "react";
import styles from "@/components/ui.module.css";
import {
  PRACTICE_LEVEL_LABEL,
  PRACTICE_QUESTIONS,
  type PracticeLevel,
  type PracticeQuestion,
} from "@/data/practiceQuestions";

type QuizState = {
  index: number;
  score: number;
  picked: number | null;
  locked: boolean;
  finished: boolean;
};

type SelectionMode = "options" | "level";
type QuizMode = "random" | "level";

const RANDOM_PICK_PLAN: Array<{ level: PracticeLevel; count: number }> = [
  { level: "easy", count: 4 },
  { level: "medium", count: 3 },
  { level: "hard", count: 3 },
];

function shuffleCopy<T>(items: T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function pickRandomByLevel(
  level: PracticeLevel,
  count: number,
): PracticeQuestion[] {
  const pool = shuffleCopy(PRACTICE_QUESTIONS[level]);
  return pool.slice(0, Math.min(count, pool.length));
}

function buildRandomMixedQuestions(): PracticeQuestion[] {
  const picked: PracticeQuestion[] = [];
  for (const rule of RANDOM_PICK_PLAN) {
    picked.push(...pickRandomByLevel(rule.level, rule.count));
  }
  return shuffleCopy(picked);
}

export function PracticeQuizModal(props: {
  visible: boolean;
  onClose: () => void;
  onSfxSelect?: () => void;
  onSfxCorrect?: () => void;
  onSfxWrong?: () => void;
}) {
  const [selectionMode, setSelectionMode] = useState<SelectionMode>("options");
  const [quizMode, setQuizMode] = useState<QuizMode | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<PracticeLevel | null>(
    null,
  );
  const [quizLabel, setQuizLabel] = useState("");
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [state, setState] = useState<QuizState | null>(null);

  const currentQuestion = state ? questions[state.index] : null;
  const title = "Kho đề ôn luyện - Quiz";

  if (!props.visible) return null;

  const startQuiz = (
    nextQuestions: PracticeQuestion[],
    nextLabel: string,
    mode: QuizMode,
  ) => {
    setQuizMode(mode);
    setQuizLabel(nextLabel);
    setQuestions(nextQuestions);
    setState({
      index: 0,
      score: 0,
      picked: null,
      locked: false,
      finished: false,
    });
  };

  const startLevelQuiz = (level: PracticeLevel) => {
    setSelectedLevel(level);
    startQuiz(PRACTICE_QUESTIONS[level], PRACTICE_LEVEL_LABEL[level], "level");
  };

  const startRandomQuiz = () => {
    setSelectedLevel(null);
    startQuiz(
      buildRandomMixedQuestions(),
      "ĐỀ NGẪU NHIÊN: 4 DỄ • 3 TRUNG BÌNH • 3 KHÓ",
      "random",
    );
  };

  const pickChoice = (choiceIndex: number) => {
    if (!state || !currentQuestion || state.locked || state.finished) return;

    const isCorrect = choiceIndex === currentQuestion.correctIndex;
    props.onSfxSelect?.();
    if (isCorrect) props.onSfxCorrect?.();
    else props.onSfxWrong?.();

    setState({
      ...state,
      picked: choiceIndex,
      locked: true,
      score: state.score + (isCorrect ? 1 : 0),
    });
  };

  const nextQuestion = () => {
    if (!state) return;
    const nextIndex = state.index + 1;

    if (nextIndex >= questions.length) {
      setState({ ...state, finished: true });
      return;
    }

    setState({
      ...state,
      index: nextIndex,
      picked: null,
      locked: false,
    });
  };

  const restartQuiz = () => {
    if (quizMode === "random") {
      startRandomQuiz();
      return;
    }

    if (selectedLevel) {
      startLevelQuiz(selectedLevel);
    }
  };

  const backToModeOptions = () => {
    setSelectionMode("options");
    setQuizMode(null);
    setSelectedLevel(null);
    setQuizLabel("");
    setQuestions([]);
    setState(null);
  };

  const backToLevelSelect = () => {
    setSelectionMode("level");
    setQuizMode(null);
    setSelectedLevel(null);
    setQuizLabel("");
    setQuestions([]);
    setState(null);
  };

  return (
    <div className={styles.root}>
      <div className={styles.backdrop} onClick={props.onClose} />
      <div className={styles.panel}>
        <div className={styles.header}>
          <div>
            <div className={styles.title}>{title}</div>
          </div>
          <button
            className={styles.close}
            onClick={props.onClose}
            type="button"
          >
            Đóng
          </button>
        </div>

        {!state ? (
          selectionMode === "options" ? (
            <div style={{ display: "grid", gap: 12 }}>
              <button
                className={`${styles.btn} ${styles.btnPrimary}`}
                onClick={startRandomQuiz}
                type="button"
              >
                1 - Random đề
              </button>
              <button
                className={styles.btn}
                onClick={() => setSelectionMode("level")}
                type="button"
              >
                2 - Chọn đề theo mức độ
              </button>
            </div>
          ) : (
            <div style={{ display: "grid", gap: 10 }}>
              <button
                className={styles.btn}
                onClick={() => startLevelQuiz("easy")}
                type="button"
              >
                {PRACTICE_LEVEL_LABEL.easy}
              </button>
              <button
                className={styles.btn}
                onClick={() => startLevelQuiz("medium")}
                type="button"
              >
                {PRACTICE_LEVEL_LABEL.medium}
              </button>
              <button
                className={styles.btn}
                onClick={() => startLevelQuiz("hard")}
                type="button"
              >
                {PRACTICE_LEVEL_LABEL.hard}
              </button>
              <button
                className={styles.btn}
                onClick={backToModeOptions}
                type="button"
              >
                Quay lại chọn chế độ
              </button>
            </div>
          )
        ) : state.finished ? (
          <div style={{ display: "grid", gap: 10 }}>
            <div>
              <b>{quizLabel}</b>
            </div>
            <div>
              Kết quả: {state.score}/{questions.length} câu đúng.
            </div>
            <div className={styles.row}>
              <button
                className={`${styles.btn} ${styles.btnPrimary}`}
                onClick={restartQuiz}
                type="button"
              >
                Làm lại đề này
              </button>
              <button
                className={styles.btn}
                onClick={
                  quizMode === "level" ? backToLevelSelect : backToModeOptions
                }
                type="button"
              >
                Chọn đề khác
              </button>
            </div>
          </div>
        ) : !currentQuestion ? (
          <div className={styles.muted}>Đang tải câu hỏi...</div>
        ) : (
          <div style={{ display: "grid", gap: 16 }}>
            <div>
              <div className={styles.muted}>
                {quizLabel} - Câu {state.index + 1}/{questions.length}
              </div>
              <div
                style={{
                  marginTop: 10,
                  fontSize: 22,
                  lineHeight: 1.65,
                  fontWeight: 600,
                }}
              >
                {currentQuestion.prompt}
              </div>
            </div>

            <div style={{ display: "grid", gap: 12 }}>
              {currentQuestion.choices.map((choice, index) => {
                const picked = state.picked === index;
                const isCorrect =
                  state.locked && index === currentQuestion.correctIndex;
                const isWrongPicked =
                  state.locked &&
                  picked &&
                  index !== currentQuestion.correctIndex;

                const classNames = [styles.btn, styles.practiceChoice];
                if (isCorrect) classNames.push(styles.btnPrimary);
                if (isWrongPicked) classNames.push(styles.btnDanger);

                return (
                  <button
                    key={index}
                    className={classNames.join(" ")}
                    disabled={state.locked}
                    onClick={() => pickChoice(index)}
                    style={{
                      textAlign: "left",
                      fontSize: 18,
                      lineHeight: 1.5,
                      padding: "16px 18px",
                      minHeight: 58,
                    }}
                    type="button"
                  >
                    {String.fromCharCode(65 + index)}. {choice}
                  </button>
                );
              })}
            </div>

            {state.locked ? (
              <div
                style={{
                  borderRadius: 14,
                  padding: "14px 16px",
                  minHeight: 60,
                  display: "flex",
                  alignItems: "center",
                  fontSize: 18,
                  lineHeight: 1.5,
                  border:
                    state.picked === currentQuestion.correctIndex
                      ? "1px solid rgba(34,197,94,0.55)"
                      : "1px solid rgba(239,68,68,0.55)",
                  background:
                    state.picked === currentQuestion.correctIndex
                      ? "rgba(34,197,94,0.16)"
                      : "rgba(239,68,68,0.16)",
                }}
              >
                {state.picked === currentQuestion.correctIndex
                  ? "Chính xác!"
                  : `Sai rồi. Đáp án đúng là ${String.fromCharCode(65 + currentQuestion.correctIndex)}.`}
              </div>
            ) : null}

            <div className={styles.row}>
              <button
                className={styles.btn}
                onClick={
                  quizMode === "level" ? backToLevelSelect : backToModeOptions
                }
                type="button"
              >
                Chọn đề khác
              </button>
              <button
                className={`${styles.btn} ${styles.btnPrimary}`}
                disabled={!state.locked}
                onClick={nextQuestion}
                type="button"
              >
                Câu tiếp theo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
