import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

export function ReferralNav() {
  const { t } = useTranslation();
  const location = useLocation();

  const navItems = [
    { path: '/referral', label: 'dashboard' },
    { path: '/referral/rewards', label: 'rewards' },
    { path: '/referral/tree', label: 'tree' }
  ];

  return (
    <nav className="border-b border-purple-500/20">
      <div className="container">
        <div className="flex overflow-x-auto no-scrollbar">
          {navItems.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={cn(
                'px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap',
                location.pathname === path
                  ? 'text-purple-400 border-b-2 border-purple-400'
                  : 'text-gray-400 hover:text-purple-300'
              )}
            >
              {t(`referral.nav.${label}`)}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
} 