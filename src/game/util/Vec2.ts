//Util
export class Vec2 {
  x = 0;
  y = 0;

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  set(x: number, y: number) {
    this.x = x;
    this.y = y;
    return this;
  }

  copy(v: Vec2) {
    this.x = v.x;
    this.y = v.y;
    return this;
  }

  add(v: Vec2) {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  sub(v: Vec2) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  scale(s: number) {
    this.x *= s;
    this.y *= s;
    return this;
  }

  lenSq() {
    return this.x * this.x + this.y * this.y;
  }

  len() {
    return Math.sqrt(this.lenSq());
  }

  normalize() {
    const l = this.len();
    if (l > 1e-8) {
      this.x /= l;
      this.y /= l;
    }
    return this;
  }
}
