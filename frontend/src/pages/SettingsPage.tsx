import { useState } from "react";

export function SettingsPage() {
  const [audioEnabled, setAudioEnabled] = useState(true);

  return (
    <div
      className="relative flex flex-col overflow-hidden"
      style={{ height: "calc(100vh - 64px)" }}
    >
      {/* Background (simple) */}
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
          <div className="flex items-center justify-between">
            <span className="text-xs font-black tracking-widest uppercase text-purple-200">
              Audio
            </span>

            <ToggleButton
              enabled={audioEnabled}
              onClick={() => setAudioEnabled((prev) => !prev)}
            />
          </div>

          <p className="text-xs text-purple-300 opacity-70">
            Turn game sounds on or off.
          </p>
        </div>
      </div>
    </div>
  );
}

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