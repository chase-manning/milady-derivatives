/**
 * Procedural network-spirituality soundscape via Web Audio.
 * Inspired by miladymaker.net autoplay OST + remilia.org SoundCloud presence,
 * without shipping copyrighted audio.
 */

type BlipKind = "tap" | "hover" | "open" | "success" | "toggle";

class SoundscapeEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private ambientNodes: AudioNode[] = [];
  private ambientOn = false;
  private enabled = false;
  private lastHover = 0;

  isEnabled() {
    return this.enabled;
  }

  isAmbientOn() {
    return this.ambientOn;
  }

  private ensure() {
    if (this.ctx) return;
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    this.ctx = new Ctx();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.22;
    this.master.connect(this.ctx.destination);
    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.value = 0;
    this.ambientGain.connect(this.master);
  }

  async setEnabled(on: boolean) {
    this.ensure();
    if (!this.ctx || !this.master) return;
    if (on && this.ctx.state === "suspended") {
      await this.ctx.resume();
    }
    this.enabled = on;
    if (!on) {
      this.stopAmbient(true);
    } else {
      this.blip("toggle");
    }
  }

  async setAmbient(on: boolean) {
    if (!this.enabled) return;
    this.ensure();
    if (!this.ctx || !this.ambientGain) return;
    if (on && this.ctx.state === "suspended") await this.ctx.resume();
    if (on === this.ambientOn) return;
    if (on) this.startAmbient();
    else this.stopAmbient();
  }

  private startAmbient() {
    if (!this.ctx || !this.ambientGain) return;
    this.stopAmbient(true);
    this.ambientOn = true;
    const now = this.ctx.currentTime;
    this.ambientGain.gain.cancelScheduledValues(now);
    this.ambientGain.gain.setValueAtTime(this.ambientGain.gain.value, now);
    this.ambientGain.gain.linearRampToValueAtTime(0.14, now + 1.8);

    // Soft dual-pad + slow LFO — network spirituality drone
    const freqs = [110, 164.81, 220, 277.18];
    freqs.forEach((f, i) => {
      const osc = this.ctx!.createOscillator();
      const g = this.ctx!.createGain();
      const lfo = this.ctx!.createOscillator();
      const lfoG = this.ctx!.createGain();
      const filter = this.ctx!.createBiquadFilter();
      osc.type = i % 2 === 0 ? "sine" : "triangle";
      osc.frequency.value = f;
      filter.type = "lowpass";
      filter.frequency.value = 420 + i * 40;
      filter.Q.value = 0.7;
      g.gain.value = 0.045 / (i + 1);
      lfo.frequency.value = 0.04 + i * 0.015;
      lfoG.gain.value = 0.012;
      lfo.connect(lfoG);
      lfoG.connect(g.gain);
      osc.connect(filter);
      filter.connect(g);
      g.connect(this.ambientGain!);
      osc.start();
      lfo.start();
      this.ambientNodes.push(osc, g, lfo, lfoG, filter);
    });

    // Sparse high “ping” shimmer every few seconds
    const shimmer = () => {
      if (!this.ambientOn || !this.enabled) return;
      this.blip("hover", 0.35);
      window.setTimeout(shimmer, 4200 + Math.random() * 3800);
    };
    window.setTimeout(shimmer, 2400);
  }

  private stopAmbient(immediate = false) {
    this.ambientOn = false;
    if (!this.ctx || !this.ambientGain) {
      this.ambientNodes = [];
      return;
    }
    const now = this.ctx.currentTime;
    this.ambientGain.gain.cancelScheduledValues(now);
    this.ambientGain.gain.setValueAtTime(this.ambientGain.gain.value, now);
    this.ambientGain.gain.linearRampToValueAtTime(
      0,
      now + (immediate ? 0.05 : 0.9)
    );
    const nodes = [...this.ambientNodes];
    this.ambientNodes = [];
    window.setTimeout(
      () => {
        nodes.forEach((n) => {
          try {
            if ("stop" in n && typeof (n as OscillatorNode).stop === "function") {
              (n as OscillatorNode).stop();
            }
            n.disconnect();
          } catch {
            /* ignore */
          }
        });
      },
      immediate ? 80 : 1000
    );
  }

  blip(kind: BlipKind = "tap", volumeScale = 1) {
    if (!this.enabled) return;
    this.ensure();
    if (!this.ctx || !this.master) return;
    if (this.ctx.state === "suspended") {
      void this.ctx.resume();
    }

    if (kind === "hover") {
      const t = performance.now();
      if (t - this.lastHover < 90) return;
      this.lastHover = t;
    }

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 1800;

    const table: Record<BlipKind, { f: number; type: OscillatorType; d: number; peak: number }> = {
      tap: { f: 520, type: "triangle", d: 0.08, peak: 0.09 },
      hover: { f: 780, type: "sine", d: 0.05, peak: 0.03 },
      open: { f: 360, type: "triangle", d: 0.16, peak: 0.1 },
      success: { f: 640, type: "sine", d: 0.18, peak: 0.08 },
      toggle: { f: 440, type: "square", d: 0.1, peak: 0.05 },
    };
    const cfg = table[kind];
    osc.type = cfg.type;
    osc.frequency.setValueAtTime(cfg.f, now);
    if (kind === "open" || kind === "success") {
      osc.frequency.exponentialRampToValueAtTime(cfg.f * 1.35, now + cfg.d);
    }
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(cfg.peak * volumeScale, now + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, now + cfg.d);

    osc.connect(filter);
    filter.connect(g);
    g.connect(this.master);
    osc.start(now);
    osc.stop(now + cfg.d + 0.02);
  }
}

export const soundscape = new SoundscapeEngine();
