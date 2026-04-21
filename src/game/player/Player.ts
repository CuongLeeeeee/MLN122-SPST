//Player
import type { Input } from "@/game/input/Input";
import { clamp } from "@/game/util/MathUtil";
import { Rect } from "@/game/util/Rect";
import { Vec2 } from "@/game/util/Vec2";

export class Player {
  pos = new Vec2(360, 360);
  vel = new Vec2(0, 0);

  // last movement direction (used for rendering facing)
  facing = new Vec2(1, 0);

  // collision box centered on pos
  half = new Vec2(52, 64);

  private stepTimer = 0;
  private tmpDir = new Vec2();

  setSpawn(x: number, y: number) {
    this.pos.set(x, y);
    this.vel.set(0, 0);
  }

  getAabb(out = new Rect()) {
    out.x = this.pos.x - this.half.x;
    out.y = this.pos.y - this.half.y;
    out.w = this.half.x * 2;
    out.h = this.half.y * 2;
    return out;
  }

  update(
    dt: number,
    input: Input,
    bounds: { w: number; h: number },
    obstacles: Rect[],
    onStepSfx?: () => void,
  ) {
    const ax = (input.isDown("KeyD") || input.isDown("ArrowRight") ? 1 : 0) -
      (input.isDown("KeyA") || input.isDown("ArrowLeft") ? 1 : 0);
    const ay = (input.isDown("KeyS") || input.isDown("ArrowDown") ? 1 : 0) -
      (input.isDown("KeyW") || input.isDown("ArrowUp") ? 1 : 0);

    const dir = this.tmpDir.set(ax, ay);
    const moving = dir.lenSq() > 0;
    if (moving) dir.normalize();

    // Facing is left/right only (horizontal flip) even though movement supports up/down.
    if (ax !== 0) {
      this.facing.set(ax > 0 ? 1 : -1, 0);
    }

    const speed = 300;
    this.vel.copy(dir).scale(speed);

    const dx = this.vel.x * dt;
    const dy = this.vel.y * dt;

    // axis-separated collision
    this.moveAxis(dx, 0, obstacles);
    this.moveAxis(0, dy, obstacles);

    // clamp into map bounds
    const minX = this.half.x;
    const maxX = bounds.w - this.half.x;
    // Keep in sync with the museum wall bands used by the renderer & map obstacles.
    const wallTopH = 50;
    const wallBottomH = -20;
    const minY = wallTopH + this.half.y + 2;
    const maxY = bounds.h - wallBottomH - this.half.y - 2;
    this.pos.x = clamp(this.pos.x, minX, maxX);
    this.pos.y = clamp(this.pos.y, minY, maxY);

    if (moving) {
      this.stepTimer -= dt;
      if (this.stepTimer <= 0) {
        this.stepTimer = 0.28;
        onStepSfx?.();
      }
    } else {
      this.stepTimer = 0;
    }
  }

  private moveAxis(dx: number, dy: number, obstacles: Rect[]) {
    if (dx === 0 && dy === 0) return;
    const nextX = this.pos.x + dx;
    const nextY = this.pos.y + dy;
    const aabb = new Rect(nextX - this.half.x, nextY - this.half.y, this.half.x * 2, this.half.y * 2);

    for (let i = 0; i < obstacles.length; i++) {
      const o = obstacles[i];
      if (!aabb.intersects(o)) continue;

      if (dx !== 0) {
        if (dx > 0) {
          aabb.x = o.x - aabb.w;
        } else {
          aabb.x = o.x + o.w;
        }
      }
      if (dy !== 0) {
        if (dy > 0) {
          aabb.y = o.y - aabb.h;
        } else {
          aabb.y = o.y + o.h;
        }
      }
    }

    this.pos.x = aabb.x + this.half.x;
    this.pos.y = aabb.y + this.half.y;
  }
}
