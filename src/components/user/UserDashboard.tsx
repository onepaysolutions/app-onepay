import { useTranslation } from "react-i18next";
import { useActiveAccount } from "thirdweb/react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/database";
import { NFTInfoCard } from "../community/info/NFTInfoCard";
import { OPEInfoCard } from "../community/ope/OPEInfoCard";
import { ReferralCard } from "../common/cards/ReferralCard";

type User = Database['public']['Tables']['users']['Row'];

export function UserDashboard() {
  const { t } = useTranslation();
  const account = useActiveAccount();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      if (!account) return;

      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('wallet', account.address)
          .single();

        if (error) throw error;
        setUser(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      {/* 用户基本信息 */}
      <div className="bg-purple-900/30 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-purple-600/20 flex items-center justify-center">
            {user?.avatar_url ? (
              <img 
                src={user.avatar_url} 
                alt="Avatar"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="text-2xl">
                {user?.name?.[0] || account.address.slice(0, 2)}
              </div>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold">
              {user?.name || `${account.address.slice(0, 6)}...${account.address.slice(-4)}`}
            </h2>
            <p className="text-sm text-gray-400">
              {t("Joined")}: {user?.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
            </p>
          </div>
        </div>
      </div>

      {/* 信息卡片网格 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <OPEInfoCard />
        <ReferralCard />
      </div>

      {/* 用户荣誉徽章 */}
      {user?.badge && (
        <div className="bg-purple-900/30 rounded-2xl p-6 backdrop-blur-sm">
          <h3 className="text-lg font-semibold mb-4">{t("Badges")}</h3>
          <div className="flex gap-4">
            <div className="px-4 py-2 bg-purple-600/20 rounded-lg">
              {user.badge}
            </div>
          </div>
        </div>
      )}

      {/* 用户荣誉值 */}
      {user?.glory && user.glory > 0 && (
        <div className="bg-purple-900/30 rounded-2xl p-6 backdrop-blur-sm">
          <h3 className="text-lg font-semibold mb-4">{t("Glory Points")}</h3>
          <p className="text-3xl font-bold text-purple-400">{user.glory}</p>
        </div>
      )}
    </div>
  );
} 