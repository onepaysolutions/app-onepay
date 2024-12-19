import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import styles from './ReferralTree.module.css';

interface ReferralNode {
  id: string;
  useraddress: string;
  parentaddress: string | null;
  placementarea: 'left' | 'middle' | 'right' | null;
  tier: number;
  isactive: boolean;
  children: ReferralNode[];
}

interface ReferralTreeProps {
  walletAddress: string;
}

export function ReferralTree({ walletAddress }: ReferralTreeProps) {
  const [treeData, setTreeData] = useState<ReferralNode | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReferralTree() {
      if (!walletAddress) return;
      setLoading(true);
      setError(null);

      try {
        const { data: referralData, error: referralError } = await supabase
          .from('users')
          .select(`
            id,
            walletaddress,
            referreraddress,
            placementarea,
            isactive
          `)
          .or(`referreraddress.eq.${walletAddress},walletaddress.eq.${walletAddress}`)
          .order('createdat');

        if (referralError) throw referralError;

        // 构建树形结构
        const buildTree = (parentAddress: string | null): ReferralNode[] => {
          return referralData
            ?.filter(node => node.referreraddress === parentAddress)
            .map(node => ({
              id: node.id,
              useraddress: node.walletaddress,
              parentaddress: node.referreraddress,
              placementarea: node.placementarea,
              tier: 0, // 将在后面计算
              isactive: node.isactive,
              children: buildTree(node.walletaddress)
            })) || [];
        };

        // 创建根节点
        const rootNode: ReferralNode = {
          id: 'root',
          useraddress: walletAddress,
          parentaddress: null,
          placementarea: null,
          tier: 0,
          isactive: true,
          children: buildTree(walletAddress)
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
        setError('get referral tree error');
      } finally {
        setLoading(false);
      }
    }

    fetchReferralTree();
  }, [walletAddress]);

  const renderTreeNode = (node: ReferralNode) => {
    const getZoneColor = (zone: string | null) => {
      switch (zone) {
        case 'left': return 'text-blue-400';
        case 'middle': return 'text-green-400';
        case 'right': return 'text-red-400';
        default: return 'text-gray-400';
      }
    };

    return (
      <div key={node.id} className={styles.treeNode}>
        <div className={`${styles.nodeCard} ${node.isactive ? styles.active : ''}`}>
          <div className={styles.nodeContent}>
            <div className={styles.userInfo}>
              <div className={styles.addressSection}>
                <span className={`${styles.statusIcon} ${node.isactive ? styles.active : ''}`}>
                  {node.isactive ? '🟢' : '⚪️'}
                </span>
                <span className={styles.address}>
                  {node.useraddress.slice(0, 6)}...{node.useraddress.slice(-4)}
                </span>
              </div>
              <div className={styles.metadata}>
                <span className={styles.level}>Level {node.tier}</span>
                {node.placementarea && (
                  <span className={`${styles.zone} ${getZoneColor(node.placementarea)}`}>
                    {node.placementarea === 'left' ? '左区' :
                     node.placementarea === 'middle' ? '中区' : '右区'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {node.children.length > 0 && (
          <div className={styles.childNodes}>
            {node.children
              .sort((a, b) => {
                const order = { left: 1, middle: 2, right: 3 };
                return (order[a.placementarea as keyof typeof order] || 0) - (order[b.placementarea as keyof typeof order] || 0);
              })
              .map(child => renderTreeNode(child))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className={styles.loadingState}>
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-purple-900/20 rounded-lg w-full" />
          <div className="h-12 bg-purple-900/20 rounded-lg w-3/4" />
          <div className="h-12 bg-purple-900/20 rounded-lg w-1/2" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorState}>
        <p className="text-red-400">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg transition-colors"
        >
          retry
        </button>
      </div>
    );
  }

  if (!treeData) {
    return (
      <div className={styles.emptyState}>
        <p className="text-lg">no referral data</p>
        <p className="text-sm text-gray-400">
          when you start recommending other users, your referral tree will be displayed here
        </p>
      </div>
    );
  }

  return (
    <div className={styles.treeContainer}>
      <div className={styles.header}>
        <h3 className={styles.title}>Referral Tree</h3>
        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <span className={`${styles.legendIcon} ${styles.active}`} />
            <span>active user</span>
          </div>
          <div className={styles.legendItem}>
            <span className={`${styles.legendIcon} ${styles.inactive}`} />
            <span>inactive user</span>
          </div>
        </div>
      </div>
      {renderTreeNode(treeData)}
    </div>
  );
} 