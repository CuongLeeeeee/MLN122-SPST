"use client";

//UI
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import styles from "@/app/page.module.css";
import { GameCanvas, type GameCanvasHandle } from "@/components/GameCanvas";
import { StartOverlay, type StartChoice } from "@/components/StartOverlay";
import { HelpModal } from "@/components/HelpModal";
import { PauseOverlay } from "@/components/PauseOverlay";
import { QuizModal } from "@/components/QuizModal";
import { FlipbookModal } from "@/components/FlipbookModal";
import { FrameModal } from "@/components/FrameModal";
import { PracticeQuizModal } from "@/components/PracticeQuizModal";

import { AudioSystem } from "@/game/audio/Audio";
import {
  clearSave,
  defaultSave,
  hasSave,
  loadSave,
  writeSave,
  type MapId,
  type SaveStateV1,
} from "@/game/save/SaveLoad";
import { QUIZ_QUESTIONS, type QuizId } from "@/data/questions";

type ActiveQuiz = { quizId: QuizId; title: string; openId: number } | null;
type ActiveFrame = {
  frameId: string;
  title: string;
  imageSrc?: string;
  openId: number;
} | null;

function fmtMs(ms: number) {
  const s = Math.max(0, Math.round(ms / 1000));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
}

async function postScore(payload: Record<string, unknown>, debug = false) {
  try {
    if (debug) console.log("[score] POST /api/score payload", payload);

    const res = await fetch("/api/score", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    });

    // Best-effort logging: only warn if proxy reports failure.
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.warn("[score] POST /api/score failed", {
        status: res.status,
        body: text,
        payload,
      });
      return;
    }

    const json = (await res.json().catch(() => null)) as null | {
      ok?: boolean;
      status?: number;
      requestId?: string;
      elapsedMs?: number;
      body?: string;
    };

    if (json && json.ok === false) {
      console.warn("[score] Upstream webhook returned ok=false", json);
    } else if (debug) {
      console.log("[score] POST /api/score ok", json ?? { ok: true });
    }
  } catch {
    // best-effort
  }
}

