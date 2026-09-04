/**
 * 🔊 FoodLine Voice Announcer & Digital SoundBox Engine
 * Web Audio API Two-Tone Chime + Web Speech Synthesis Multilingual Queue (en-IN, hi-IN, mr-IN)
 */

import { SoundSettings } from './types';

const STORAGE_KEY = 'foodline_tv_sound_settings';

export const DEFAULT_SOUND_SETTINGS: SoundSettings = {
  enabled: true,
  volume: 0.85,
  lang: 'en-IN',
};

export function getSoundSettings(): SoundSettings {
  if (typeof window === 'undefined') return DEFAULT_SOUND_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_SOUND_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    console.warn('Failed to parse sound settings from localStorage:', e);
  }
  return DEFAULT_SOUND_SETTINGS;
}

export function saveSoundSettings(settings: SoundSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.warn('Failed to save sound settings to localStorage:', e);
  }
}

let sharedAudioCtx: AudioContext | null = null;

export function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!sharedAudioCtx) {
    const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioCtxClass) {
      sharedAudioCtx = new AudioCtxClass();
    }
  }
  return sharedAudioCtx;
}

/**
 * 🔔 Play High-Quality 2-Tone Airport/Metro Announcement Chime (D5 -> A5)
 */
export async function playChime(volume: number = 0.85): Promise<void> {
  const ctx = getAudioContext();
  if (!ctx) return;

  if (ctx.state === 'suspended') {
    try {
      await ctx.resume();
    } catch (e) {
      console.warn('Could not resume audio context:', e);
      return;
    }
  }

  const frequencies = [587.33, 880.0]; // D5 -> A5
  const toneDuration = 0.22;
  const startTime = ctx.currentTime;

  frequencies.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime + idx * toneDuration);

    const toneStart = startTime + idx * toneDuration;
    const toneEnd = toneStart + toneDuration;

    gain.gain.setValueAtTime(0.001, toneStart);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.01, volume * 0.4), toneStart + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, toneEnd);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(toneStart);
    osc.stop(toneEnd);
  });

  return new Promise((resolve) => setTimeout(resolve, frequencies.length * toneDuration * 1000 + 100));
}

interface QueuedAnnouncement {
  token: string;
  counter: 1 | 2;
  isCod?: boolean;
  lang: 'en-IN' | 'hi-IN' | 'mr-IN';
  volume: number;
}

const announcementQueue: QueuedAnnouncement[] = [];
let isProcessingQueue = false;

async function processNextInQueue() {
  if (isProcessingQueue || announcementQueue.length === 0) return;
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  isProcessingQueue = true;
  const item = announcementQueue.shift()!;

  try {
    // 1. Play synthesized chime
    await playChime(item.volume);
    await new Promise((r) => setTimeout(r, 150));

    // 2. Format phonetic token (e.g. FL-1793 -> "F L 1 7 9 3")
    const cleanNum = item.token.replace('FL-', '');
    const spokenToken = `F L ${cleanNum.split('').join(' ')}`;

    const phrases: Record<string, string> = {
      'en-IN': `Token ${spokenToken}, please collect your order at Counter ${item.counter}.`,
      'hi-IN': `टोकन ${spokenToken}, कृपया काउंटर ${item.counter} से अपना ऑर्डर प्राप्त करें।`,
      'mr-IN': `टोकन ${spokenToken}, कृपया काउंटर ${item.counter} वरून तुमची ऑर्डर घ्या.`,
    };

    const textToSpeak = phrases[item.lang] || phrases['en-IN'];
    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    utterance.lang = item.lang;
    utterance.volume = item.volume;
    utterance.rate = 0.92;
    utterance.pitch = 1.05;

    // Pick best available voice for language
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find((v) => v.lang === item.lang || v.lang.startsWith(item.lang.split('-')[0]));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    await new Promise<void>((resolve) => {
      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
      window.speechSynthesis.speak(utterance);
    });

    // Pause between announcements
    await new Promise((r) => setTimeout(r, 600));
  } catch (err) {
    console.error('Error during voice announcement:', err);
  } finally {
    isProcessingQueue = false;
    if (announcementQueue.length > 0) {
      processNextInQueue();
    }
  }
}

/**
 * 📣 Announce order ready at Counter with COD and multilingual support
 */
export async function announceOrderReady(
  token: string,
  counter: 1 | 2 = 1,
  isCod?: boolean,
  customSettings?: SoundSettings
): Promise<void> {
  const settings = customSettings || getSoundSettings();
  if (!settings.enabled) return;

  announcementQueue.push({
    token,
    counter,
    isCod,
    lang: settings.lang,
    volume: settings.volume,
  });

  processNextInQueue();
}

/**
 * 🧪 Test Sound & Voice Synthesis
 */
export async function playTestChime(customSettings?: SoundSettings): Promise<void> {
  const settings = customSettings || getSoundSettings();
  await announceOrderReady('FL-1793', 1, false, settings);
}
