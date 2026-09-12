/**
 * Audio Chanting & Ambient Temple Sound Engine
 * Uses Web Speech API for Sanskrit pronunciation and Web Audio API for ambient Tanpura resonance.
 */

class TanpuraEngine {
  private ctx: AudioContext | null = null;
  private oscillators: OscillatorNode[] = [];
  private gainNode: GainNode | null = null;
  private isPlaying = false;

  start(baseFreq: number = 138.59) { // C#3 (traditional Sa for Rama chanting)
    if (this.isPlaying) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(0.08, this.ctx.currentTime);
      this.gainNode.connect(this.ctx.destination);

      // Tanpura strings: Pa, Sa, Sa, Sa(lower)
      const freqs = [baseFreq * 1.5, baseFreq * 2, baseFreq * 2, baseFreq];
      
      this.oscillators = freqs.map((f, i) => {
        const osc = this.ctx!.createOscillator();
        osc.type = i === 0 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(f, this.ctx!.currentTime);
        
        // Gentle vibrato LFO
        const lfo = this.ctx!.createOscillator();
        const lfoGain = this.ctx!.createGain();
        lfo.frequency.setValueAtTime(3 + i * 0.5, this.ctx!.currentTime);
        lfoGain.gain.setValueAtTime(0.8, this.ctx!.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start();

        osc.connect(this.gainNode!);
        osc.start();
        return osc;
      });

      this.isPlaying = true;
    } catch (e) {
      console.warn('Web Audio not supported or blocked:', e);
    }
  }

  stop() {
    if (!this.isPlaying) return;
    this.oscillators.forEach(osc => {
      try { osc.stop(); } catch (e) {}
    });
    this.oscillators = [];
    if (this.ctx) {
      try { this.ctx.close(); } catch (e) {}
      this.ctx = null;
    }
    this.isPlaying = false;
  }

  toggle() {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  get active() {
    return this.isPlaying;
  }
}

export const tanpura = typeof window !== 'undefined' ? new TanpuraEngine() : (null as any);

/**
 * Speaks a Sanskrit shloka using Web Speech API
 */
export function chantVerse(sanskritText: string, onEnd?: () => void, rate: number = 0.85): SpeechSynthesisUtterance | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

  window.speechSynthesis.cancel();

  // Strip danda markers for smoother speech
  const clean = sanskritText.replace(/[।॥0-9.-]/g, ' ').trim();
  const utterance = new SpeechSynthesisUtterance(clean);
  
  // Try finding Hindi / Sanskrit voice
  const voices = window.speechSynthesis.getVoices();
  const hiVoice = voices.find(v => v.lang.startsWith('hi') || v.lang.startsWith('sa')) || voices[0];
  if (hiVoice) {
    utterance.voice = hiVoice;
  }
  utterance.rate = rate;
  utterance.pitch = 0.95;

  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = onEnd;
  }

  window.speechSynthesis.speak(utterance);
  return utterance;
}

export function stopChanting() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Synthesizes an authentic Tibetan / Hindu brass temple bell (Ghanta) chime
 */
export function playTempleBell(pitch: number = 440) {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // Harmonic partial ratios for brass bell
    const partials = [
      { ratio: 1, gain: 0.5, decay: 4.5 },
      { ratio: 2.76, gain: 0.35, decay: 3.2 },
      { ratio: 5.4, gain: 0.2, decay: 1.8 },
      { ratio: 8.93, gain: 0.12, decay: 0.9 }
    ];

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.35, now);
    masterGain.connect(ctx.destination);

    partials.forEach(p => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch * p.ratio, now);

      // Bell strike envelope: instant attack, exponential release
      gain.gain.setValueAtTime(p.gain, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + p.decay);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(now);
      osc.stop(now + p.decay);
    });

    // Cleanup context after sound completes
    setTimeout(() => {
      try { ctx.close(); } catch (e) {}
    }, 5000);
  } catch (e) {
    console.warn('Web Audio temple bell error:', e);
  }
}

/**
 * Synthesizes a sacred Conch Shell (Shankhanada) resonance
 */
export function playConchShell() {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const baseFreq = 220; // A3
    const duration = 2.8;

    // Master filter to create warm brass/horn resonance
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(320, now);
    filter.Q.setValueAtTime(3.0, now);

    const masterGain = ctx.createGain();
    // Swell envelope: blow into conch
    masterGain.gain.setValueAtTime(0.001, now);
    masterGain.gain.linearRampToValueAtTime(0.28, now + 0.6);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    // Two oscillators for rich acoustic body
    const osc1 = ctx.createOscillator();
    osc1.type = 'sawtooth';
    // Frequency bend slightly upwards as breath pressure increases
    osc1.frequency.setValueAtTime(baseFreq, now);
    osc1.frequency.linearRampToValueAtTime(baseFreq * 1.05, now + 0.8);
    osc1.frequency.exponentialRampToValueAtTime(baseFreq * 0.96, now + duration);

    const osc2 = ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(baseFreq * 1.5, now); // Fifth harmonic

    // Slight vibrato
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.setValueAtTime(4.5, now);
    lfoGain.gain.setValueAtTime(3.0, now);
    lfo.connect(lfoGain);
    lfoGain.connect(osc1.frequency);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(masterGain);
    masterGain.connect(ctx.destination);

    lfo.start(now);
    osc1.start(now);
    osc2.start(now);
    lfo.stop(now + duration);
    osc1.stop(now + duration);
    osc2.stop(now + duration);

    setTimeout(() => {
      try { ctx.close(); } catch (e) {}
    }, 3500);
  } catch (e) {
    console.warn('Web Audio conch shell error:', e);
  }
}

/**
 * Synthesizes a golden sparkle / diya light shimmer chime
 */
export function playDiyaSpark() {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const notes = [1046.5, 1318.5, 1567.98, 2093.0]; // C6, E6, G6, C7
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.1, now);
    gain.connect(ctx.destination);

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const noteGain = ctx.createGain();
      const startTime = now + i * 0.05;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      noteGain.gain.setValueAtTime(0.001, startTime);
      noteGain.gain.linearRampToValueAtTime(0.2, startTime + 0.02);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.6);

      osc.connect(noteGain);
      noteGain.connect(gain);

      osc.start(startTime);
      osc.stop(startTime + 0.65);
    });

    setTimeout(() => {
      try { ctx.close(); } catch (e) {}
    }, 1500);
  } catch (e) {
    console.warn('Web Audio diya spark error:', e);
  }
}

