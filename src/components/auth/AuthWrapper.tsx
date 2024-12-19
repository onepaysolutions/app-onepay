import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useActiveAccount } from 'thirdweb/react';
import { ConnectButton } from '@/components/auth/ConnectButton';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const account = useActiveAccount();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 如果在登陆页并且已连接钱包，重定向到主应用
    if (account && (location.pathname === '/' || location.pathname === '/landing')) {
      navigate('/star');
    }
    // 如果在其他页面但未连接钱包，重定向到登陆页
    else if (!account && location.pathname !== '/' && location.pathname !== '/landing') {
      navigate('/');
    }
  }, [account, location.pathname, navigate]);

  // 如果在需要认证的页面但未连接钱包，显示连接钱包界面
  if (!account && location.pathname !== '/' && location.pathname !== '/landing') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ConnectButton />
      </div>
    );
  }

  return children;
} 