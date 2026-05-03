import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { useState } from "react";
import { UserMenu } from "./UserMenu";

export function Layout() {
  const [sideBarOpen, setSideBarOpen] = useState(false);

  return (
    <div className="h-dvh flex flex-col bg-black overflow-hidden">
      <header className="flex-none w-full z-50">
        <Header onMenuClick={() => setSideBarOpen(true)} />
      </header>

      <UserMenu open={sideBarOpen} onClose={() => setSideBarOpen(false)} />

      <main
        className="flex-1 w-full overflow-y-auto min-h-0"
        style={{
          background: "linear-gradient(180deg, #06000f 0%, #0d001f 100%)",
        }}
      >
        <div className="w-full max-w-3xl mx-auto h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}