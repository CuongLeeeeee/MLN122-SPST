//Core
import { Input } from "@/game/input/Input";
import { buildMaps } from "@/game/map/Maps";
import { Player } from "@/game/player/Player";
import { clamp, nowMs } from "@/game/util/MathUtil";
import { Rect } from "@/game/util/Rect";
import type { Interactable } from "@/game/objects/Interact";
import type { MapId } from "@/game/save/SaveLoad";
import type { QuizId } from "@/data/questions";
import { ConfettiSystem } from "@/game/vfx/Confetti";

export type GameCallbacks = {
  onRequestFlipbook: (flipbookId: string, title: string) => void;
  onRequestQuiz: (quizId: QuizId, title: string) => void;
  onRequestFrame: (frameId: string, title: string, imageSrc?: string) => void;
  onTogglePause: (paused: boolean) => void;
  onSfxMoveStep: () => void;
  onSfxInteract: () => void;
  onSfxDoor: () => void;
};

export type GameInit = {
  canvas: HTMLCanvasElement;
  mapId: MapId;
  px: number;
  py: number;
  callbacks: GameCallbacks;
};

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  private dpr = 1;
  private viewW = 1280;
  private viewH = 720;

  private input = new Input();
  private player = new Player();
  private maps = buildMaps();
  private mapId: MapId;
  private mapBackgrounds: Record<MapId, HTMLImageElement>;
  private doorImage: HTMLImageElement;
  private stageImage: HTMLImageElement;
  private characterImage: HTMLImageElement;
  private frameImages: Record<string, HTMLImageElement> = {};

  private hardPaused = false;
  private softPaused = false;
  private rafId = 0;

  private lastMs = 0;
  private acc = 0;
  private readonly fixedDt = 1 / 60;

  private camX = 0;
  private camY = 0;

  private interactProbe = new Rect();
  private nearest: Interactable | null = null;

  private confetti = new ConfettiSystem();

  private callbacks: GameCallbacks;

  constructor(init: GameInit) {
    this.canvas = init.canvas;
    const ctx = this.canvas.getContext("2d", {
      alpha: false,
      desynchronized: true,
    });
    if (!ctx) throw new Error("Canvas 2D not supported");
    this.ctx = ctx;
    this.callbacks = init.callbacks;

    this.mapId = init.mapId;
    this.player.setSpawn(init.px, init.py);

    this.mapBackgrounds = {
      1: this.loadMapBackground("/assets/MapBackground/map1.jpg"),
      3: this.loadMapBackground("/assets/MapBackground/map3.jpg"),
    };

    this.doorImage = this.loadMapBackground("/assets/stairs.jpg");
    this.stageImage = this.loadMapBackground("/assets/trophy.png");
    this.characterImage = this.loadMapBackground("/assets/character.png");

    for (const map of Object.values(this.maps)) {
      for (const frame of map.wallFrames) {
        if (!this.frameImages[frame.id]) {
          this.frameImages[frame.id] = this.loadMapBackground(frame.imageSrc);
        }
      }
    }

    window.addEventListener("keydown", this.input.onKeyDown, { passive: true });
    window.addEventListener("keyup", this.input.onKeyUp, { passive: true });
    document.addEventListener("visibilitychange", this.onVisibility, {
      passive: true,
    });
  }

  private loadMapBackground(src: string) {
    const img = new Image();
    img.decoding = "async";
    img.loading = "eager";
    if (src.startsWith("http")) {
      img.referrerPolicy = "no-referrer";
    }
    img.src = src;
    return img;
  }

  destroy() {
    this.stop();
    window.removeEventListener("keydown", this.input.onKeyDown);
    window.removeEventListener("keyup", this.input.onKeyUp);
    document.removeEventListener("visibilitychange", this.onVisibility);
  }

  start() {
    if (this.rafId) return;
    this.lastMs = nowMs();
    const loop = () => {
      this.rafId = requestAnimationFrame(loop);
      const ms = nowMs();
      let dt = (ms - this.lastMs) / 1000;
      this.lastMs = ms;

      // avoid spiral-of-death
      dt = Math.min(dt, 0.1);

      this.acc += dt;
      while (this.acc >= this.fixedDt) {
        this.update(this.fixedDt);
        this.acc -= this.fixedDt;
      }

      this.render();
      this.input.endFrame();
    };
    this.rafId = requestAnimationFrame(loop);
  }

  stop() {
    if (!this.rafId) return;
    cancelAnimationFrame(this.rafId);
    this.rafId = 0;
  }

  setPaused(paused: boolean) {
    this.softPaused = paused;
  }

  setHardPaused(paused: boolean) {
    this.hardPaused = paused;
    if (!paused) this.acc = 0;
  }

  isHardPaused() {
    return this.hardPaused;
  }

  isPaused() {
    return this.hardPaused || this.softPaused;
  }

  setViewport(cssW: number, cssH: number, dpr: number) {
    this.dpr = dpr;
    this.viewW = Math.max(1, cssW);
    this.viewH = Math.max(1, cssH);
    this.canvas.width = Math.floor(cssW * dpr);
    this.canvas.height = Math.floor(cssH * dpr);
    this.canvas.style.width = `${cssW}px`;
    this.canvas.style.height = `${cssH}px`;
  }

  getState() {
    return {
      mapId: this.mapId,
      px: this.player.pos.x,
      py: this.player.pos.y,
    };
  }

  setState(mapId: MapId, px: number, py: number) {
    this.mapId = mapId;
    this.player.setSpawn(px, py);
  }

  jumpToMap(mapId: MapId) {
    if (this.mapId === mapId) return;
    this.mapId = mapId;
    this.spawnAtMapEntry(mapId);
  }

  advanceMap() {
    if (this.mapId === 1) {
      this.mapId = 3;
      this.player.setSpawn(360, 360);
      this.confetti.burst(this.player.pos.x + 120, this.player.pos.y - 40, 60);
      return;
    }
  }

  retreatMap() {
    // Only allow going back to already-cleared maps.
    if (this.mapId === 3) {
      this.mapId = 1;
    } else {
      return;
    }

    this.spawnAtMapEntry(this.mapId);
  }

  private spawnAtMapEntry(mapId: MapId) {
    const map = this.maps[mapId];
    const door = map.interactables.find((it) => it.type === "door");
    if (door) {
      const sx = door.rect.x + door.rect.w * 0.5;
      const sy = door.rect.y + 90;
      this.player.setSpawn(sx, sy);
      return;
    }
    this.player.setSpawn(map.width * 0.5, map.height * 0.5);
  }

  burstCelebration() {
    this.confetti.burst(this.player.pos.x + 90, this.player.pos.y - 60, 140);
  }

  private onVisibility = () => {
    if (document.hidden) {
      this.hardPaused = true;
      this.callbacks.onTogglePause(true);
    }
  };

  private update(dt: number) {
    const map = this.maps[this.mapId];

    if (this.input.wasPressed("Escape")) {
      this.hardPaused = !this.hardPaused;
      this.callbacks.onTogglePause(this.hardPaused);
      return;
    }

    if (this.isPaused()) {
      return;
    }

    this.player.update(
      dt,
      this.input,
      { w: map.width, h: map.height },
      map.obstacles,
      this.callbacks.onSfxMoveStep,
    );
    this.findNearestInteractable(map.interactables);

    if (this.nearest && this.input.wasPressed("KeyE")) {
      if (this.nearest.type === "exhibit" && this.nearest.flipbookId) {
        this.callbacks.onSfxInteract();
        this.callbacks.onRequestFlipbook(
          this.nearest.flipbookId,
          this.nearest.title,
        );
      }
      if (
        (this.nearest.type === "door" || this.nearest.type === "stage") &&
        this.nearest.quizId
      ) {
        this.callbacks.onSfxDoor();
        this.callbacks.onRequestQuiz(this.nearest.quizId, this.nearest.title);
      }
      if (this.nearest.type === "frame") {
        this.callbacks.onSfxInteract();
        this.callbacks.onRequestFrame(
          this.nearest.id,
          this.nearest.title,
          this.nearest.imageSrc,
        );
      }
    }

    this.confetti.update(dt);
  }

  private findNearestInteractable(list: Interactable[]) {
    // probe area slightly bigger than player
    this.player.getAabb(this.interactProbe);
    this.interactProbe.x -= 18;
    this.interactProbe.y -= 12;
    this.interactProbe.w += 36;
    this.interactProbe.h += 24;

    let best: Interactable | null = null;
    let bestD = 1e9;
    for (let i = 0; i < list.length; i++) {
      const it = list[i];
      if (!this.interactProbe.intersects(it.rect)) continue;
      const cx = it.rect.x + it.rect.w * 0.5;
      const cy = it.rect.y + it.rect.h * 0.5;
      const dx = cx - this.player.pos.x;
      const dy = cy - this.player.pos.y;
      const d = dx * dx + dy * dy;
      if (d < bestD) {
        bestD = d;
        best = it;
      }
    }
    this.nearest = best;
  }

  private updateCamera() {
    const map = this.maps[this.mapId];
    const maxX = Math.max(0, map.width - this.viewW);
    const maxY = Math.max(0, map.height - this.viewH);
    this.camX = clamp(this.player.pos.x - this.viewW * 0.5, 0, maxX);
    this.camY = clamp(this.player.pos.y - this.viewH * 0.5, 0, maxY);
  }

  private render() {
    this.updateCamera();

    const ctx = this.ctx;
    const s = this.dpr;

    ctx.setTransform(s, 0, 0, s, 0, 0);
    ctx.imageSmoothingEnabled = false;

    // Screen-space backdrop to ensure the whole viewport is filled
    // even when the map is smaller than the viewport.
    this.drawScreenBackdrop(ctx);

    ctx.save();
    ctx.translate(-this.camX, -this.camY);

    this.drawMuseum(ctx);
    this.drawInteractables(ctx);
    this.drawPlayer(ctx);

    this.confetti.draw(ctx, 0, 0);

    ctx.restore();

    this.drawVignette(ctx);

    this.drawHUD(ctx);
  }

  private drawScreenBackdrop(ctx: CanvasRenderingContext2D) {
    // base floor tone
    ctx.fillStyle = "#d9dee7";
    ctx.fillRect(0, 0, this.viewW, this.viewH);

    // subtle tile grid
    ctx.globalAlpha = 0.12;
    ctx.strokeStyle = "#c5cbd6";
    ctx.lineWidth = 1;
    const step = 56;
    for (let x = 0; x <= this.viewW; x += step) {
      ctx.beginPath();
      ctx.moveTo(x + 0.5, 0);
      ctx.lineTo(x + 0.5, this.viewH);
      ctx.stroke();
    }
    for (let y = 0; y <= this.viewH; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y + 0.5);
      ctx.lineTo(this.viewW, y + 0.5);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  private drawVignette(ctx: CanvasRenderingContext2D) {
    const g = ctx.createRadialGradient(
      this.viewW * 0.5,
      this.viewH * 0.45,
      Math.min(this.viewW, this.viewH) * 0.2,
      this.viewW * 0.5,
      this.viewH * 0.5,
      Math.max(this.viewW, this.viewH) * 0.72,
    );
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(1, "rgba(0,0,0,0.18)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, this.viewW, this.viewH);
  }

  private drawMuseum(ctx: CanvasRenderingContext2D) {
    const map = this.maps[this.mapId];

    this.drawMapBackground(ctx, map);

    // map3 wall frames
    if (map.wallFrames.length) {
      const time = nowMs() / 1000;
      for (const f of map.wallFrames) {
        const isNear = this.nearest?.id === f.id;
        const pulse = isNear ? 0.5 + 0.5 * Math.sin(time * 6.0) : 0;

        // keep the two large frames readable (not covered by exhibits)
        ctx.fillStyle = "rgba(0,0,0,0.08)";
        ctx.fillRect(f.x - 10, f.y - 8, f.w + 20, f.h + 26);
        ctx.fillStyle = "#1f2937";
        ctx.fillRect(f.x, f.y, f.w, f.h);
        ctx.strokeStyle = isNear
          ? `rgba(216,192,138,${0.55 + pulse * 0.25})`
          : "#d8c08a";
        ctx.lineWidth = isNear ? 5 : 4;
        ctx.strokeRect(f.x, f.y, f.w, f.h);

        if (
          !this.frameImages[f.id] ||
          this.frameImages[f.id].src !== f.imageSrc
        ) {
          this.frameImages[f.id] = this.loadMapBackground(f.imageSrc);
        }
        const img = this.frameImages[f.id];
        if (img && img.complete && img.naturalWidth > 0) {
          const pad = 10;
          const iw = f.w - pad * 2;
          const ih = f.h - pad * 2;
          const scale = Math.min(iw / img.naturalWidth, ih / img.naturalHeight);
          const drawW = img.naturalWidth * scale;
          const drawH = img.naturalHeight * scale;
          const dx = f.x + pad + (iw - drawW) * 0.5;
          const dy = f.y + pad + (ih - drawH) * 0.5;
          ctx.drawImage(img, dx, dy, drawW, drawH);
        } else {
          // inner abstract fallback
          ctx.globalAlpha = 0.22;
          ctx.fillStyle = "#93c5fd";
          ctx.beginPath();
          ctx.arc(f.x + f.w * 0.3, f.y + f.h * 0.45, 22, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#d8c08a";
          ctx.fillRect(f.x + f.w * 0.52, f.y + f.h * 0.28, 90, 10);
          ctx.fillRect(f.x + f.w * 0.52, f.y + f.h * 0.52, 120, 10);
          ctx.globalAlpha = 1;
        }

        ctx.fillStyle = "#334155";
        ctx.font = "16px system-ui";
        ctx.fillText(f.title, f.x + 14, f.y + f.h + 22);
      }
    }
  }

  private drawMapBackground(
    ctx: CanvasRenderingContext2D,
    map: { id: MapId; width: number; height: number },
  ) {
    const img = this.mapBackgrounds[map.id];
    if (img && img.complete && img.naturalWidth > 0) {
      const prevSmoothing = ctx.imageSmoothingEnabled;
      ctx.imageSmoothingEnabled = true;
      const scale = Math.max(
        map.width / img.naturalWidth,
        map.height / img.naturalHeight,
      );
      const drawW = img.naturalWidth * scale;
      const drawH = img.naturalHeight * scale;
      const dx = (map.width - drawW) * 0.5;
      const dy = (map.height - drawH) * 0.5;
      ctx.drawImage(img, dx, dy, drawW, drawH);
      ctx.imageSmoothingEnabled = prevSmoothing;
      return;
    }

    // fallback while image is loading
    ctx.fillStyle = "#d9dee7";
    ctx.fillRect(0, 0, map.width, map.height);
  }

  private drawInteractables(ctx: CanvasRenderingContext2D) {
    const map = this.maps[this.mapId];
    const time = nowMs() / 1000;

    for (const it of map.interactables) {
      const isNear = this.nearest?.id === it.id;
      const pulse = isNear ? 0.5 + 0.5 * Math.sin(time * 6.0) : 0;

      if (it.type === "exhibit") {
        this.drawExhibit(
          ctx,
          it.rect.x,
          it.rect.y,
          it.rect.w,
          it.rect.h,
          it.flipbookId ?? "",
          isNear,
          pulse,
        );

        // label (neutral, academic)
        ctx.fillStyle = map.id === 1 ? "#1a10aa" : "#000000";
        ctx.font = "bold 18px system-ui";
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.fillText(it.title, it.rect.x + it.rect.w * 0.5, it.rect.y - 8);
      } else if (it.type === "door") {
        this.drawDoor(
          ctx,
          it.rect.x,
          it.rect.y,
          it.rect.w,
          it.rect.h,
          isNear,
          pulse,
        );
        ctx.fillStyle = "rgb(21, 22, 24)";
        ctx.font = "bold 16px system-ui";
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.fillText(
          "Tầng tiếp theo",
          it.rect.x + it.rect.w * 0.5,
          it.rect.y + it.rect.h + 20,
        );
      } else if (it.type === "stage") {
        this.drawStage(
          ctx,
          it.rect.x,
          it.rect.y,
          it.rect.w,
          it.rect.h,
          isNear,
          pulse,
        );
        ctx.fillStyle = "#000000";
        ctx.font = "bold 16px system-ui";
        ctx.fillText(
          "Kết thúc",
          it.rect.x - it.rect.w * 0.05,
          it.rect.y + it.rect.h,
        );
      } else if (it.type === "frame") {
        // Frames are rendered in drawMuseum().
      }
    }
  }

  private drawExhibit(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    flipbookId: string,
    isNear: boolean,
    pulse01: number,
  ) {
    void flipbookId;

    // animated notice icon (blue info)
    const time = nowMs() / 1000;
    const scale = 0.9 + 0.08 * Math.sin(time * 3.2);
    const cx = x + w * 0.5;
    const cy = y + h * 0.5;
    const r = Math.min(w, h) * 0.28 * scale;

    ctx.save();
    ctx.translate(cx, cy);

    ctx.globalAlpha = 0.18;
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.ellipse(0, r + 12, r * 1.1, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.fillStyle = isNear ? "rgba(59,130,246,0.95)" : "rgba(59,130,246,0.85)";
    ctx.strokeStyle = isNear
      ? `rgba(147,197,253,${0.6 + pulse01 * 0.25})`
      : "rgba(147,197,253,0.55)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `bold ${Math.max(16, Math.round(r * 1.2))}px system-ui`;
    ctx.fillText("i", 0, 1);

    ctx.restore();
  }

  private drawDoor(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    isNear: boolean,
    pulse01: number,
  ) {
    void isNear;
    void pulse01;
    const img = this.doorImage;
    if (img && img.complete && img.naturalWidth > 0) {
      const prevSmoothing = ctx.imageSmoothingEnabled;
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(img, x, y, w, h);
      ctx.imageSmoothingEnabled = prevSmoothing;
      return;
    }

    ctx.fillStyle = "#8a4e0b";
    ctx.fillRect(x, y, w, h);
  }

  private drawStage(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    isNear: boolean,
    pulse01: number,
  ) {
    const img = this.stageImage;
    if (img && img.complete && img.naturalWidth > 0) {
      const prevSmoothing = ctx.imageSmoothingEnabled;
      ctx.imageSmoothingEnabled = true;
      const cx = x + w * 0.5;
      const cy = y + h * 0.5;
      const targetH = 120;
      const scale = targetH / img.naturalHeight;
      const drawW = img.naturalWidth * scale;
      const drawH = img.naturalHeight * scale;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.drawImage(img, -drawW * 0.5, -drawH * 0.5, drawW, drawH);
      ctx.restore();
      ctx.imageSmoothingEnabled = prevSmoothing;
      return;
    }

    // fallback platform
    ctx.fillStyle = "rgba(0,0,0,0.12)";
    ctx.fillRect(x - 38, y + h - 24, w + 76, 30);
    ctx.fillStyle = "#4b5563";
    ctx.fillRect(x - 30, y + h - 28, w + 60, 28);

    ctx.strokeStyle = isNear
      ? `rgba(216,192,138,${0.55 + pulse01 * 0.25})`
      : "rgba(216,192,138,0.30)";
    ctx.lineWidth = 4;
    ctx.strokeRect(x - 0.5, y - 0.5, w + 1, h + 1);
  }

  private drawPlayer(ctx: CanvasRenderingContext2D) {
    const x = this.player.pos.x;
    const y = this.player.pos.y;

    const flipX = this.player.facing.x < 0 ? -1 : 1;

    // shadow
    const shadowOffsetX = 0;
    const shadowOffsetY = 40;
    const shadowRadiusX = 16;
    const shadowRadiusY = 6;
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.ellipse(
      x + shadowOffsetX,
      y + shadowOffsetY,
      shadowRadiusX,
      shadowRadiusY,
      0,
      0,
      Math.PI * 2,
    );
    ctx.fill();
    ctx.globalAlpha = 1;

    // flip whole character by facing (left/right only)
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(flipX, 1);

    const img = this.characterImage;
    if (img && img.complete && img.naturalWidth > 0) {
      const prevSmoothing = ctx.imageSmoothingEnabled;
      ctx.imageSmoothingEnabled = true;
      const targetH = 192;
      const scale = targetH / img.naturalHeight;
      const drawW = img.naturalWidth * scale;
      const drawH = img.naturalHeight * scale;
      ctx.drawImage(img, -drawW * 0.5, -drawH * 0.5, drawW, drawH);
      ctx.imageSmoothingEnabled = prevSmoothing;
      ctx.restore();
      return;
    }

    // fallback body capsule (top-down)
    const bodyL = 24;
    const bodyW = 18;
    const r = bodyW * 0.5;

    ctx.fillStyle = "rgba(15,23,42,0.35)";
    ctx.beginPath();
    ctx.roundRect(
      -bodyL * 0.5 - 1.5,
      -bodyW * 0.5 - 1.5,
      bodyL + 3,
      bodyW + 3,
      r + 2,
    );
    ctx.fill();

    ctx.fillStyle = "#2563eb";
    ctx.beginPath();
    ctx.roundRect(-bodyL * 0.5, -bodyW * 0.5, bodyL, bodyW, r);
    ctx.fill();

    ctx.globalAlpha = 0.18;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.roundRect(-bodyL * 0.18, -bodyW * 0.35, bodyL * 0.22, bodyW * 0.7, 6);
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.arc(bodyL * 0.33, 0, 4.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 0.8;
    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.roundRect(-bodyL * 0.42, -5.5, 7.5, 11, 4);
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.restore();
  }

  private drawHUD(ctx: CanvasRenderingContext2D) {
    const map = this.maps[this.mapId];

    // top bar
    ctx.fillStyle = "rgba(255,255,255,0.45)";
    ctx.fillRect(16, 12, Math.min(560, this.viewW - 32), 48);

    ctx.fillStyle = "#0f172a";
    ctx.font = "16px system-ui";
    ctx.fillText(map.title, 30, 32);

    ctx.font = "12px system-ui";
    ctx.fillStyle = "#334155";
    ctx.fillText(
      "Di chuyển: WASD/Phím mũi tên • Tương tác: E • Pause: Esc",
      30,
      50,
    );

    // interact hint
    if (this.nearest) {
      ctx.fillStyle = "rgba(15,23,42,0.72)";
      const msg = `E: ${this.nearest.hint} — ${this.nearest.title}`;
      const pad = 12;
      ctx.font = "16px system-ui";
      const w = ctx.measureText(msg).width;
      const x = (this.viewW - (w + pad * 2)) * 0.5;
      const y = this.viewH - 64;
      ctx.fillRect(x, y, w + pad * 2, 42);
      ctx.fillStyle = "#f8fafc";
      ctx.fillText(msg, x + pad, y + 27);
    }

    // pause banner
    if (this.hardPaused) {
      ctx.fillStyle = "rgba(0,0,0,0.55)";
      ctx.fillRect(0, 0, this.viewW, this.viewH);
      ctx.fillStyle = "#f8fafc";
      ctx.font = "28px system-ui";
      ctx.fillText("PAUSE", this.viewW / 2 - 42, this.viewH / 2);
      ctx.font = "14px system-ui";
      ctx.fillStyle = "#cbd5e1";
      ctx.fillText(
        "Nhấn Esc để tiếp tục",
        this.viewW / 2 - 70,
        this.viewH / 2 + 28,
      );
    }
  }
}
