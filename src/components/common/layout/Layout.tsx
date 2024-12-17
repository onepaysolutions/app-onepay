import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { TabBar } from './TabBar';

export function Layout() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="pt-16 pb-20 min-h-screen">
        <Outlet />
      </main>
      <TabBar />
    </div>
  );
} 