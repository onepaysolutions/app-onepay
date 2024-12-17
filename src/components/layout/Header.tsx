import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container } from './Container';
import { ConnectButton } from '@/components/auth/ConnectButton';
import { cn } from '@/lib/utils';

export function Header() {
  const { t } = useTranslation();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  // 监听滚动以添加背景
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { path: '/', label: 'home' },
    { path: '/star', label: 'star' },
    { path: '/referral', label: 'referral' },
    { path: '/profile', label: 'profile' }
  ];

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-300',
      isScrolled ? 'bg-black/80 backdrop-blur-lg shadow-lg' : 'bg-transparent'
    )}>
      <Container size="xl" className="h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.svg" alt="Logo" className="w-8 h-8" />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              OnePay
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={cn(
                  'px-4 py-2 rounded-lg transition-colors',
                  'hover:bg-purple-600/10',
                  location.pathname === path ? 'text-purple-400' : 'text-gray-400'
                )}
              >
                {t(`app.nav.${label}`)}
              </Link>
            ))}
          </nav>

          {/* Connect Button */}
          <div className="flex items-center gap-4">
            <ConnectButton />
          </div>
        </div>
      </Container>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-lg border-t border-purple-500/20">
        <Container>
          <div className="flex items-center justify-around py-3">
            {navItems.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={cn(
                  'flex flex-col items-center gap-1 px-4 py-2',
                  location.pathname === path ? 'text-purple-400' : 'text-gray-400'
                )}
              >
                {getNavIcon(label)}
                <span className="text-xs">{t(`app.tabBar.${label}`)}</span>
              </Link>
            ))}
          </div>
        </Container>
      </nav>
    </header>
  );
}

// 导航图标
function getNavIcon(label: string) {
  switch (label) {
    case 'home':
      return <HomeIcon className="w-5 h-5" />;
    case 'star':
      return <StarIcon className="w-5 h-5" />;
    case 'referral':
      return <UsersIcon className="w-5 h-5" />;
    case 'profile':
      return <UserIcon className="w-5 h-5" />;
    default:
      return null;
  }
}

// 简单的图标组件
function HomeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

function StarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  );
}

function UsersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

function UserIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
} 