import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { useState } from "react";
import { UserMenu } from "./UserMenu";

export function Layout() {
  const [sideBarOpen, setSideBarOpen] = useState(false);

  return (
    <>
      {/* Desktop Block Screen */}
      <div className="hidden md:flex min-h-screen items-center justify-center bg-black text-white text-center p-6">
        <div>
          <h1 className="text-xl font-semibold">
            This app is designed for mobile and tablet screens
          </h1>
          <p className="mt-2 text-gray-400">
            Please switch to a smaller screen or enable mobile view
          </p>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden h-screen flex flex-col bg-black">
        {/* Fixed Header */}
        <header className="fixed top-0 left-0 w-full z-50">
          <Header onMenuClick={() => setSideBarOpen(true)} />
        </header>

        {/* Sidebar Menu */}
        <UserMenu open={sideBarOpen} onClose={() => setSideBarOpen(false)} />

        {/* Scrollable Content */}
        <main
          className="flex-1 w-full overflow-y-auto pt-16"
          style={{
            background: "linear-gradient(180deg, #06000f 0%, #0d001f 100%)",
          }}
        >
          <div className="w-full max-w-3xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
}