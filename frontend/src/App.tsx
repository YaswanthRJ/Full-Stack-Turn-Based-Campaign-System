import { Route, Routes } from "react-router-dom";
import { Layout } from "./layout/Layout";
import { Home } from "./pages/Home";
import { Campaigns } from "./pages/Campaigns";
import { Creatures } from "./pages/Creatures";
import { GameProvider } from "./context/GameProvider";
import { AuthProvider } from "./context/AuthProvider";
import { GameScreen } from "./pages/GameScreen";

function App() {
  return (
    <AuthProvider>
      <GameProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/creatures/:campaignId" element={<Creatures />} />
            <Route  path="/game"  element= {<GameScreen /> } />
          </Route>
        </Routes>
      </GameProvider>
    </AuthProvider>
  );
}

export default App;