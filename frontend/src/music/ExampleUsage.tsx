import React, { useState } from "react";
import { AudioProvider, useAudio } from "./AudioProvider";
import { useLoopScreen } from "./useLoopScreen";

// ---------------------------------------------------------------------------
// Audio Unlock Gate
// ---------------------------------------------------------------------------
// Wraps any subtree. On first tap/click anywhere it calls unlockAudio() so
// the Web Audio context is resumed before we try to play anything.

export const AudioUnlockGate: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isUnlocked, unlockAudio } = useAudio();

  const handleInteraction = () => {
    if (!isUnlocked) unlockAudio();
  };

  return (
    // Capture phase so we get the event before any child handler
    <div onClickCapture={handleInteraction} onTouchStartCapture={handleInteraction}>
      {children}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Loading overlay — shown until AudioProvider finishes preloading
// ---------------------------------------------------------------------------

export const AudioReadyGate: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isReady } = useAudio();
  if (!isReady) {
    return (
      <div style={styles.overlay}>
        <p style={styles.loadingText}>Loading audio…</p>
      </div>
    );
  }
  return <>{children}</>;
};

// ---------------------------------------------------------------------------
// Home Screen
// ---------------------------------------------------------------------------

export const HomeScreen: React.FC<{ onNavigateToCombat: () => void }> = ({
  onNavigateToCombat,
}) => {
  // Starts "home" BGM when mounted (crossfades from whatever was playing)
  useLoopScreen("home");
  const { playSfx } = useAudio();

  return (
    <div style={styles.screen}>
      <h1 style={styles.title}>🏠 Home</h1>
      <p style={styles.subtitle}>Background: "home" loop is playing</p>

      <div style={styles.row}>
        <button style={styles.btn} onClick={() => playSfx("victory")}>
          🏆 SFX: Victory
        </button>
        <button style={styles.btn} onClick={() => playSfx("defeat")}>
          💀 SFX: Defeat
        </button>
        <button style={styles.btn} onClick={() => playSfx("campaignVictory")}>
          🎖️ SFX: Campaign Victory
        </button>
      </div>

      <button style={{ ...styles.btn, ...styles.navBtn }} onClick={onNavigateToCombat}>
        ⚔️ Go to Combat →
      </button>

      <AudioControls />
    </div>
  );
};

// ---------------------------------------------------------------------------
// Combat Screen
// ---------------------------------------------------------------------------

export const CombatScreen: React.FC<{ onNavigateToHome: () => void }> = ({
  onNavigateToHome,
}) => {
  // Crossfades from "home" → "combat" automatically
  useLoopScreen("combat");
  const { playSfx } = useAudio();

  return (
    <div style={{ ...styles.screen, background: "#1a0505" }}>
      <h1 style={styles.title}>⚔️ Combat</h1>
      <p style={styles.subtitle}>Background: "combat" loop is playing</p>

      <div style={styles.row}>
        <button style={styles.btn} onClick={() => playSfx("victory")}>
          🏆 SFX: Victory
        </button>
        <button style={styles.btn} onClick={() => playSfx("defeat")}>
          💀 SFX: Defeat
        </button>
        <button style={styles.btn} onClick={() => playSfx("campaignVictory")}>
          🎖️ SFX: Campaign Victory
        </button>
      </div>

      <button style={{ ...styles.btn, ...styles.navBtn }} onClick={onNavigateToHome}>
        ← Back to Home
      </button>

      <AudioControls />
    </div>
  );
};

// ---------------------------------------------------------------------------
// Audio Controls Panel (settings)
// ---------------------------------------------------------------------------

const AudioControls: React.FC = () => {
  const {
    musicVolume,
    sfxVolume,
    audioEnabled,
    currentLoop,
    isUnlocked,
    setMusicVolume,
    setSfxVolume,
    muteAll,
    stopLoop,
  } = useAudio();

  return (
    <div style={styles.controls}>
      <h3 style={styles.controlTitle}>🎛️ Audio Controls</h3>

      <label style={styles.label}>
        Music Volume: {Math.round(musicVolume * 100)}%
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={musicVolume}
          onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
          style={styles.slider}
        />
      </label>

      <label style={styles.label}>
        SFX Volume: {Math.round(sfxVolume * 100)}%
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={sfxVolume}
          onChange={(e) => setSfxVolume(parseFloat(e.target.value))}
          style={styles.slider}
        />
      </label>

      <div style={styles.row}>
        <button
          style={{ ...styles.btn, background: audioEnabled ? "#555" : "#c0392b" }}
          onClick={() => muteAll(audioEnabled)}
        >
          {audioEnabled ? "🔊 Mute All" : "🔇 Unmute All"}
        </button>

        <button style={styles.btn} onClick={stopLoop}>
          ⏹ Stop Loop
        </button>
      </div>

      <div style={styles.status}>
        <span>Loop: <b>{currentLoop ?? "none"}</b></span>
        <span>Unlocked: <b>{isUnlocked ? "✅" : "❌"}</b></span>
        <span>Muted: <b>{!audioEnabled ? "✅" : "❌"}</b></span>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Root demo — ties everything together
// ---------------------------------------------------------------------------

type Screen = "home" | "combat";

export const AudioDemo: React.FC = () => {
  const [screen, setScreen] = useState<Screen>("home");

  return (
    // AudioProvider must be an ancestor of everything that calls useAudio()
    <AudioProvider>
      <AudioUnlockGate>
        <AudioReadyGate>
          {screen === "home" ? (
            <HomeScreen onNavigateToCombat={() => setScreen("combat")} />
          ) : (
            <CombatScreen onNavigateToHome={() => setScreen("home")} />
          )}
        </AudioReadyGate>
      </AudioUnlockGate>
    </AudioProvider>
  );
};

// ---------------------------------------------------------------------------
// Minimal inline styles (swap for Tailwind / CSS modules in production)
// ---------------------------------------------------------------------------

const styles: Record<string, React.CSSProperties> = {
  screen: {
    minHeight: "100vh",
    background: "#0d0d1a",
    color: "#eee",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "2rem 1rem",
    gap: "1rem",
    fontFamily: "system-ui, sans-serif",
  },
  title: { fontSize: "2rem", margin: 0 },
  subtitle: { color: "#aaa", margin: 0 },
  row: { display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" },
  btn: {
    padding: "0.6rem 1.1rem",
    background: "#2a2a4a",
    color: "#fff",
    border: "1px solid #444",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.9rem",
    transition: "background 0.2s",
  },
  navBtn: { background: "#1a3a5c", marginTop: "0.5rem" },
  controls: {
    marginTop: "1.5rem",
    background: "#111",
    border: "1px solid #333",
    borderRadius: "12px",
    padding: "1.25rem 1.5rem",
    width: "100%",
    maxWidth: "480px",
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  controlTitle: { margin: 0, fontSize: "1rem" },
  label: { display: "flex", flexDirection: "column", gap: "0.25rem", fontSize: "0.85rem", color: "#bbb" },
  slider: { width: "100%", accentColor: "#7c6af7" },
  status: { display: "flex", gap: "1rem", flexWrap: "wrap", fontSize: "0.8rem", color: "#888" },
  overlay: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#0d0d1a",
  },
  loadingText: { color: "#aaa", fontSize: "1.2rem" },
};
