//Util
export class Rect {
  x: number;
  y: number;
  w: number;
  h: number;

  constructor(x = 0, y = 0, w = 0, h = 0) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  set(x: number, y: number, w: number, h: number) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    return this;
  }

  containsPoint(px: number, py: number) {
    return px >= this.x && px <= this.x + this.w && py >= this.y && py <= this.y + this.h;
  }

  intersects(r: Rect) {
    return !(
      r.x > this.x + this.w ||
      r.x + r.w < this.x ||
      r.y > this.y + this.h ||
      r.y + r.h < this.y
    );
  }
}
