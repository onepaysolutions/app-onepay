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
    title: 'connect wallet',
    description: '首先需要连接您的加密钱包',
    target: '.connect-wallet-button',
    position: 'bottom'
  },
  {
    id: 'claim-nft',
    title: 'claim community nft',
    description: 'click button to claim your community member nft',
    target: '.claim-button',
    position: 'bottom'
  },
  {
    id: 'payment',
    title: 'payment',
    description: 'select payment method and confirm transaction',
    target: '.pay-embed',
    position: 'top'
  }
];

// 模拟操作步骤
export const demoSteps: TutorialStep[] = [
  {
    id: 'demo-connect',
    title: 'demo connect wallet',
    description: 'this is a demo, click here to simulate connecting wallet',
    target: '.demo-connect-button',
    position: 'bottom',
    action: () => {
      // 模拟连接钱包的操作
      console.log('mock connect wallet');
    }
  },
  {
    id: 'demo-claim',
    title: 'demo claim nft',
    description: 'this is a demo, click here to simulate claiming nft',
    target: '.demo-claim-button',
    position: 'bottom',
    action: () => {
      // 模拟认领操作
      console.log('mock claim nft');
    }
  }
]; 