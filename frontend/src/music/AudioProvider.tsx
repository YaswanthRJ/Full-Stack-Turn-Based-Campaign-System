import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Howl, Howler } from "howler";
import { type AudioContextValue, type AudioState, type LoopType, type SfxType, LOOP_KEYS, SFX_KEYS, AUDIO_PATHS, FADE_DURATION, STORAGE_KEYS } from "./AudioTypes";


// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function loadPref<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function savePref(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore quota / private-mode errors
  }
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const AudioCtx = createContext<AudioContextValue | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // ── Persisted initial values ─────────────────────────────────────────────
  const initMusicVol = Math.min(1, Math.max(0, loadPref<number>(STORAGE_KEYS.musicVolume, 0.7)));
  const initSfxVol   = Math.min(1, Math.max(0, loadPref<number>(STORAGE_KEYS.sfxVolume,   1.0)));
  const initEnabled  = loadPref<boolean>(STORAGE_KEYS.audioEnabled, true);

  // ── Component state ──────────────────────────────────────────────────────
  const [state, setState] = useState<AudioState>({
    currentLoop: null,
    isUnlocked: false,
    isReady: false,
    musicVolume: initMusicVol,
    sfxVolume: initSfxVol,
    audioEnabled: initEnabled,
  });

  // ── Howl references ──────────────────────────────────────────────────────
  // Key → singleton Howl (BGM loops use single Howl instance per track)
  const loopHowls = useRef<Partial<Record<LoopType, Howl>>>({});
  // SFX Howl pool — each SfxType has one Howl configured for multi-instance playback
  const sfxHowls = useRef<Partial<Record<SfxType, Howl>>>({});

  // Track which loop is *currently fading in / playing* so race conditions
  // (rapid calls to playLoop) are handled cleanly.
  const activeLoopRef = useRef<LoopType | null>(null);
  // Per-loop fade-out timers — keyed by LoopType so rapid A→B→C crossfades
  // don't cancel the stop-timer of a loop that is still fading out.
  const fadeOutTimers = useRef<Partial<Record<LoopType, ReturnType<typeof setTimeout>>>>({});

  // Latest volume refs — allows Howl callbacks to read current values without
  // stale-closure issues.
  const musicVolRef = useRef(initMusicVol);
  const sfxVolRef = useRef(initSfxVol);
  const enabledRef = useRef(initEnabled);

  // ── Preload on mount ─────────────────────────────────────────────────────
  useEffect(() => {
    let loadedCount = 0;
    const total = LOOP_KEYS.length + SFX_KEYS.length;

    const onLoad = () => {
      loadedCount += 1;
      if (loadedCount >= total) {
        setState((s) => ({ ...s, isReady: true }));
      }
    };

    // BGM loops
    LOOP_KEYS.forEach((key) => {
      const howl = new Howl({
        src: [AUDIO_PATHS[key]],
        loop: true,
        volume: 0, // always start silent; we fade in
        preload: true,
        html5: false, // Web Audio for crossfade precision
        onload: onLoad,
        onloaderror: (_id, err) => {
          console.warn(`[AudioProvider] Failed to load BGM "${key}":`, err);
          onLoad(); // still count toward total so isReady resolves
        },
      });
      loopHowls.current[key] = howl;
    });

    // SFX (allow multiple simultaneous plays via pool)
    SFX_KEYS.forEach((key) => {
      const howl = new Howl({
        src: [AUDIO_PATHS[key]],
        loop: false,
        volume: sfxVolRef.current,
        preload: true,
        html5: false,
        onload: onLoad,
        onloaderror: (_id, err) => {
          console.warn(`[AudioProvider] Failed to load SFX "${key}":`, err);
          onLoad();
        },
      });
      sfxHowls.current[key] = howl;
    });

    return () => {
      // Cleanup all Howls on unmount
      Object.values(loopHowls.current).forEach((h) => h?.unload());
      Object.values(sfxHowls.current).forEach((h) => h?.unload());
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── unlockAudio ──────────────────────────────────────────────────────────
  // Mobile browsers suspend AudioContext until a user gesture. Call this
  // inside any touch/click handler on first interaction.
  const unlockAudio = useCallback(() => {
    if (Howler.ctx && Howler.ctx.state === "suspended") {
      Howler.ctx.resume().then(() => {
        setState((s) => ({ ...s, isUnlocked: true }));
      });
    } else {
      setState((s) => ({ ...s, isUnlocked: true }));
    }
  }, []);

  // ── Internal helpers ─────────────────────────────────────────────────────

  /** Fade out a specific loop howl and stop it after the fade completes. */
  const fadeOutLoop = useCallback(
    (loopKey: LoopType, duration: number, onDone?: () => void) => {
      const howl = loopHowls.current[loopKey];
      if (!howl || !howl.playing()) {
        onDone?.();
        return;
      }
      // Cancel any existing fade-out timer for THIS loop before starting a new one
      const existing = fadeOutTimers.current[loopKey];
      if (existing !== undefined) clearTimeout(existing);

      howl.fade(howl.volume(), 0, duration);
      fadeOutTimers.current[loopKey] = setTimeout(() => {
        howl.stop();
        howl.volume(0);
        delete fadeOutTimers.current[loopKey];
        onDone?.();
      }, duration);
    },
    []
  );

  // ── playLoop ─────────────────────────────────────────────────────────────
  const playLoop = useCallback(
    (newLoop: LoopType) => {
      if (!enabledRef.current) return;

      // No-op if same loop already active
      if (activeLoopRef.current === newLoop) return;

      const prevLoop = activeLoopRef.current;
      activeLoopRef.current = newLoop;

      const targetVol = musicVolRef.current;
      const newHowl = loopHowls.current[newLoop];
      if (!newHowl) return;

      // Start new loop at silence then fade in
      newHowl.volume(0);
      if (!newHowl.playing()) newHowl.play();
      newHowl.fade(0, targetVol, FADE_DURATION);

      setState((s) => ({ ...s, currentLoop: newLoop }));

      // Fade out old loop simultaneously (crossfade)
      if (prevLoop && prevLoop !== newLoop) {
        fadeOutLoop(prevLoop, FADE_DURATION);
      }
    },
    [fadeOutLoop]
  );

  // ── stopLoop ─────────────────────────────────────────────────────────────
  const stopLoop = useCallback(() => {
    const cur = activeLoopRef.current;
    if (!cur) return;

    activeLoopRef.current = null;
    setState((s) => ({ ...s, currentLoop: null }));

    fadeOutLoop(cur, FADE_DURATION);
  }, [fadeOutLoop]);

  // ── playSfx ──────────────────────────────────────────────────────────────
  const playSfx = useCallback((sfx: SfxType) => {
    if (!enabledRef.current) return;
    const howl = sfxHowls.current[sfx];
    if (!howl) return;
    // Play returns a sound ID; set volume on that ID only so concurrent
    // instances of the same SFX don't overwrite each other's volume.
    const id = howl.play();
    howl.volume(sfxVolRef.current, id);
  }, []);

  // ── setMusicVolume ────────────────────────────────────────────────────────
  const setMusicVolume = useCallback((v: number) => {
    const clamped = Math.min(1, Math.max(0, v));
    musicVolRef.current = clamped;
    savePref(STORAGE_KEYS.musicVolume, clamped);
    setState((s) => ({ ...s, musicVolume: clamped }));

    // Apply immediately to any playing loop
    const cur = activeLoopRef.current;
    if (cur) {
      const howl = loopHowls.current[cur];
      if (howl?.playing()) howl.volume(clamped);
    }
  }, []);

  // ── setSfxVolume ──────────────────────────────────────────────────────────
  const setSfxVolume = useCallback((v: number) => {
    const clamped = Math.min(1, Math.max(0, v));
    sfxVolRef.current = clamped;
    savePref(STORAGE_KEYS.sfxVolume, clamped);
    setState((s) => ({ ...s, sfxVolume: clamped }));
    // SFX volume is read from ref at play-time; no need to update existing sounds.
  }, []);

  // ── muteAll ───────────────────────────────────────────────────────────────
  const muteAll = useCallback((muted: boolean) => {
    enabledRef.current = !muted;
    savePref(STORAGE_KEYS.audioEnabled, !muted);
    setState((s) => ({ ...s, audioEnabled: !muted }));

    if (muted) {
      Howler.volume(0);
    } else {
      Howler.volume(1);
      // Restore individual volumes
      const cur = activeLoopRef.current;
      if (cur) {
        loopHowls.current[cur]?.volume(musicVolRef.current);
      }
    }
  }, []);

  // ── Apply audioEnabled on mount (e.g. user had it disabled last session) ─
  useEffect(() => {
    if (!initEnabled) {
      Howler.volume(0);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Context value ─────────────────────────────────────────────────────────
  const value: AudioContextValue = {
    ...state,
    playLoop,
    stopLoop,
    playSfx,
    setMusicVolume,
    setSfxVolume,
    muteAll,
    unlockAudio,
  };

  return <AudioCtx.Provider value={value}>{children}</AudioCtx.Provider>;
};

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useAudio(): AudioContextValue {
  const ctx = useContext(AudioCtx);
  if (!ctx) {
    throw new Error("useAudio must be used inside <AudioProvider>");
  }
  return ctx;
}
