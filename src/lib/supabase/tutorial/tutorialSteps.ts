export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  target: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  action?: () => void;
}

// 真实操作步骤
export const realSteps: TutorialStep[] = [
  {
    id: 'connect-wallet',
    title: '连接钱包',
    description: '首先需要连接您的加密钱包',
    target: '.connect-wallet-button',
    position: 'bottom'
  },
  {
    id: 'claim-nft',
    title: '认领社区 NFT',
    description: '点击按钮开始认领您的社区会员 NFT',
    target: '.claim-button',
    position: 'bottom'
  },
  {
    id: 'payment',
    title: '支付确认',
    description: '选择支付方式并确认交易',
    target: '.pay-embed',
    position: 'top'
  }
];

// 模拟操作步骤
export const demoSteps: TutorialStep[] = [
  {
    id: 'demo-connect',
    title: '模拟连接钱包',
    description: '这是一个演示，点击这里模拟连接钱包',
    target: '.demo-connect-button',
    position: 'bottom',
    action: () => {
      // 模拟连接钱包的操作
      console.log('模拟连接钱包');
    }
  },
  {
    id: 'demo-claim',
    title: '模拟认领 NFT',
    description: '这是一个演示，点击这里模拟认领 NFT',
    target: '.demo-claim-button',
    position: 'bottom',
    action: () => {
      // 模拟认领操作
      console.log('模拟认领 NFT');
    }
  }
]; 