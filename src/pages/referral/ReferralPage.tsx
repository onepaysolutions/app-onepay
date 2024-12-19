import { useActiveAccount } from 'thirdweb/react';
import { useTranslation } from 'react-i18next';
import { Container } from '@/components/layout/Container';
import { CardContainer } from '@/components/ui/card-container';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReferralDashboard } from '@/components/referral/dashboard/ReferralDashboard';
import { ReferralTree } from '@/components/referral/tree/ReferralTree';
import { DirectTierRewards } from '@/components/referral/DirectTier/DirectTierRewards';
import { TierRewards } from '@/components/referral/TierReward/TierRewards'; 
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

interface ReferralNode {
  id: string;
  useraddress: string;
  parentaddress: string | null;
  placementarea: 'left' | 'middle' | 'right' | null;
  tier: number;
  path: string[];
  isactive: boolean;
  memberstatus: string;
  children: ReferralNode[];
}

export function ReferralPage() {
  const { t } = useTranslation();
  const account = useActiveAccount();
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname.split('/');
  const activeTab = path[path.length - 1] === 'referral' ? 'dashboard' : path[path.length - 1];
  const [treeData, setTreeData] = useState<ReferralNode | null>(null);

  const walletAddress = account?.address?.toLowerCase() || '';

  const tabs = [
    {
      value: 'dashboard',
      label: t('referral.nav.dashboard')
    },
    {
      value: 'tree',
      label: t('referral.nav.tree')
    },
    {
      value: 'direct-tier',
      label: t('referral.nav.directTier')
    },
    {
      value: 'tier',
      label: t('referral.nav.tierRewards')
    }
  ];

  useEffect(() => {
    async function fetchReferralTree() {
      if (!walletAddress) return;

      try {
        // 获取用户及其推荐关系
        const { data: referralData, error } = await supabase
          .from('users')
          .select(`
            id,
            walletaddress,
            referreraddress,
            placementarea,
            isactive,
            createdat
          `)
          .or(`referreraddress.eq.${walletAddress},walletaddress.eq.${walletAddress}`)
          .order('createdat');

        if (error) {
          console.error('Error fetching referral data:', error);
          return;
        }

        // 构建树形结构
        const buildTree = (parentAddress: string | null, parentPath: string[] = []): ReferralNode[] => {
          return referralData
            ?.filter(node => node.referreraddress === parentAddress)
            .map(node => {
              const currentPath = [...parentPath, node.walletaddress];
              return {
                id: node.id,
                useraddress: node.walletaddress,
                parentaddress: node.referreraddress,
                placementarea: node.placementarea,
                tier: 0,
                path: currentPath,
                isactive: node.isactive,
                memberstatus: node.isactive ? t('referral.tree.status.active') : t('referral.tree.status.inactive'),
                children: buildTree(node.walletaddress, currentPath)
              };
            }) || [];
        };

        // 创建根节点
        const rootNode: ReferralNode = {
          id: 'root',
          useraddress: walletAddress,
          parentaddress: null,
          placementarea: null,
          tier: 0,
          path: [walletAddress],
          isactive: true,
          memberstatus: t('referral.tree.status.active'),
          children: buildTree(walletAddress, [walletAddress])
        };

        // 计算每个节点的层级
        const calculateTiers = (node: ReferralNode, currentTier: number = 0) => {
          node.tier = currentTier;
          node.children.forEach(child => calculateTiers(child, currentTier + 1));
        };

        calculateTiers(rootNode);
        setTreeData(rootNode);
      } catch (error) {
        console.error('Error:', error);
      }
    }

    fetchReferralTree();
  }, [walletAddress, t]);

  if (!account) {
    return (
      <Container>
        <div className="text-center py-8">
          <p className="text-gray-400">{t('common.connect')}</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="space-y-6">
        <div className="flex flex-col space-y-4">
          <h1 className="text-2xl font-bold">{t('referral.title')}</h1>
          <Tabs 
            defaultValue={activeTab} 
            className="w-full"
          >
            <TabsList className="bg-purple-900/20 border border-purple-500/20 flex-wrap">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex-1 sm:flex-none"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <CardContainer>
          {activeTab === 'dashboard' && <ReferralDashboard walletaddress={walletAddress} />}
          {activeTab === 'tree' && treeData && <ReferralTree walletAddress={walletAddress} />}
          {activeTab === 'direct-tier' && <DirectTierRewards />}
          {activeTab === 'tier' && <TierRewards address={walletAddress} />}
        </CardContainer>
      </div>
    </Container>
  );
} 
