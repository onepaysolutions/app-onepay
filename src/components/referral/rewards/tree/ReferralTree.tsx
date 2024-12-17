import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { truncateAddress } from '@/utils/address';
import { FaUser, FaStar, FaChevronDown, FaChevronRight } from 'react-icons/fa';

interface ReferralTreeProps {
  address: string;
}

interface TreeNode {
  id: string;
  address: string;
  level: number;
  zone: string;
  isActive: boolean;
  children: TreeNode[];
}

export function ReferralTree({ address }: ReferralTreeProps) {
  const { t } = useTranslation();
  const [treeData, setTreeData] = useState<TreeNode | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function fetchReferralTree() {
      try {
        // 获取用户的推荐关系
        const { data: referralData, error: referralError } = await supabase
          .from('referraltreewithactivestatus')
          .select(`
            userid,
            useraddress,
            parentaddress,
            placementarea,
            tier,
            isactive,
            memberstatus,
            createdat
          `)
          .eq('parentaddress', address);

        if (referralError) throw referralError;

        // 构建树结构
        const root: TreeNode = {
          id: 'root',
          address: address,
          level: 0,
          zone: 'ROOT',
          isActive: true,
          children: (referralData || []).map((ref: any) => ({
            id: ref.userid.toString(),
            address: ref.useraddress,
            level: ref.tier || 1,
            zone: ref.placementarea,
            isActive: ref.isactive,
            children: []
          }))
        };

        setTreeData(root);
      } catch (error) {
        console.error('Error fetching referral tree:', error);
      } finally {
        setLoading(false);
      }
    }

    if (address) {
      fetchReferralTree();
    }
  }, [address]);

  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  const renderNode = (node: TreeNode) => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children.length > 0;

    return (
      <div key={node.id} className="ml-6">
        <div className="flex items-center gap-2 py-2">
          {hasChildren && (
            <button
              onClick={() => toggleNode(node.id)}
              className="p-1 hover:bg-purple-500/20 rounded"
            >
              {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
            </button>
          )}
          <div className="flex items-center justify-between w-full px-3 py-2 rounded-lg bg-purple-900/20">
            <div className="flex items-center gap-2">
              {node.isActive ? (
                <FaStar className="text-yellow-500" />
              ) : (
                <FaUser className="text-gray-400" />
              )}
              <span>{truncateAddress(node.address)}</span>
              <span className="text-sm text-purple-400">
                Level {node.level}
              </span>
              {node.zone && node.zone !== 'ROOT' && (
                <span className="text-sm text-gray-400 ml-2">
                  {t(node.zone)} Zone
                </span>
              )}
            </div>
          </div>
        </div>

        {isExpanded && hasChildren && (
          <div className="ml-4">
            {node.children.map(child => renderNode(child))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  if (!treeData) {
    return null;
  }

  return (
    <div className="bg-purple-900/30 rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{t("Referral Tree")}</h3>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <FaUser className="text-gray-400" />
            <span>{t("Basic User")}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaStar className="text-yellow-500" />
            <span>{t("Star NFT Activated")}</span>
          </div>
        </div>
      </div>

      {renderNode(treeData)}
    </div>
  );
} 