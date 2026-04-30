import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { useState } from "react";
import { UserMenu } from "./UserMenu";

export function Layout() {
  const [sideBarOpen,setSideBarOpen] = useState(false)
  return (
    <>
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
      <div className="flex flex-col md:hidden min-h-screen justify-center items-center">
          <header className="w-full">
            <Header onMenuClick={()=>setSideBarOpen(true)}/>
          </header>
          <UserMenu open={sideBarOpen} onClose={()=>setSideBarOpen(false)}/>
        <div className="w-full max-w-3xl overflow-hidden flex-1  "style={{ background: "linear-gradient(180deg, #06000f 0%, #0d001f 100%)" }}>
          <Outlet />
        </div>
        <div>
          
        </div>
      </div>
    </>
  );
}