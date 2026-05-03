import { Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import { Layout } from "./layout/Layout";
import { Home } from "./pages/Home";
import { Campaigns } from "./pages/Campaigns";
import { Creatures } from "./pages/Creatures";
import { GameProvider } from "./context/GameProvider";
import { AuthProvider } from "./context/AuthProvider";
import { GameScreen } from "./pages/GameScreen";
import { AuthForm } from "./pages/AuthForm";
import { UserStatsPage } from "./pages/UserStatsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { AudioProvider, AudioUnlockGate } from "./music";
import { IntroScreen } from "./pages/IntroScreen";

// ── Desktop block ──────────────────────────────────────────────────────────
function DesktopBlock() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white text-center p-6">
      <div>
        <h1 className="text-xl font-semibold">
          This app is designed for mobile and tablet screens
        </h1>
        <p className="mt-2 text-gray-400">
          Please switch to a smaller screen or enable mobile view
        </p>
      </div>
    </div>
  );
}

const DESKTOP_QUERY = window.matchMedia("(min-width: 768px)");

// ── App ────────────────────────────────────────────────────────────────────
function App() {
  const [isDesktop, setIsDesktop] = useState(DESKTOP_QUERY.matches);
  const [introSeen, setIntroSeen] = useState(() => {
    return sessionStorage.getItem("introSeen") === "1";
  });

  useEffect(() => {
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    DESKTOP_QUERY.addEventListener("change", handler);
    return () => DESKTOP_QUERY.removeEventListener("change", handler);
  }, []);

  if (isDesktop) return <DesktopBlock />;

  if (!introSeen) {
    return (
      <AuthProvider>
        <GameProvider>
          <AudioProvider>
            <AudioUnlockGate>
              {!introSeen ? (
                <IntroScreen
                  onStart={() => {
                    sessionStorage.setItem("introSeen", "1");
                    setIntroSeen(true);
                  }}
                />
              ) : (
                <Routes>
                  <Route element={<Layout />}>
                    <Route path="/" element={<Home />} />
                    ...
                  </Route>
                </Routes>
              )}
            </AudioUnlockGate>
          </AudioProvider>
        </GameProvider>
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <GameProvider>
        <AudioProvider>
          <AudioUnlockGate>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/campaigns" element={<Campaigns />} />
                <Route path="/creatures/:campaignId" element={<Creatures />} />
                <Route path="/game" element={<GameScreen />} />
                <Route path="/auth" element={<AuthForm />} />
                <Route path="/stats" element={<UserStatsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>
            </Routes>
          </AudioUnlockGate>
        </AudioProvider>
      </GameProvider>
    </AuthProvider>
  );
}

export default App;