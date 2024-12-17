import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { FiUsers, FiTrendingUp, FiAward, FiStar } from 'react-icons/fi';

export function ReferralStats() {
  const { t } = useTranslation();

  const stats = [
    {
      icon: FiUsers,
      label: t("Total Referrals"),
      value: "0",
      color: "text-blue-400",
      bgColor: "bg-blue-400/10"
    },
    {
      icon: FiTrendingUp,
      label: t("Team Volume"),
      value: "$0",
      color: "text-green-400",
      bgColor: "bg-green-400/10"
    },
    {
      icon: FiAward,
      label: t("Glory Level"),
      value: "0",
      color: "text-purple-400",
      bgColor: "bg-purple-400/10"
    },
    {
      icon: FiStar,
      label: t("Total Rewards"),
      value: "0 USDC",
      color: "text-yellow-400",
      bgColor: "bg-yellow-400/10"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card
            key={index}
            variant="glass"
            className="relative overflow-hidden group hover:border-purple-500/30 transition-colors"
          >
            {/* 背景装饰 */}
            <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 blur-2xl bg-gradient-radial from-current to-transparent transition-opacity group-hover:opacity-20" />
            
            <div className="relative flex items-start gap-4 p-4">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              
              <div className="flex-1">
                <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
} 