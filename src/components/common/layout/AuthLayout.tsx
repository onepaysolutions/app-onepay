import { Outlet } from "react-router-dom";
import { ConnectButton } from "@/components/auth/ConnectButton";
import { TabBar } from "./TabBar";
import { useActiveAccount } from "thirdweb/react";

export function AuthLayout() {
  const account = useActiveAccount();

  if (!account) {
    return (
      <div className="min-h-screen bg-black text-white">
        <main>
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="fixed top-0 left-0 right-0 bg-black/30 backdrop-blur-lg border-b border-purple-500/20 z-50">
        <div className="container mx-auto px-6">
          <div className="h-16 flex items-center justify-between">
            <ConnectButton />
          </div>
        </div>
      </header>

      <main className="pt-16 pb-20 min-h-screen">
        <Outlet />
      </main>

      <TabBar />
    </div>
  );
} 