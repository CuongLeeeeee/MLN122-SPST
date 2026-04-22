//SaveLoad
import type { QuizId } from "@/data/questions";

export type MapId = 1 | 3;

export type ScoreState = {
  totalTimeMs: number;
  attempts: number;
};

export type SaveStateV1 = {
  v: 1;
  playerName: string;
  mapId: MapId;
  // spawn in world coords
  px: number;
  py: number;
  score: ScoreState;
  completed: Partial<Record<QuizId, boolean>>;
  helpShown: boolean;
  lastSavedAt: number;
};

const KEY = "btls_save_v1";

export function defaultScoreState(): ScoreState {
  return {
    totalTimeMs: 0,
    attempts: 0,
  };
}

export function defaultSave(playerName = ""): SaveStateV1 {
  return {
    v: 1,
    playerName,
    mapId: 1,
    px: 360,
    py: 360,
    score: defaultScoreState(),
    completed: {},
    helpShown: false,
    lastSavedAt: Date.now(),
  };
}

export function hasSave() {
  if (typeof window === "undefined") return false;
  return !!window.localStorage.getItem(KEY);
}

export function loadSave(): SaveStateV1 | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as {
      v?: unknown;
      mapId?: number;
      score?: unknown;
      [key: string]: unknown;
    };
    if (!parsed || parsed.v !== 1) return null;

    // Migrate legacy map id 2 to current map id 3.
    if (parsed.mapId === 2) {
      parsed.mapId = 3;
    }
    if (parsed.mapId !== 1 && parsed.mapId !== 3) {
      parsed.mapId = 1;
    }

    const normalized = parsed as SaveStateV1;
    const score = normalized.score as unknown as Partial<ScoreState> & {
      sideTotalTimeMs?: number;
      sideAttempts?: number;
      mainTotalTimeMs?: number;
      mainAttempts?: number;
    };
    if (
      score &&
      (typeof score.totalTimeMs !== "number" ||
        typeof score.attempts !== "number")
    ) {
      const totalTimeMs =
        (score.sideTotalTimeMs ?? 0) + (score.mainTotalTimeMs ?? 0);
      const attempts = (score.sideAttempts ?? 0) + (score.mainAttempts ?? 0);
      normalized.score = { totalTimeMs, attempts };
    }
    return normalized;
  } catch {
    return null;
  }
}

export function writeSave(s: SaveStateV1) {
  if (typeof window === "undefined") return;
  s.lastSavedAt = Date.now();
  window.localStorage.setItem(KEY, JSON.stringify(s));
}

export function clearSave() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}
