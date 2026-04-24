import { Route, Routes } from "react-router-dom";
import { Layout } from "./layout/Layout";
import { Home } from "./pages/Home";
import { useEffect, useState } from "react";
import { initUser } from "./service/user.service";
import { Campaigns } from "./pages/Campaigns";
import { Creatures } from "./pages/Creatures";
import { GameProvider } from "./context/GameProvider";
import { Game } from "./pages/Game";
import { Result } from "./pages/Result";

function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initUser()
      .then(() => setReady(true))
      .catch(() => {
        console.error("Could not initialize user. Please try again later");
      });
  }, []);
  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading...
      </div>
    );
  }
  return (
    <GameProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/creatures/:campaignId" element={<Creatures />} />
          <Route path="game" element={<Game />} />
          <Route path="result" element={<Result />} />
        </Route>
      </Routes>
    </GameProvider>
  );
}

export default App;