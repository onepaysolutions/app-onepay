import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaChevronDown, FaChevronRight, FaStar } from 'react-icons/fa';
import { truncateAddress } from '@/utils/address';
import { useTranslation } from 'react-i18next';
import type { Database } from '@/db/supabase';

interface TreeNodeProps {
  node: TreeNode;
  onToggle: (useraddress: string) => void;
  expandedNodes: Set<string>;
}

interface TreeNode {
  id: number;
  userid: number;
  useraddress: string;
  parentaddress: string | null;
  placementarea: Database['public']['Enums']['starnft_claim_status'];
  isactive: boolean | null;
  memberstatus: string | null;
  tier: number | null;
  createdat: string | null;
  children: TreeNode[];
}

export function TreeNode({ node, onToggle, expandedNodes }: TreeNodeProps) {
  const { t } = useTranslation();
  const isExpanded = expandedNodes.has(node.useraddress);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="ml-6">
      <div className="flex items-center gap-2 py-2">
        {hasChildren && (
          <button
            onClick={() => onToggle(node.useraddress)}
            className="p-1 hover:bg-purple-500/20 rounded"
          >
            {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
          </button>
        )}
        <div className={`flex items-center justify-between w-full px-3 py-2 rounded-lg 
          ${node.isactive ? 'bg-purple-500/20' : 'bg-gray-500/20'}`}
        >
          <div className="flex items-center gap-2">
            {node.isactive ? <FaStar className="text-yellow-500" /> : <FaUser />}
            <span>{truncateAddress(node.useraddress)}</span>
            {node.tier && (
              <span className="text-sm text-purple-400">
                Level {node.tier}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">
              {t("Zone")}: {t(node.placementarea)}
            </span>
            {node.memberstatus && (
              <span className="text-sm">
                {(Number(node.memberstatus) / 10**18).toFixed(2)} USDC
              </span>
            )}
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {isExpanded && hasChildren && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="ml-4"
          >
              {node.children?.map((child: any) => (
                <TreeNode 
                  key={child.useraddress}
                  node={child} 
                  onToggle={onToggle} 
                  expandedNodes={expandedNodes}
                />
              ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
