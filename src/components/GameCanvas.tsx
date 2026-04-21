"use client";

//Core
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { Game, type GameCallbacks } from "@/game/core/Game";
import type { MapId } from "@/game/save/SaveLoad";
import type { QuizId } from "@/data/questions";

export type GameCanvasHandle = {
  setPaused: (v: boolean) => void;
  setHardPaused: (v: boolean) => void;
  isPaused: () => boolean;
  isHardPaused: () => boolean;
  getState: () => { mapId: MapId; px: number; py: number };
  setState: (mapId: MapId, px: number, py: number) => void;
  jumpToMap: (mapId: MapId) => void;
  advanceMap: () => void;
  retreatMap: () => void;
  burstCelebration: () => void;
};

export type GameCanvasProps = {
  initial: { mapId: MapId; px: number; py: number };
  callbacks: {
    onRequestFlipbook: (flipbookId: string, title: string) => void;
    onRequestQuiz: (quizId: QuizId, title: string) => void;
    onRequestFrame: (frameId: string, title: string, imageSrc?: string) => void;
    onTogglePause: (paused: boolean) => void;
    onSfxMoveStep: () => void;
    onSfxInteract: () => void;
    onSfxDoor: () => void;
  };
};

export const GameCanvas = forwardRef<GameCanvasHandle, GameCanvasProps>(function GameCanvas(
  { initial, callbacks },
  ref,
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameRef = useRef<Game | null>(null);

  useImperativeHandle(
    ref,
    () => ({
      setPaused: (v) => gameRef.current?.setPaused(v),
      setHardPaused: (v) => gameRef.current?.setHardPaused(v),
      isPaused: () => gameRef.current?.isPaused() ?? false,
      isHardPaused: () => gameRef.current?.isHardPaused() ?? false,
      getState: () => gameRef.current?.getState() ?? initial,
      setState: (mapId, px, py) => gameRef.current?.setState(mapId, px, py),
      jumpToMap: (mapId) => gameRef.current?.jumpToMap(mapId),
      advanceMap: () => gameRef.current?.advanceMap(),
      retreatMap: () => gameRef.current?.retreatMap(),
      burstCelebration: () => gameRef.current?.burstCelebration(),
    }),
    [initial],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const g = new Game({
      canvas,
      mapId: initial.mapId,
      px: initial.px,
      py: initial.py,
      callbacks: callbacks as GameCallbacks,
    });
    gameRef.current = g;

    const ro = new ResizeObserver(() => {
      const el = canvas.parentElement;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const dpr = Math.max(1, Math.min(2.5, window.devicePixelRatio || 1));
      g.setViewport(Math.floor(rect.width), Math.floor(rect.height), dpr);
    });

    const parent = canvas.parentElement;
    if (parent) ro.observe(parent);

    // initial size
    if (parent) {
      const rect = parent.getBoundingClientRect();
      const dpr = Math.max(1, Math.min(2.5, window.devicePixelRatio || 1));
      g.setViewport(Math.floor(rect.width), Math.floor(rect.height), dpr);
    }

    g.start();

    return () => {
      ro.disconnect();
      g.destroy();
      gameRef.current = null;
    };
  }, [initial.mapId, initial.px, initial.py, callbacks]);

  return <canvas ref={canvasRef} />;
});
