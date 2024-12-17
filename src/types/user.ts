export interface UserProfile {
  id: string;
  walletAddress: string;
  nickname: string | null;
  avatarUrl: string | null;
  level?: number;
  social?: {
    discord?: string;
    twitter?: string;
    telegram?: string;
  };
  createdAt?: string;
  updatedAt?: string;
} 