import { Outlet } from "react-router-dom";

export function Layout() {
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
      <div className="flex md:hidden min-h-screen justify-center items-center bg-black">
        <div className="w-full max-w-lg h-dvh overflow-hidden flex-1 p-4 bg-purple-200">
          <Outlet />
        </div>
      </div>
    </>
  );
}