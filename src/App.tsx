import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThirdwebProvider } from 'thirdweb/react';
import { MainLayout } from '@/components/layout/MainLayout';
import { LandingPage } from '@/pages/landing/LandingPage';
import { Home } from '@/pages/home/Home';
import { Community } from '@/pages/community';
import { StarNFT } from '@/pages/star-nft/StarNFT';
import { ReferralPage } from '@/pages/referral/ReferralPage';
import { Profile } from '@/pages/profile';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

export function App() {
  return (
    <ThirdwebProvider>
      <Router>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<MainLayout><Home /></MainLayout>} />
            <Route path="/community" element={<MainLayout><Community /></MainLayout>} />
            <Route path="/star-nft" element={<MainLayout><StarNFT /></MainLayout>} />
            <Route path="/referral" element={<MainLayout><ReferralPage /></MainLayout>} />
            <Route path="/referral/:tab" element={<MainLayout><ReferralPage /></MainLayout>} />
            <Route path="/profile" element={<MainLayout><Profile /></MainLayout>} />
          </Routes>
        </ErrorBoundary>
      </Router>
    </ThirdwebProvider>
  );
}
