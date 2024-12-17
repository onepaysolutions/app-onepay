// 添加通用类型定义
export interface ReferralNode {
  id: string;
  address: string;
  level: number;
  zone: 'left' | 'middle' | 'right';
  volume: number;
  children: ReferralNode[];
  isExpanded?: boolean;
}

export interface RewardRecord {
  amount: string;
  status: 'pending' | 'completed';
  reward_type: string;
}

export interface NFTStats {
  totalMinted: number;
  totalSupply: number;
}

export interface ReferralStats {
  zone: 'left' | 'middle' | 'right';
  directCount: number;
  teamCount: number;
  directVolume: number;
  teamVolume: number;
}

// 添加 StageData 和 AirdropData 类型
export interface StageData {
  cycle: number;
  stage: number;
  price: number;
  totalSupply: number;
  soldAmount: number;
  startTime: string;
  endTime: string;
  status: 'upcoming' | 'active' | 'completed';
}

export interface AirdropData {
  cycle: number;
  totalAmount: number;
  claimedAmount: number;
  startTime: string;
  endTime: string;
  eligibleAddresses: number;
  minimumHolding: number;
  status: 'upcoming' | 'active' | 'completed';
}

export interface StarNFT {
  id: string;
  tokenId: number;
  ownerAddress: string;
  starLevel: number;
  price: number;
  reward: number;
  totalReleased: number;
  usdValueCap: number;
  status: 'active' | 'inactive' | 'burned' | 'locked';
}

export interface NFTRelease {
  id: string;
  nftId: string;
  releaseAmount: number;
  usdcAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
}

export interface OPSCycle {
  id: string;
  cycle: number;
  stage: number;
  currentPrice: number;
  nextPrice: number | null;
  soldAmount: number;
  stageAmount: number;
  totalStages: number;
  totalAmount: number;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
}

export interface OPSPurchase {
  id: string;
  userId: string;
  cycleId: string;
  amount: number;
  price: number;
  totalCost: number;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}

export interface Reward {
  id: string;
  name: string;
  type: 'referral' | 'star_nft' | 'ops' | 'team' | 'special';
  pending: number;
  claimed: number;
  rollup: number;
  isRollup: boolean;
}

export interface RewardDistribution {
  id: string;
  userId: string;
  rewardId: string;
  amount: number;
  tokenAddress: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
}

export interface CommunityPost {
  id: string
  author: {
    id: string
    name: string | null
    avatar_url: string | null
  }
  title: string
  content: string
  category: string
  tags: string[]
  likes: number
  views: number
  commentCount: number
  isLiked: boolean
  createdAt: string
  updatedAt: string
}

export interface CommunityComment {
  id: string
  author: {
    id: string
    name: string | null
    avatar_url: string | null
  }
  content: string
  likes: number
  isLiked: boolean
  createdAt: string
  updatedAt: string
}

export interface CommunityProfile {
  id: string
  name: string | null
  avatar_url: string | null
  bio: string | null
  followers: number
  following: number
  posts: number
  isFollowing: boolean
}

export interface CommunityStats {
  totalPosts: number
  totalComments: number
  totalLikes: number
  totalViews: number
  activePosts: number
  activeUsers: number
  topCategories: Array<{
    category: string
    count: number
  }>
}

export interface CommunityMember {
  id: string
  userId: string
  nftId: string
  opeBalance: number
  votePower: number
  level: number
  status: 'active' | 'inactive'
  joinedAt: string
  updatedAt: string
}

export interface CommunityProposal {
  id: string
  proposer: {
    id: string
    name: string | null
    avatar_url: string | null
  }
  title: string
  description: string
  startTime: string
  endTime: string
  minVotePower: number
  quorum: number
  forVotes: number
  againstVotes: number
  abstainVotes: number
  status: 'pending' | 'active' | 'passed' | 'rejected' | 'cancelled'
  executionData: string | null
  createdAt: string
  updatedAt: string
}

export interface CommunityVote {
  id: string
  userId: string
  proposalId: string
  voteAmount: number
  voteType: 'for' | 'against' | 'abstain'
  status: 'active' | 'cancelled'
  createdAt: string
  updatedAt: string
}

export interface CommunityStats {
  totalMembers: number
  totalProposals: number
  activeProposals: number
  totalVotes: number
  totalOpeStaked: number
  averageParticipation: number
  topVoters: Array<{
    userId: string
    votePower: number
    participationRate: number
  }>
} 