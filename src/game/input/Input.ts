//Input
export type KeyName =
  | "ArrowUp"
  | "ArrowDown"
  | "ArrowLeft"
  | "ArrowRight"
  | "KeyW"
  | "KeyA"
  | "KeyS"
  | "KeyD"
  | "KeyE"
  | "Escape";

export class Input {
  private down = new Map<KeyName, boolean>();
  private pressed = new Map<KeyName, boolean>();
  private enabled = true;

  setEnabled(v: boolean) {
    this.enabled = v;
    if (!v) {
      this.down.clear();
      this.pressed.clear();
    }
  }

  isDown(k: KeyName) {
    return this.down.get(k) === true;
  }

  wasPressed(k: KeyName) {
    return this.pressed.get(k) === true;
  }

  endFrame() {
    this.pressed.clear();
  }

  onKeyDown = (e: KeyboardEvent) => {
    if (!this.enabled) return;
    const code = e.code as KeyName;
    if (!this.isTracked(code)) return;
    if (!this.down.get(code)) this.pressed.set(code, true);
    this.down.set(code, true);
  };

  onKeyUp = (e: KeyboardEvent) => {
    if (!this.enabled) return;
    const code = e.code as KeyName;
    if (!this.isTracked(code)) return;
    this.down.set(code, false);
  };

  private isTracked(code: string): code is KeyName {
    return (
      code === "ArrowUp" ||
      code === "ArrowDown" ||
      code === "ArrowLeft" ||
      code === "ArrowRight" ||
      code === "KeyW" ||
      code === "KeyA" ||
      code === "KeyS" ||
      code === "KeyD" ||
      code === "KeyE" ||
      code === "Escape"
    );
  }
}
