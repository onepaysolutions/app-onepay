import { useEffect, useState } from 'react';
import { useActiveAccount } from 'thirdweb/react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { ReferralTree } from '@/components/referral/tree/ReferralTree';
import { ReferralService } from '@/services/referralService';
import { ReferralNode, ReferralTreeView } from '@/types/database.types';

export function ReferralTreePage() {
  const { t } = useTranslation();
  const account = useActiveAccount();
  const [treeData, setTreeData] = useState<ReferralNode | null>(null);
  const [tierUsers, setTierUsers] = useState<{[key: number]: string[]}>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!account?.address) return;

    // 初始获取
    fetchReferralTree();

    // 订阅更新
    const cleanup = ReferralService.subscribeToReferralUpdates(
      account.address,
      fetchReferralTree
    );

    return cleanup;
  }, [account]);

  // 添加地址格式化函数
  const normalizeAddress = (address: string): string => {
    if (!address) return '';
    return address.toLowerCase();
  };

  const fetchReferralTree = async () => {
    if (!account?.address) return;
    const normalizedAddress = normalizeAddress(account.address);

    try {
      setIsLoading(true);
      console.log('Fetching tree for address:', normalizedAddress);

      // 先获取当前用户信息，如果不存在则创建
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('walletaddress, isactive')
        .ilike('walletaddress', normalizedAddress)
        .maybeSingle();

      let userData;
      
      if (!existingUser) {
        // 使用 upsert 而不是 insert 来避免重复
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .upsert({
            walletaddress: normalizedAddress,
            isactive: true,
            createdat: new Date().toISOString()
          }, {
            onConflict: 'walletaddress',
            ignoreDuplicates: true
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating user:', createError);
          return;
        }
        
        userData = newUser;
      } else {
        userData = existingUser;
      }

      // 获取所有下级用户（包括间接下级）
      const { data: referralData, error: referralError } = await supabase
        .from('users')
        .select(`
          id,
          walletaddress,
          referreraddress,
          placementarea,
          isactive,
          createdat
        `)
        .or(`referreraddress.ilike.${normalizedAddress},walletaddress.ilike.${normalizedAddress}`)
        .order('createdat');

      if (referralError) {
        console.error('Error fetching referrals:', referralError);
        return;
      }

      console.log('Found referrals:', referralData);

      // 构建树形结构
      const rootNode: ReferralNode = {
        useraddress: normalizedAddress,
        parentaddress: null,
        tier: 0,
        path: [normalizedAddress],
        isactive: userData.isactive,
        memberstatus: userData.isactive ? 'Active' : 'Inactive',
        placementarea: null,
        children: []
      };

      // 递归构建子树
      const buildChildren = (parentAddress: string, currentTier: number): ReferralNode[] => {
        const children = referralData
          .filter(node => normalizeAddress(node.referreraddress) === normalizeAddress(parentAddress))
          .map(node => {
            const normalizedAddress = normalizeAddress(node.walletaddress);
            return {
              useraddress: normalizedAddress,
              parentaddress: normalizeAddress(node.referreraddress),
              tier: currentTier,
              path: [...rootNode.path, normalizedAddress],
              isactive: node.isactive,
              memberstatus: node.isactive ? 'Active' : 'Inactive',
              placementarea: node.placementarea,
              children: [] as ReferralNode[]
            };
          });

        // 递归获取每个子节点的下级
        children.forEach(child => {
          child.children = buildChildren(child.useraddress, currentTier + 1);
        });

        return children;
      };

      // 构建完整的树
      rootNode.children = buildChildren(normalizedAddress, 1);
      console.log('Built tree:', rootNode);
      setTreeData(rootNode);

      // 按层级组织用户
      const usersByTier: {[key: number]: string[]} = {};
      const addToTier = (node: ReferralNode) => {
        if (!usersByTier[node.tier]) {
          usersByTier[node.tier] = [];
        }
        usersByTier[node.tier].push(node.useraddress);
        node.children?.forEach(addToTier);
      };
      addToTier(rootNode);
      setTierUsers(usersByTier);

    } catch (error) {
      console.error('Error fetching referral tree:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('referral.tree.title')}</h1>
      
      {/* 显示每层的用户 */}
      <div className="space-y-4">
        {Object.entries(tierUsers).map(([tier, users]) => (
          <div key={tier} className="card p-4">
            <h3 className="text-lg font-semibold mb-2">
              {t('referral.tree.tier')} {tier}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {users.map(address => (
                <div key={address} className="text-sm bg-purple-900/20 p-2 rounded">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* 树形展示 */}
      {treeData && <ReferralTree data={treeData as any} />}
    </div>
  );
} 