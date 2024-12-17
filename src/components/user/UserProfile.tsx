import { useTranslation } from "react-i18next";
import { useActiveAccount } from "thirdweb/react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { InfoSlider } from '../community/info/InfoSlider';
import type { Database } from "@/types/database";

type User = Database['public']['Tables']['users']['Row'];

export function UserProfile() {
  const { t } = useTranslation();
  const account = useActiveAccount();
  const [user, setUser] = useState<User | null>(null);
  const [referrer, setReferrer] = useState<User | null>(null);

  useEffect(() => {
    async function fetchUserData() {
      if (!account) return;

      try {
        // 获取用户信息
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('wallet', account.address)
          .single();

        if (userError) throw userError;
        setUser(userData);

        // 获取推荐人信息
        if (userData?.parent_id) {
          const { data: referrerData, error: referrerError } = await supabase
            .from('users')
            .select('*')
            .eq('id', userData.parent_id)
            .single();

          if (referrerError) throw referrerError;
          setReferrer(referrerData);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }

    fetchUserData();
  }, [account]);

  if (!account) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">{t("Please connect your wallet")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 信息卡片 */}
      <InfoSlider address={account.address} />

      {/* 推荐人信息 */}
      {referrer && (
        <div className="bg-purple-900/30 rounded-2xl p-6 backdrop-blur-sm">
          <h3 className="text-lg font-semibold mb-4">{t("Your Referrer")}</h3>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-purple-600/20 flex items-center justify-center">
              {referrer.avatar_url ? (
                <img 
                  src={referrer.avatar_url} 
                  alt="Referrer Avatar"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="text-sm">{referrer.name?.[0] || referrer.wallet.slice(0, 2)}</div>
              )}
            </div>
            <div>
              <p className="font-medium">{referrer.name || `${referrer.wallet.slice(0, 6)}...${referrer.wallet.slice(-4)}`}</p>
              <p className="text-sm text-gray-400">{t("Joined")}: {new Date(referrer.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      )}

      {/* 推荐链接部分 */}
      <div className="bg-purple-900/30 rounded-2xl p-8 backdrop-blur-sm">
        <h2 className="text-3xl font-bold mb-6">{t("Your Referral Link")}</h2>
        <div className="flex gap-4">
          <input
            type="text"
            value={`${window.location.origin}?REF=${account.address}`}
            readOnly
            aria-label="Referral Link"
            title="Your referral link"
            className="flex-1 bg-black/30 rounded-lg px-4 py-2"
          />
          <button 
            onClick={() => {
              navigator.clipboard.writeText(`${window.location.origin}?REF=${account.address}`);
            }}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition"
          >
            {t("Copy")}
          </button>
        </div>
      </div>
    </div>
  );
}