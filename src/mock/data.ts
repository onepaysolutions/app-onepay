export const mockData = {
  // 用户数据
  user: {
    address: "0x1234...5678",
    hasUserNFT: true,
    hasAngelNFT: false,
    referralLink: "https://onepay.com/ref/0x1234",
    referralZone: "left",
    referrals: 12,
    totalEarnings: 1500,
  },

  // NFT 数据
  nfts: [
    {
      id: 0,
      name: "VIP 1",
      price: 500,
      image: "/nft-1.png",
      benefits: [
        "基础社区访问权限",
        "每日空投机会",
        "基础投票权",
      ]
    },
    {
      id: 1,
      name: "VIP 2",
      price: 1000,
      image: "/nft-2.png",
      benefits: [
        "高级社区访问权限",
        "优先空投机会",
        "加权投票权",
      ]
    },
    {
      id: 2,
      name: "VIP 3",
      price: 3000,
      image: "/nft-3.png",
      benefits: [
        "专属社区访问权限",
        "保障空投份额",
        "超级投票权",
      ]
    },
    {
      id: 3,
      name: "VIP 4",
      price: 7000,
      image: "/nft-4.png",
      benefits: [
        "创始人社区访问权限",
        "最高空投优先权",
        "一票否决权",
      ]
    }
  ],

  // 推荐系统数据
  referral: {
    zones: [
      {
        name: "左区",
        value: "left",
        performance: 5000,
        members: 8,
      },
      {
        name: "中区",
        value: "middle",
        performance: 8000,
        members: 12,
      },
      {
        name: "右区",
        value: "right",
        performance: 3000,
        members: 5,
      }
    ],
    recentReferrals: [
      {
        address: "0xabcd...efgh",
        time: "2024-03-20T10:30:00Z",
        zone: "left",
      },
      {
        address: "0xijkl...mnop",
        time: "2024-03-19T15:45:00Z",
        zone: "middle",
      },
      {
        address: "0xqrst...uvwx",
        time: "2024-03-18T09:20:00Z",
        zone: "right",
      }
    ]
  },

  // 社区数据
  community: {
    totalMembers: 1500,
    activeProposals: 3,
    totalVotes: 12500,
    recentActivities: [
      {
        type: "vote",
        title: "提案投票",
        description: "社区治理提案 #23 投票进行中",
        time: "2024-03-20T11:00:00Z"
      },
      {
        type: "airdrop",
        title: "空投活动",
        description: "第三轮社区代币空投开始",
        time: "2024-03-19T14:30:00Z"
      },
      {
        type: "event",
        title: "社区活动",
        description: "线上 AMA 活动预告",
        time: "2024-03-18T16:00:00Z"
      }
    ]
  }
}; 