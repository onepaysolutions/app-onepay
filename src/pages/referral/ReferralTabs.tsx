import { Link, useLocation } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const tabs = [
  {
    value: 'tree',
    label: {
      en: 'Referral Tree',
      zh: '推荐树'
    }
  },
  {
    value: 'direct-tier',
    label: {
      en: 'Direct Tier',
      zh: '直推等级'
    }
  },
  {
    value: 'tier',
    label: {
      en: 'Tier Rewards',
      zh: '等级奖励'
    }
  }
];

export function ReferralTabs() {
  const location = useLocation();
  const lang = localStorage.getItem('lang') || 'en';
  
  const currentTab = location.pathname.split('/').pop() || 'tree';
  return (
    <Tabs className="w-full" defaultValue={currentTab}>
      <TabsList className="bg-purple-900/20 border border-purple-500/20">
        {tabs.map(tab => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
          >
            <Link to={`/referral/${tab.value}`}>
              {tab.label[lang as keyof typeof tab.label]}
            </Link>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
} 