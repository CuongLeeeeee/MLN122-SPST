//Util
// Deterministic-ish RNG (mulberry32) for repeatable shuffles if needed.
export class RNG {
  private state: number;

  constructor(seed: number) {
    this.state = seed >>> 0;
  }

  next() {
    // mulberry32
    let t = (this.state += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    const r = ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    return r;
  }

  int(min: number, maxInclusive: number) {
    return min + Math.floor(this.next() * (maxInclusive - min + 1));
  }
}
