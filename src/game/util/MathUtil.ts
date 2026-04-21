//Util
export function clamp(v: number, min: number, max: number) {
  return v < min ? min : v > max ? max : v;
}

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function nowMs() {
  return typeof performance !== "undefined" ? performance.now() : Date.now();
}

export function shuffleInPlace<T>(arr: T[], rnd = Math.random) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
}
