import { createBrowserRouter } from 'react-router-dom';
import { LandingPage } from '@/pages/landing/LandingPage';
import { Layout } from '@/components/layout/Layout';
import { StarNFT } from '@/pages/star-nft/StarNFT';
import { Profile } from '@/pages/profile/ProfilePage';
import { Dashboard } from '@/pages/community/Dashboard';
import { OPEPage } from '@/pages/ope/OPEPage';
import { OPSSale } from '@/pages/ops-sale/OPSSale';
import { ReferralLayout } from '@/pages/referral/ReferralLayout';
import { ReferralPage } from '@/pages/referral/ReferralPage';
import { RewardsClaimPage } from '@/pages/referral/RewardsClaimPage';
import { ReferralTreePage } from '@/pages/referral/ReferralTreePage';
import { NotFound } from '@/components/common/NotFound';
import { ConnectButton } from '@/components/auth/ConnectButton';
import { AuthWrapper } from '@/components/auth/AuthWrapper';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />
  },
  {
    path: '/dashboard',
    element: <Layout />,
    children: [
      {
        path: 'star-nft',
        element: (
          <AuthWrapper>
            <StarNFT />
          </AuthWrapper>
        )
      },
      {
        path: 'referral',
        element: (
          <AuthWrapper>
            <ReferralLayout />
          </AuthWrapper>
        ),
        children: [
          {
            index: true,
            element: <ReferralPage />
          },
          {
            path: 'rewards',
            element: <RewardsClaimPage />
          },
          {
            path: 'tree',
            element: <ReferralTreePage />
          }
        ]
      },
      {
        path: 'profile',
        element: (
          <AuthWrapper>
            <Profile />
          </AuthWrapper>
        )
      },
      {
        path: 'connect',
        element: <ConnectButton />
      },
      {
        path: 'ope',
        element: <OPEPage />
      },
      {
        path: 'ops-sale',
        element: <OPSSale />
      },
      {
        path: '*',
        element: <NotFound />
      }
    ]
  }
]); 