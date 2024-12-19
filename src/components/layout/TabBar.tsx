import { Link, useLocation } from 'react-router-dom';
import { 
  IoPeopleOutline,
  IoPeople,
  IoStarOutline,
  IoStar,
  IoShareSocialOutline,
  IoShareSocial,
  IoPersonOutline,
  IoPerson
} from "react-icons/io5";
import { cn } from '@/lib/utils';

const tabs = [
  { 
    path: '/community', 
    icon: IoPeopleOutline,
    activeIcon: IoPeople,
    labels: {
      en: 'Community',
      zh: '社区'
    }
  },
  { 
    path: '/star-nft', 
    icon: IoStarOutline,
    activeIcon: IoStar,
    labels: {
      en: 'STAR',
      zh: 'STAR'
    }
  },
  { 
    path: '/referral', 
    icon: IoShareSocialOutline,
    activeIcon: IoShareSocial,
    labels: {
      en: 'Referral',
      zh: '推荐'
    }
  },
  { 
    path: '/profile', 
    icon: IoPersonOutline,
    activeIcon: IoPerson,
    labels: {
      en: 'Profile',
      zh: '我的'
    }
  }
];

export function TabBar() {
  const location = useLocation();
  const lang = localStorage.getItem('lang') || 'en';

  const isPathActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/95 to-transparent -top-12" />
      
      {/* TabBar 主体 */}
      <div className="relative bg-black/95 backdrop-blur-md border-t border-purple-500/20">
        <div className="max-w-xl mx-auto px-4 py-2">
          <nav className="flex justify-around items-center">
            {tabs.map(({ path, icon: Icon, activeIcon: ActiveIcon, labels }) => {
              const active = isPathActive(path);
              return (
                <Link
                  key={path}
                  to={path}
                  className="relative group"
                >
                  {/* 活跃状态指示器 */}
                  {active && (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-purple-500" />
                  )}
                  
                  {/* 图标和文字容器 */}
                  <div className="flex flex-col items-center gap-1 py-1 px-4">
                    <div className={cn(
                      'relative p-2 rounded-xl transition-all duration-300 group-hover:bg-purple-500/10',
                      active && 'bg-purple-500/20'
                    )}>
                      {active ? (
                        <ActiveIcon className={cn(
                          'w-5 h-5 transition-colors duration-300',
                          'text-purple-400'
                        )} />
                      ) : (
                        <Icon className={cn(
                          'w-5 h-5 transition-colors duration-300',
                          'text-gray-400 group-hover:text-purple-400'
                        )} />
                      )}
                    </div>
                    <span className={cn(
                      'text-xs transition-colors duration-300',
                      active ? 'text-purple-400' : 'text-gray-400 group-hover:text-purple-400'
                    )}>
                      {labels[lang as keyof typeof labels]}
                    </span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* 安全区域填充 */}
      <div className="bg-black h-[env(safe-area-inset-bottom)]" />
    </div>
  );
} 