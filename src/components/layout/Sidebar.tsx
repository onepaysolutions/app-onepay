import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiHome, FiStar, FiUsers, FiUser, FiMenu, FiX } from 'react-icons/fi';
import { useActiveAccount } from 'thirdweb/react';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const { t } = useTranslation();
  const location = useLocation();
  const account = useActiveAccount();
  const [isOpen, setIsOpen] = useState(false);

  if (!account) return null;

  const navItems = [
    { path: '/', icon: FiHome, label: 'home' },
    { path: '/star', icon: FiStar, label: 'star' },
    { path: '/referral', icon: FiUsers, label: 'referral' },
    { path: '/profile', icon: FiUser, label: 'profile' }
  ];

  return (
    <>
      {/* 移动端菜单按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 left-4 z-50 p-3 bg-purple-600 rounded-full shadow-lg md:hidden"
      >
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* 侧边栏 */}
      <div 
        className={cn(
          'fixed top-0 left-0 h-full bg-black/95 backdrop-blur-md border-r border-purple-500/20 transition-all duration-300 z-40',
          'w-64 transform md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full pt-20 pb-8">
          <nav className="flex-1 px-4">
            <ul className="space-y-2">
              {navItems.map(({ path, icon: Icon, label }) => (
                <li key={path}>
                  <Link
                    to={path}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                      'hover:bg-purple-600/10',
                      location.pathname === path 
                        ? 'text-purple-400 bg-purple-600/20' 
                        : 'text-gray-400'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{t(`app.nav.${label}`)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* 背景遮罩 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
} 