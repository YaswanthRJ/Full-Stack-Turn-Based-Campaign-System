import { useAudio } from "../music";

export function SettingsPage() {
  const {
    audioEnabled,
    musicVolume,
    sfxVolume,
    muteAll,
    setMusicVolume,
    setSfxVolume,
  } = useAudio();

  return (
    <div
      className="relative flex flex-col overflow-hidden"
      style={{ height: "calc(100vh - 64px)" }}
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute rounded-full"
          style={{
            width: 220,
            height: 220,
            left: "15%",
            top: "10%",
            background: "radial-gradient(circle, #7c3aed33 0%, transparent 70%)",
            filter: "blur(30px)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 160,
            height: 160,
            left: "70%",
            top: "55%",
            background: "radial-gradient(circle, #e879f933 0%, transparent 70%)",
            filter: "blur(30px)",
          }}
        />
      </div>

      <div className="relative flex flex-col flex-1 px-6 pt-14 pb-10 gap-10 items-center">
        <h1
          className="font-black tracking-widest uppercase text-center leading-none"
          style={{
            fontSize: "2rem",
            background:
              "linear-gradient(90deg, #c084fc 0%, #e879f9 40%, #818cf8 80%, #a855f7 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "0.12em",
          }}
        >
          Settings
        </h1>

        <div
          className="w-full max-w-sm rounded-2xl p-6 flex flex-col gap-6"
          style={{
            background: "linear-gradient(135deg, #0d0018 0%, #1e003a 100%)",
            border: "1px solid #7c3aed66",
            boxShadow: "0 0 14px #7c3aed22",
          }}
        >
          {/* Audio on/off toggle */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-black tracking-widest uppercase text-purple-200">
              Audio
            </span>
            <ToggleButton
              enabled={audioEnabled}
              onClick={() => muteAll(audioEnabled)}
            />
          </div>

          {/* Music volume */}
          <VolumeRow
            label="Music"
            value={musicVolume}
            disabled={!audioEnabled}
            onChange={setMusicVolume}
          />

          {/* SFX volume */}
          <VolumeRow
            label="Sound FX"
            value={sfxVolume}
            disabled={!audioEnabled}
            onChange={setSfxVolume}
          />

          <p className="text-xs text-purple-300 opacity-70">
            Settings are saved automatically.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ToggleButton({
  enabled,
  onClick,
}: {
  enabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="relative w-14 h-8 rounded-full transition-all duration-200"
      style={{
        background: enabled
          ? "linear-gradient(135deg, #2e1065 0%, #7c3aed 100%)"
          : "rgba(255,255,255,0.08)",
        border: enabled ? "1px solid #a855f766" : "1px solid #374151",
        boxShadow: enabled ? "0 0 12px #7c3aed33" : "none",
      }}
    >
      <div
        className="absolute top-1 w-6 h-6 rounded-full transition-all duration-200"
        style={{
          left: enabled ? "28px" : "4px",
          background: enabled ? "#e9d5ff" : "#9ca3af",
        }}
      />
    </button>
  );
}

function VolumeRow({
  label,
  value,
  disabled,
  onChange,
}: {
  label: string;
  value: number;
  disabled: boolean;
  onChange: (v: number) => void;
}) {
  return (
    <div
      className="flex flex-col gap-2 transition-opacity duration-200"
      style={{ opacity: disabled ? 0.35 : 1 }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-black tracking-widest uppercase text-purple-200">
          {label}
        </span>
        <span
          className="text-xs font-bold tabular-nums"
          style={{ color: "#c084fc", minWidth: "2.5rem", textAlign: "right" }}
        >
          {Math.round(value * 100)}%
        </span>
      </div>

      <div className="relative flex items-center" style={{ height: 20 }}>
        {/* Track background */}
        <div
          className="absolute inset-y-0 my-auto w-full rounded-full"
          style={{ height: 4, background: "rgba(255,255,255,0.08)" }}
        />
        {/* Filled portion */}
        <div
          className="absolute inset-y-0 my-auto rounded-full transition-all duration-75"
          style={{
            height: 4,
            width: `${value * 100}%`,
            background: "linear-gradient(90deg, #7c3aed, #e879f9)",
          }}
        />
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="absolute w-full cursor-pointer"
          style={{
            appearance: "none",
            WebkitAppearance: "none",
            background: "transparent",
            height: 20,
            margin: 0,
            padding: 0,
          }}
        />
      </div>

      <style>{sliderThumbCss}</style>
    </div>
  );
}

// Scoped CSS for the range thumb — matches the purple theme.
const sliderThumbCss = `
  input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #e9d5ff;
    border: 2px solid #7c3aed;
    box-shadow: 0 0 6px #7c3aed55;
    cursor: pointer;
  }
  input[type=range]::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #e9d5ff;
    border: 2px solid #7c3aed;
    box-shadow: 0 0 6px #7c3aed55;
    cursor: pointer;
  }
  input[type=range]:disabled::-webkit-slider-thumb { cursor: not-allowed; }
  input[type=range]:disabled::-moz-range-thumb    { cursor: not-allowed; }
`;