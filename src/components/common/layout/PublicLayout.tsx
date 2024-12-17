import { Outlet } from "react-router-dom";

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-black text-white">
      <main>
        <Outlet />
      </main>
    </div>
  );
} 