export function GamePage() {
  const gameRef = useRef<GameCanvasHandle>(null);
  const audio = useMemo(() => new AudioSystem(), []);

  const [debugSkipQuiz, setDebugSkipQuiz] = useState<boolean>(() => {
    try {
      return window.localStorage.getItem("btls_debug_skip_quiz") === "1";
    } catch {
      return false;
    }
  });

  const [started, setStarted] = useState(false);
  const [save, setSave] = useState<SaveStateV1 | null>(() => loadSave());
  const [saveExists, setSaveExists] = useState(() => hasSave());

  const [paused, setPaused] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const [activeQuiz, setActiveQuiz] = useState<ActiveQuiz>(null);
  const [activeFlipbookId, setActiveFlipbookId] = useState<string | null>(null);
  const [showPracticeQuiz, setShowPracticeQuiz] = useState(false);
  const [practiceQuizOpenId, setPracticeQuizOpenId] = useState(0);
  const [activeFrame, setActiveFrame] = useState<ActiveFrame>(null);

  const [endgame, setEndgame] = useState(false);

  const ensureAudio = useCallback(async () => {
    await audio.ensureStarted();
  }, [audio]);

  const syncSaveFromGame = useCallback(
    (base: SaveStateV1) => {
      const st = gameRef.current?.getState();
      if (!st) return base;
      const next: SaveStateV1 = {
        ...base,
        mapId: st.mapId,
        px: st.px,
        py: st.py,
      };
      writeSave(next);
      setSave(next);
      setSaveExists(true);
      return next;
    },
    [setSave, setSaveExists],
  );

  const onChooseStart = useCallback(
    async (c: StartChoice) => {
      if (c.type === "reset") {
        clearSave();
        setSaveExists(false);
        setSave(null);
        return;
      }

      await ensureAudio();

      if (c.type === "continue") {
        const loaded = loadSave();
        const s = loaded ?? defaultSave("");
        writeSave(s);
        setSave(s);
        setStarted(true);
        setEndgame(false);
        setShowHelp(!s.helpShown);
        return;
      }

      // new
      clearSave();
      const s = defaultSave(c.playerName);
      writeSave(s);
      setSave(s);
      setStarted(true);
      setEndgame(false);
      setShowHelp(true);
    },
    [ensureAudio],
  );

  const onQuizComplete = useCallback(
    async (res: { quizId: QuizId; totalTimeMs: number; attempts: number }) => {
      if (!save) {
        setActiveQuiz(null);
        return;
      }

      let next: SaveStateV1 = { ...save };
      next.completed = { ...next.completed, [res.quizId]: true };

      next.score = {
        ...next.score,
        totalTimeMs: next.score.totalTimeMs + res.totalTimeMs,
        attempts: next.score.attempts + res.attempts,
      };

      // close modal + advance
      setActiveQuiz(null);

      if (res.quizId === "map1") {
        gameRef.current?.advanceMap();
        next = syncSaveFromGame(next);
      } else {
        gameRef.current?.burstCelebration();
        next = syncSaveFromGame(next);
        setEndgame(true);

        await postScore(
          {
            kind: "score",
            playerName: next.playerName,
            totalTimeMs: next.score.totalTimeMs,
            attempts: next.score.attempts,
            at: new Date().toISOString(),
          },
          debugSkipQuiz,
        );
      }

      writeSave(next);
      setSave(next);
      setSaveExists(true);
    },
    [debugSkipQuiz, save, syncSaveFromGame],
  );

  const callbacks = useMemo(
    () => ({
      onRequestFlipbook: (flipbookId: string, _title: string) => {
        void _title;
        if (flipbookId === "m3-kho-de") {
          setPracticeQuizOpenId(Date.now());
          setShowPracticeQuiz(true);
          return;
        }
        setActiveFlipbookId(flipbookId);
      },
      onRequestQuiz: (quizId: QuizId, title: string) => {
        if (debugSkipQuiz) {
          // Debug shortcut: auto-complete quiz without showing the modal.
          void onQuizComplete({ quizId, totalTimeMs: 0, attempts: 0 });
          return;
        }
        setActiveQuiz({ quizId, title, openId: Date.now() });
      },
      onRequestFrame: (frameId: string, title: string, imageSrc?: string) => {
        setActiveFrame({ frameId, title, imageSrc, openId: Date.now() });
      },
      onTogglePause: (p: boolean) => {
        setPaused(p);
        if (p) audio.suspend();
        else audio.resume();
      },
      onSfxMoveStep: () => audio.playMoveStep(),
      onSfxInteract: () => audio.playInteract(),
      onSfxDoor: () => audio.playDoor(),
    }),
    [audio, debugSkipQuiz, onQuizComplete],
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Hidden trigger: Ctrl + Alt + D
      if (e.ctrlKey && e.altKey && e.code === "KeyD") {
        e.preventDefault();
        setDebugSkipQuiz((prev) => {
          const next = !prev;
          try {
            window.localStorage.setItem(
              "btls_debug_skip_quiz",
              next ? "1" : "0",
            );
          } catch {
            // ignore
          }
          return next;
        });
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const shouldPause =
      paused ||
      showHelp ||
      !!activeQuiz ||
      !!activeFlipbookId ||
      showPracticeQuiz ||
      !!activeFrame ||
      endgame;
    gameRef.current?.setPaused(shouldPause);
  }, [
    paused,
    showHelp,
    activeQuiz,
    activeFlipbookId,
    showPracticeQuiz,
    activeFrame,
    endgame,
  ]);

  const closeFlipbook = useCallback(() => {
    setActiveFlipbookId(null);
  }, []);

  const closePracticeQuiz = useCallback(() => {
    setShowPracticeQuiz(false);
  }, []);

  const closeFrame = useCallback(() => {
    setActiveFrame(null);
  }, []);

  const closeQuiz = useCallback(() => {
    setActiveQuiz(null);
  }, []);

  const onResume = useCallback(() => {
    setPaused(false);
    gameRef.current?.setHardPaused(false);
    audio.resume();
  }, [audio]);

  const onBackToPreviousMap = useCallback(() => {
    if (!save) return;
    if (save.mapId <= 1) return;

    gameRef.current?.retreatMap();
    const next = syncSaveFromGame(save);
    writeSave(next);
    setSave(next);
    setSaveExists(true);

    // Resume after jumping back.
    setPaused(false);
    gameRef.current?.setHardPaused(false);
    audio.resume();
  }, [audio, save, syncSaveFromGame]);

  const unlockedMaps = useMemo<MapId[]>(() => {
    const completed = save?.completed ?? {};
    let max: MapId = 1;
    if (completed.map1) max = 3;
    if (max === 1) return [1];
    return [1, 3];
  }, [save]);

  const onJumpToMap = useCallback(
    (mapId: MapId) => {
      if (!save) return;
      if (!unlockedMaps.includes(mapId)) return;

      gameRef.current?.jumpToMap(mapId);
      const next = syncSaveFromGame(save);
      writeSave(next);
      setSave(next);
      setSaveExists(true);

      setPaused(false);
      gameRef.current?.setHardPaused(false);
      audio.resume();
    },
    [audio, save, syncSaveFromGame, unlockedMaps],
  );

  const onShowHelp = useCallback(() => {
    setShowHelp(true);
    setPaused(false);
    gameRef.current?.setHardPaused(false);
  }, []);

  const onCloseHelp = useCallback(() => {
    setShowHelp(false);
    if (!save) return;
    if (save.helpShown) return;
    const next = { ...save, helpShown: true };
    writeSave(next);
    setSave(next);
  }, [save]);

  const onRestart = useCallback(() => {
    clearSave();
    const s = defaultSave(save?.playerName ?? "");
    writeSave(s);
    setSave(s);
    setSaveExists(true);
    setEndgame(false);
    setPaused(false);
    setActiveQuiz(null);
    setActiveFlipbookId(null);
    setShowPracticeQuiz(false);
    gameRef.current?.setState(s.mapId, s.px, s.py);
  }, [save?.playerName]);

  const initial = save ?? defaultSave("");

  return (
    <div className={styles.shell}>
      <div className={styles.canvasWrap}>
        {started ? (
          <GameCanvas ref={gameRef} initial={initial} callbacks={callbacks} />
        ) : null}
      </div>

      {debugSkipQuiz ? (
        <div className={styles.debugBadge}>DEBUG: Skip quiz</div>
      ) : null}

      {/* {started ? (
        <Link
          href="/academic-integrity"
          className={styles.integrityBtn}
          title="Xem báo cáo liêm chính học thuật"
        >
          📋 Liêm chính học thuật
        </Link>
      ) : null} */}

      <StartOverlay
        key={`${saveExists ? "1" : "0"}-${save?.playerName ?? ""}`}
        visible={!started}
        hasSave={saveExists}
        defaultName={save?.playerName ?? ""}
        onChoose={onChooseStart}
      />

      <HelpModal visible={showHelp} onClose={onCloseHelp} />

      <PauseOverlay
        visible={paused}
        volume={audio.getVolume()}
        score={save?.score ?? initial.score}
        currentMapId={save?.mapId ?? initial.mapId}
        availableMaps={unlockedMaps}
        onChangeVolume={(v) => {
          audio.setVolume(v);
        }}
        canBack={(save?.mapId ?? initial.mapId) > 1}
        onBack={onBackToPreviousMap}
        onJumpToMap={onJumpToMap}
        onResume={onResume}
        onShowHelp={onShowHelp}
      />

      <FlipbookModal
        key={activeFlipbookId ?? "none"}
        visible={!!activeFlipbookId}
        flipbookId={activeFlipbookId ?? ""}
        onClose={closeFlipbook}
      />

      <PracticeQuizModal
        key={practiceQuizOpenId}
        visible={showPracticeQuiz}
        onClose={closePracticeQuiz}
        onSfxSelect={() => audio.playQuizSelect()}
        onSfxCorrect={() => audio.playQuizCorrect()}
        onSfxWrong={() => audio.playQuizWrong()}
      />

      {activeFrame ? (
        <FrameModal
          key={activeFrame.openId}
          visible={true}
          frameId={activeFrame.frameId}
          title={activeFrame.title}
          imageSrc={activeFrame.imageSrc}
          onClose={closeFrame}
        />
      ) : null}

      {activeQuiz ? (
        <QuizModal
          key={activeQuiz.openId}
          visible={true}
          quizId={activeQuiz.quizId}
          title={activeQuiz.title}
          questions={QUIZ_QUESTIONS[activeQuiz.quizId]}
          onClose={closeQuiz}
          onComplete={onQuizComplete}
          onSfxSelect={() => audio.playQuizSelect()}
          onSfxCorrect={() => audio.playQuizCorrect()}
          onSfxWrong={() => audio.playQuizWrong()}
        />
      ) : null}

      {endgame ? (
        <div className={styles.endWrap}>
          <div className={styles.endBackdrop} />
          <div className={styles.endPanel}>
            <div className={styles.endTitle}>Hoàn thành!</div>
            <div className={styles.endMuted}>
              Người chơi: <b>{save?.playerName}</b>
            </div>
            <div className={styles.endGrid}>
              <div>
                <div className={styles.endMuted}>Score</div>
                <div>Thời gian: {fmtMs(save?.score.totalTimeMs ?? 0)}</div>
                <div>Lần thử: {save?.score.attempts ?? 0}</div>
              </div>
            </div>

            <div className={styles.endRow}>
              <button
                className={styles.endBtn}
                onClick={() => setEndgame(false)}
              >
                Quay lại bảo tàng
              </button>
              <button className={styles.endBtnPrimary} onClick={onRestart}>
                Chơi lại từ đầu
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
