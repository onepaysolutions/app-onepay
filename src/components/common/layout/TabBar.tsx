import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
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

export function TabBar() {
  const { t } = useTranslation(['translation']);
  const location = useLocation();

  const tabs = [
    {
      path: '/community',
      label: t('app.nav.community'),
      icon: IoPeopleOutline,
      activeIcon: IoPeople
    },
    {
      path: '/star-nft',
      label: t('app.nav.star'),
      icon: IoStarOutline,
      activeIcon: IoStar
    },
    {
      path: '/referral',
      label: t('app.nav.referral'),
      icon: IoShareSocialOutline,
      activeIcon: IoShareSocial
    },
    {
      path: '/profile',
      label: t('app.nav.profile'),
      icon: IoPersonOutline,
      activeIcon: IoPerson
    }
  ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-t border-purple-500/20">
      {/* 波浪装饰 */}
      <div className="absolute -top-6 left-0 right-0 h-6 overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-r from-purple-900/20 via-black/30 to-purple-900/20">
          <svg 
            className="absolute bottom-0 w-full h-full" 
            viewBox="0 0 1200 120" 
            preserveAspectRatio="none"
          >
            <path 
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
              className="fill-black/30 opacity-25"
            />
            <path 
              d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
              className="fill-black/30 opacity-50"
            />
            <path 
              d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" 
              className="fill-black/30"
            />
          </svg>
        </div>
      </div>

      {/* TabBar 主体 */}
      <div className="relative bg-gradient-to-r from-purple-900/20 via-black/30 to-purple-900/20 backdrop-blur-xl border-t border-purple-500/20">
        <div className="container mx-auto px-4">
          <div className="flex justify-around items-center h-16">
            {tabs.map((tab) => {
              const isActive = location.pathname === tab.path;
              const Icon = isActive ? tab.activeIcon : tab.icon;
              
              return (
                <Link
                  key={tab.path}
                  to={tab.path}
                  className={`
                    flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all duration-300
                    ${isActive 
                      ? 'text-purple-400 transform scale-110' 
                      : 'text-gray-400 hover:text-gray-300'
                    }
                  `}
                >
                  <Icon className={`w-6 h-6 transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} />
                  <span className="text-xs font-medium">{tab.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}