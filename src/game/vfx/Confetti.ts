//VFX
import { Pool } from "@/game/util/Pool";
import { clamp } from "@/game/util/MathUtil";

type ConfettiP = {
  active: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  life: number;
  lifeMax: number;
  size: number;
  color: string;
};

const COLORS = ["#ff4d4d", "#ffd166", "#06d6a0", "#118ab2", "#c77dff"];

export class ConfettiSystem {
  private pool = new Pool<ConfettiP>(
    () => ({
      active: false,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      rot: 0,
      vr: 0,
      life: 0,
      lifeMax: 1,
      size: 4,
      color: COLORS[0],
    }),
    220,
  );

  private active: ConfettiP[] = [];

  burst(x: number, y: number, count: number) {
    for (let i = 0; i < count; i++) {
      const p = this.pool.acquire();
      p.active = true;
      p.x = x;
      p.y = y;
      const a = Math.random() * Math.PI * 2;
      const sp = 80 + Math.random() * 220;
      p.vx = Math.cos(a) * sp;
      p.vy = Math.sin(a) * sp - 120;
      p.rot = Math.random() * Math.PI * 2;
      p.vr = (Math.random() - 0.5) * 10;
      p.life = 0;
      p.lifeMax = 0.8 + Math.random() * 1.0;
      p.size = 3 + Math.random() * 5;
      p.color = COLORS[(Math.random() * COLORS.length) | 0];
      this.active.push(p);
    }
  }

  update(dt: number) {
    const g = 520;
    for (let i = this.active.length - 1; i >= 0; i--) {
      const p = this.active[i];
      p.life += dt;
      if (p.life >= p.lifeMax) {
        p.active = false;
        this.active[i] = this.active[this.active.length - 1];
        this.active.pop();
        this.pool.release(p);
        continue;
      }

      p.vy += g * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rot += p.vr * dt;

      // mild air drag
      p.vx *= clamp(1 - 0.8 * dt, 0.85, 1);
    }
  }

  draw(ctx: CanvasRenderingContext2D, ox: number, oy: number) {
    for (let i = 0; i < this.active.length; i++) {
      const p = this.active[i];
      const t = 1 - p.life / p.lifeMax;
      ctx.globalAlpha = clamp(t, 0, 1);
      ctx.save();
      ctx.translate(ox + p.x, oy + p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size * 0.5, -p.size * 0.5, p.size, p.size);
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  }
}
