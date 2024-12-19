import { RouteObject, useRoutes } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { LandingPage } from '@/pages/landing/LandingPage';
import { Home} from '@/pages/home/Home';
import { Community } from '@/pages/community/Community';
import { StarNFT } from '@/pages/star-nft/StarNFT';
import { ProfileLayout } from '@/pages/profile/ProfileLayout';
import { Profile } from '@/pages/profile/Profile';
import { ProfileEvents } from '@/pages/profile/ProfileEvents';
import { ProfileUpdates } from '@/pages/profile/ProfileUpdates';
import { ProfileNotifications } from '@/pages/profile/ProfileNotifications';
import { ReferralPage } from '@/pages/referral/ReferralPage';
import { NotFound } from '@/components/common/NotFound';
import { AuthWrapper } from '@/components/auth/AuthWrapper';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: (
      <AuthWrapper>
        <MainLayout withHeader={false} withTabBar={false}>
          <LandingPage />
        </MainLayout>
      </AuthWrapper>
    )
  },
  {
    path: '/landing',
    element: (
      <AuthWrapper>
        <MainLayout withHeader={false} withTabBar={false}>
          <LandingPage />
        </MainLayout>
      </AuthWrapper>
    )
  },
  {
    path: '/community',
    element: (
      <AuthWrapper>
        <MainLayout>
          <Community />
        </MainLayout>
      </AuthWrapper>
    )
  },
  {
    path: '/star',
    element: (
      <AuthWrapper>
        <MainLayout>
          <StarNFT />
        </MainLayout>
      </AuthWrapper>
    )
  },
  {
    path: '/referral',
    element: (
      <AuthWrapper>
        <MainLayout>
          <ReferralPage />
        </MainLayout>
      </AuthWrapper>
    )
  },
  {
    path: '/profile',
    element: (
      <AuthWrapper>
        <MainLayout>
          <ProfileLayout />
        </MainLayout>
      </AuthWrapper>
    ),
    children: [
      {
        index: true,
        element: <Profile />
      },
      {
        path: 'events',
        element: <ProfileEvents />
      },
      {
        path: 'updates',
        element: <ProfileUpdates />
      },
      {
        path: 'notifications',
        element: <ProfileNotifications />
      }
    ]
  },
  {
    path: '*',
    element: <MainLayout withHeader={false} withTabBar={false}><NotFound /></MainLayout>
  }
];

export function Routes() {
  return useRoutes(routes);
} 
