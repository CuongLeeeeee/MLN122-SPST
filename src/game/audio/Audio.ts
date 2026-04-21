//Audio
export type VolumeState = {
  master: number;
  music: number;
  sfx: number;
};

const DEFAULT_VOL: VolumeState = { master: 0.9, music: 0.35, sfx: 0.7 };

export class AudioSystem {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;

  private musicOscA: OscillatorNode | null = null;
  private musicOscB: OscillatorNode | null = null;
  private musicLfo: OscillatorNode | null = null;
  private musicLfoGain: GainNode | null = null;

  private vol: VolumeState = { ...DEFAULT_VOL };

  getVolume() {
    return { ...this.vol };
  }

  setVolume(v: Partial<VolumeState>) {
    this.vol = { ...this.vol, ...v };
    this.applyVolumes();
  }

  isReady() {
    return !!this.ctx;
  }

  async ensureStarted() {
    if (this.ctx) {
      if (this.ctx.state === "suspended") await this.ctx.resume();
      return;
    }
    const w = window as Window & { webkitAudioContext?: typeof AudioContext };
    const Ctx = window.AudioContext || w.webkitAudioContext;
    this.ctx = new Ctx();

    this.masterGain = this.ctx.createGain();
    this.musicGain = this.ctx.createGain();
    this.sfxGain = this.ctx.createGain();

    this.musicGain.connect(this.masterGain);
    this.sfxGain.connect(this.masterGain);
    this.masterGain.connect(this.ctx.destination);

    this.applyVolumes();
    // Background music disabled by default (per project requirement).
    // Keep the graph ready for SFX and allow music to be re-enabled later if desired.
  }

  async suspend() {
    if (!this.ctx) return;
    if (this.ctx.state === "running") await this.ctx.suspend();
  }

  async resume() {
    if (!this.ctx) return;
    if (this.ctx.state === "suspended") await this.ctx.resume();
  }

  private applyVolumes() {
    if (!this.masterGain || !this.musicGain || !this.sfxGain) return;
    this.masterGain.gain.value = this.vol.master;
    this.musicGain.gain.value = this.vol.music;
    this.sfxGain.gain.value = this.vol.sfx;
  }

  private startMusic() {
    if (!this.ctx || !this.musicGain) return;
    this.stopMusic();

    const t0 = this.ctx.currentTime;

    // Simple museum ambience: two sine tones + slow LFO
    const oscA = this.ctx.createOscillator();
    oscA.type = "sine";
    oscA.frequency.value = 110;

    const oscB = this.ctx.createOscillator();
    oscB.type = "sine";
    oscB.frequency.value = 165;

    const lfo = this.ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 0.12;

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 8;

    lfo.connect(lfoGain);
    lfoGain.connect(oscB.frequency);

    const mix = this.ctx.createGain();
    mix.gain.value = 0.7;

    oscA.connect(mix);
    oscB.connect(mix);
    mix.connect(this.musicGain);

    oscA.start(t0);
    oscB.start(t0);
    lfo.start(t0);

    this.musicOscA = oscA;
    this.musicOscB = oscB;
    this.musicLfo = lfo;
    this.musicLfoGain = lfoGain;
  }

  private stopMusic() {
    try {
      this.musicOscA?.stop();
      this.musicOscB?.stop();
      this.musicLfo?.stop();
    } catch {
      // ignore
    }
    this.musicOscA = null;
    this.musicOscB = null;
    this.musicLfo = null;
    this.musicLfoGain = null;
  }

  private blip(freq: number, durMs: number, type: OscillatorType) {
    if (!this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);

    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.45, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + durMs / 1000);

    osc.connect(g);
    g.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + durMs / 1000 + 0.02);
  }

  playMoveStep() {
    this.blip(180, 40, "square");
  }

  playInteract() {
    this.blip(520, 70, "triangle");
  }

  playDoor() {
    this.blip(300, 120, "sawtooth");
  }
}
