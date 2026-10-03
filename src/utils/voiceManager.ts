// SpeechSynthesis Voice Narrator for Speci-X Digital Twin
class IndustrialVoiceManager {
  private isEnabled: boolean = true;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  public setEnabled(val: boolean) {
    this.isEnabled = val;
    if (!val) {
      this.cancel();
    }
  }

  public getEnabled(): boolean {
    return this.isEnabled;
  }

  public speak(text: string, rate = 1.05, pitch = 1.0) {
    if (!this.isEnabled) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    this.cancel();

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = 0.85;

      // Select natural English voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(
        (v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('David'))
      );
      if (preferred) {
        utterance.voice = preferred;
      }

      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    } catch {
      // SpeechSynthesis graceful fallback
    }
  }

  public cancel() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
  }
}

export const voiceManager = new IndustrialVoiceManager();
