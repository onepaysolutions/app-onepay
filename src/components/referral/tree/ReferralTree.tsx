import { memo } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

interface ReferralNode {
  useraddress: string;
  parentaddress: string | null;
  tier: number;
  path: string[];
  isactive: boolean;
  memberstatus: string;
  placementarea: string | null;
  children: ReferralNode[];
}

interface ReferralTreeProps {
  data: ReferralNode;
}

const TreeNode = memo(({ node, depth = 0 }: { node: ReferralNode; depth?: number }) => {
  console.log('Rendering node:', node);
  const addressDisplay = `${node.useraddress.slice(0, 6)}...${node.useraddress.slice(-4)}`;
  
  return (
    <div className="relative">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: depth * 0.1 }}
        className={`rounded-lg p-4 border ${
          node.isactive 
            ? 'bg-purple-900/20 border-purple-500/20' 
            : 'bg-gray-900/20 border-gray-500/20'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">{addressDisplay}</p>
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-400">Tier {node.tier}</p>
              {node.placementarea && (
                <p className="text-sm text-gray-400">Area: {node.placementarea}</p>
              )}
              <Badge variant={node.isactive ? "success" : "default"}>
                {node.memberstatus}
              </Badge>
            </div>
          </div>
          {node.parentaddress && (
            <div className="text-right">
              <p className="text-sm text-purple-400">
                Parent: {`${node.parentaddress.slice(0, 6)}...${node.parentaddress.slice(-4)}`}
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {node.children?.length > 0 && (
        <div className="mt-4 ml-8 space-y-4">
          {node.children.map((child) => (
            <TreeNode 
              key={child.useraddress} 
              node={child} 
              depth={depth + 1} 
            />
          ))}
        </div>
      )}
    </div>
  );
});

TreeNode.displayName = 'TreeNode';

export function ReferralTree({ data }: ReferralTreeProps) {
  return (
    <div className="p-6 space-y-6">
      <TreeNode node={data} />
    </div>
  );
} 