import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Footer } from "./Footer";

interface Props {
  children: ReactNode;
}

export function Layout({ children }: Props) {
  return (
    <div className="bg-[#F9FAFB] h-screen flex">
      
      {/* Sidebar */}
      <aside className="w-64 bg-[#1E1B2E] text-gray-300 shrink-0 border-r border-[#374151]">
        <Sidebar />
      </aside>

      {/* Main area */}
      <div className="min-w-0 flex flex-col flex-1">
    
        {/* Header */}
        <header className="h-14 bg-[#FFFFFF] border-b border-[#E5E7EB] flex items-center justify-between px-6">
          <Header />
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6 bg-[#F9FAFB]">
          {children}
        </main>

        {/* Footer */}
        <footer className="h-10 bg-[#FFFFFF] border-t border-[#E5E7EB] flex items-center justify-center text-sm text-gray-500">
          <Footer />
        </footer>

      </div>
    </div>
  );
}