export type LoopType = "home" | "combat";
export type SfxType = "victory" | "defeat" | "campaignVictory";

export interface AudioState {
  currentLoop: LoopType | null;
  isUnlocked: boolean;
  isReady: boolean;
  musicVolume: number;
  sfxVolume: number;
  audioEnabled: boolean;
}

export interface AudioContextValue extends AudioState {
  playLoop: (loop: LoopType) => void;
  stopLoop: () => void;
  playSfx: (sfx: SfxType) => void;
  setMusicVolume: (v: number) => void;
  setSfxVolume: (v: number) => void;
  muteAll: (muted: boolean) => void;
  unlockAudio: () => void;
}

export const AUDIO_PATHS: Record<LoopType | SfxType, string> = {
  home: "/audio/music/home.ogg",
  combat: "/audio/music/combat.ogg",
  victory: "/audio/music/victory.ogg",
  defeat: "/audio/music/defeat.ogg",
  campaignVictory: "/audio/music/campaign.ogg",
};

export const LOOP_KEYS: LoopType[] = ["home", "combat"];
export const SFX_KEYS: SfxType[] = ["victory", "defeat", "campaignVictory"];

/** Crossfade duration when switching between loops, or fading out via stopLoop(). */
export const FADE_DURATION = 1000;

/** How long a cold-start loop fades in from silence (no previous loop playing). */
export const LOOP_FADE_IN = 1500;

/** BGM volume multiplier applied while an SFX is active (30% of full volume). */
export const DUCK_LEVEL = 0.3;

/** Time in ms to fade BGM down when an SFX starts. */
export const DUCK_FADE_DOWN = 200;

/** Time in ms to fade BGM back up after all SFX have finished. */
export const DUCK_FADE_UP = 600;

export const STORAGE_KEYS = {
  musicVolume: "game_audio_musicVolume",
  sfxVolume: "game_audio_sfxVolume",
  audioEnabled: "game_audio_enabled",
} as const;