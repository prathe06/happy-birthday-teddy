// Cute offline Web Audio API synthesizer for gentle music-box BGM and playful game SFX.
// Never autoplays sound; audio context is only started or resumed on explicit user action.

class SoundManager {
  private ctx: AudioContext | null = null;
  private sfxEnabled = true;
  private bgmEnabled = false;
  private bgmTimer: number | null = null;
  private noteIndex = 0;

  // Sweet music-box lullaby / birthday melody notes (in Hz)
  private readonly melody: Array<{ freq: number; dur: number }> = [
    { freq: 523.25, dur: 0.32 }, // C5
    { freq: 659.25, dur: 0.32 }, // E5
    { freq: 783.99, dur: 0.32 }, // G5
    { freq: 659.25, dur: 0.32 }, // E5
    { freq: 698.46, dur: 0.32 }, // F5
    { freq: 880.0, dur: 0.32 },  // A5
    { freq: 783.99, dur: 0.64 }, // G5
    { freq: 587.33, dur: 0.32 }, // D5
    { freq: 659.25, dur: 0.32 }, // E5
    { freq: 783.99, dur: 0.32 }, // G5
    { freq: 587.33, dur: 0.32 }, // D5
    { freq: 523.25, dur: 0.64 }, // C5
    { freq: 0, dur: 0.32 },      // rest
  ];

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
    return this.ctx;
  }

  public setSfxEnabled(enabled: boolean): void {
    this.sfxEnabled = enabled;
  }

  public isSfxEnabled(): boolean {
    return this.sfxEnabled;
  }

  public isBgmEnabled(): boolean {
    return this.bgmEnabled;
  }

  public toggleBgm(): boolean {
    if (this.bgmEnabled) {
      this.stopBgm();
      return false;
    } else {
      this.startBgm();
      return true;
    }
  }

  public startBgm(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;
    if (this.bgmEnabled) return;
    this.bgmEnabled = true;
    this.noteIndex = 0;
    this.scheduleNextBgmNote();
  }

  public stopBgm(): void {
    this.bgmEnabled = false;
    if (this.bgmTimer !== null) {
      window.clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  private scheduleNextBgmNote(): void {
    if (!this.bgmEnabled) return;
    const step = this.melody[this.noteIndex % this.melody.length];
    this.noteIndex += 1;

    if (step.freq > 0) {
      this.playTone(step.freq, step.dur * 0.9, 'sine', 0.035);
    }

    this.bgmTimer = window.setTimeout(() => {
      this.scheduleNextBgmNote();
    }, step.dur * 1000);
  }

  private playTone(
    freq: number,
    duration: number,
    type: OscillatorType = 'sine',
    volume = 0.08,
    delay = 0
  ): void {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  public playClick(): void {
    if (!this.sfxEnabled) return;
    this.playTone(620, 0.07, 'sine', 0.06);
  }

  public playHeartCollect(): void {
    if (!this.sfxEnabled) return;
    this.playTone(659.25, 0.11, 'triangle', 0.09, 0);
    this.playTone(880.0, 0.14, 'triangle', 0.09, 0.06);
    this.playTone(1046.5, 0.18, 'sine', 0.08, 0.12);
  }

  public playCorrect(): void {
    if (!this.sfxEnabled) return;
    this.playTone(523.25, 0.12, 'triangle', 0.09, 0);
    this.playTone(659.25, 0.12, 'triangle', 0.09, 0.08);
    this.playTone(783.99, 0.16, 'triangle', 0.09, 0.16);
    this.playTone(1046.5, 0.25, 'sine', 0.09, 0.24);
  }

  public playWrong(): void {
    if (!this.sfxEnabled) return;
    this.playTone(310, 0.13, 'sine', 0.07, 0);
    this.playTone(255, 0.18, 'sine', 0.07, 0.11);
  }

  public playCameraShutter(): void {
    if (!this.sfxEnabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    // Crisp mechanical shutter click + soft sparkle chime
    const bufferSize = ctx.sampleRate * 0.06;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i += 1) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1800;
    const gain = ctx.createGain();
    gain.gain.value = 0.22;

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start();

    this.playTone(880, 0.12, 'sine', 0.07, 0.09);
    this.playTone(1174.66, 0.22, 'sine', 0.07, 0.17);
  }

  public playLevelComplete(): void {
    if (!this.sfxEnabled) return;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((n, idx) => {
      this.playTone(n, 0.22, 'triangle', 0.09, idx * 0.09);
    });
  }

  public playBirthdayCelebration(): void {
    if (!this.sfxEnabled) return;
    // Happy Birthday opening phrase chime
    const seq = [
      { f: 523.25, d: 0.18, t: 0 },
      { f: 523.25, d: 0.18, t: 0.22 },
      { f: 587.33, d: 0.32, t: 0.44 },
      { f: 523.25, d: 0.32, t: 0.8 },
      { f: 698.46, d: 0.32, t: 1.16 },
      { f: 659.25, d: 0.55, t: 1.52 },
    ];
    seq.forEach((n) => {
      this.playTone(n.f, n.d, 'triangle', 0.09, n.t);
    });
  }
}

export const soundManager = new SoundManager();
