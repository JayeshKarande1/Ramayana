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
