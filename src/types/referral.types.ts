export interface ReferralNode {
  id: number;
  address: string;
  level: number;
  zone: string;
  isActivated: boolean;
  isStarActive: boolean;
  children: ReferralNode[];
}

export interface ReferralStats {
  zone: string;
  direct_count: number;
  team_count: number;
  direct_volume: number;
  team_volume: number;
}

interface DirectReferral {
  id: number;
  level: number;
  referee: {
    id: number;
    walletaddress: string;
  }[];
}
