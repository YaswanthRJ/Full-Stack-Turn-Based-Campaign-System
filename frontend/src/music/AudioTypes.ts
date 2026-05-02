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

export const FADE_DURATION = 400; // ms — sits comfortably in the 300–500ms range

export const STORAGE_KEYS = {
  musicVolume: "game_audio_musicVolume",
  sfxVolume: "game_audio_sfxVolume",
  audioEnabled: "game_audio_enabled",
} as const;
