import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { TabBar } from './TabBar';
import { useActiveAccount } from 'thirdweb/react';

export function Layout() {
  const account = useActiveAccount();

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-20 pb-24">
          <Outlet />
        </div>
      </main>

      {account && <TabBar />}
    </div>
  );
} 