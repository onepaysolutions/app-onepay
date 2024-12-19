import { createThirdwebClient } from "thirdweb";
import { ConnectButton as ThirdwebConnectButton, useActiveAccount } from "thirdweb/react";
import { inAppWallet, createWallet } from "thirdweb/wallets";
import { optimism } from "thirdweb/chains";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase/supabase";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { Notification } from '@/components/common/Notification';
import { useActiveWallet } from "thirdweb/react";

// 创建客户端实例
const client = createThirdwebClient({
  clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID,
});


// 配置钱包选项
const wallets = [
  inAppWallet({
    auth: {
      options: [
        "google",
        "email",
        "phone",
        "facebook",
        "apple",
        "discord",
        "telegram",
        "farcaster",
        "x",
        "passkey",
      ],
      redirectUrl: window.location.origin,
    },
  }),
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  createWallet("io.rabby"),
  createWallet("io.zerion.wallet"),
];

interface ConnectButtonProps {
  style?: React.CSSProperties;
  onConnect?: () => void;
}

export function ConnectButton({ style, onConnect }: ConnectButtonProps) {
  const [searchParams] = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const { t } = useTranslation();
  const address = useActiveWallet();
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    title: string;
    message: string;
    isOpen: boolean;
  } | null>(null);
  const account = useActiveAccount();

  const showNotification = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    setNotification({ type, title, message, isOpen: true });
  };

  // 处理用户登录
  const handleLogin = async (walletaddress: string) => {
    try {
      console.log('Starting login process for:', walletaddress);
      
      // 1. 检查用户是否已存在
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('walletaddress', walletaddress)
        .single();

      console.log('Existing user check:', existingUser);

      if (!existingUser) {
        console.log('Creating new user...');
        // 2. 创建新用户记录
        const { error: createError } = await supabase.from('users').insert({
          walletaddress: walletaddress,
          createdat: new Date().toISOString(),
          isactive: true
        });

        if (createError) {
          console.error('Create user error:', createError);
          throw createError;
        }

        // 显示注册成功提示
        console.log('Showing success toast...');
        showNotification(
          'success',
          t('notification.types.success.register'),
          t('notification.types.success.registerMessage', { 
            address: walletaddress.slice(0, 6) 
          })
        );

        // 3. 处理推荐关系
        const referreraddress = searchParams.get('REF');
        if (referreraddress) {
          await handleReferral(walletaddress, referreraddress);
        }
      } else {
        console.log('Showing welcome back toast...');
        showNotification(
          'success',
          t('notification.types.success.welcomeBack'),
          t('notification.types.success.welcomeMessage', { 
            address: walletaddress.slice(0, 6) 
          })
        );
      }

      return true;
    } catch (error) {
      console.error("Login error:", error);
      showNotification(
        'error',
        t('notification.types.error.title'),
        t('notification.types.error.login')
      );
      return false;
    }
  };

  // 处理推荐关系
  const handleReferral = async (walletaddress: string, referreraddress: string) => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);

      // 1. 检查是否已经有推荐关系
      const { data: existingReferral } = await supabase
        .from('users')
        .select('*')
        .eq('walletaddress', walletaddress)
        .eq('referreraddress', referreraddress)
        .single();

      if (existingReferral) return;

      // 2. 验证推荐人信息
      const { data: referrer } = await supabase
        .from('users')
        .select('*')
        .eq('walletaddress', referreraddress)
        .single();

      if (!referrer) {
        showNotification(
          'error',
          t('notification.types.error.title'),
          t('notification.types.error.invalidReferrer')
        );
        return;
      }

      // 3. 从 URL 获取 zone 信息
      const placementarea = searchParams.get('ZONE') || 'Middle'; // 默认放在中区

      // 4. 更新用户的推荐关系
      const { error: updateError } = await supabase
        .from('users')
        .update({
          referreraddress: referreraddress,
          placementarea: placementarea // 记录放置区域
        })
        .eq('walletaddress', walletaddress);

      if (updateError) throw updateError;

      showNotification(
        'success',
        t('notification.types.success.title'),
        t('notification.types.success.referral')
      );
      console.log(`User placed in ${placementarea} zone under ${referreraddress}`);

    } catch (error) {
      console.error("Referral error:", error);
      showNotification(
        'error',
        t('notification.types.error.title'),
        t('notification.types.error.referral')
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <ThirdwebConnectButton
        client={client}
        wallets={wallets}
        connectModal={{
          size: "compact",
          showThirdwebBranding: false,
          title: t("common.connect"),
        }}
        accountAbstraction={{
          chain: optimism,
          sponsorGas: true,
        }}
        onConnect={async (connection: any) => {
          try {
            console.log("Connection data:", connection);
            const addressObj = connection.getAccount();
            console.log("Got address:", addressObj);
            
            let actualAddress = '';
            if (typeof addressObj === 'object' && addressObj.address) {
              actualAddress = addressObj.address;
            } else if (typeof addressObj === 'function') {
              const result = addressObj();
              actualAddress = result.address || result;
            } else if (typeof addressObj === 'string') {
              actualAddress = addressObj;
            }
            
            console.log("Actual address:", actualAddress);
            
            if (!actualAddress) {
              console.error("No valid address found");
              return;
            }
            
            await handleLogin(actualAddress);
            onConnect?.();
          } catch (error) {
            console.error("Connection error:", error);
            if (error instanceof Error && error.message !== "User closed login window") {
              toast.error(t("Failed to connect wallet"));
            }
          }
        }}
      />
      {notification && (
        <Notification
          {...notification}
          onClose={() => setNotification(null)}
        />
      )}
    </>
  );
}

export default ConnectButton;