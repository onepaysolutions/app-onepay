import { useTranslation } from "react-i18next";
import { useActiveAccount } from "thirdweb/react";
import { useState, useEffect } from "react";
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import { FiEdit3, FiCopy, FiStar, FiFeather, FiMessageCircle, FiTwitter, FiSend, FiLink } from 'react-icons/fi';
import { truncateAddress } from '@/utils/address';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { UserProfile } from '@/components/user/UserProfile';
import { Notification } from '@/components/profile/notification/Notification';
import { EventRegistration } from '@/components/profile/event/EventRegistration';
import { CompanyUpdates } from '@/components/profile/updates/CompanyUpdates';
import { NFTDisplay } from '@/components/nft/NFTDisplay';
import { ContentCard } from '@/components/common/cards/ContentCard';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { ChevronDownIcon } from "@/components/ui/chevron-down";
import { PageContainer } from '@/components/layout/PageContainer';
import { CardContainer } from '@/components/layout/CardContainer';
import { AngelNFT } from '@/components/nft/AngelNFT';

interface UserProfile {
  id: string;
  nickname: string | null;
  avatar_url: string | null;
  wallets: {
    address: string;
    is_primary: boolean;
  }[];
  social?: {
    discord?: string;
    twitter?: string;
    telegram?: string;
  };
}

export function Profile() {
  const { t } = useTranslation();
  const account = useActiveAccount();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 头像上传处理
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !account?.address) return;

    try {
      const uploadingToast = toast.loading('Uploading avatar...');

      // 1. 确保用户已认证
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      // 2. 生成文件路径
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${session.user.id}/${fileName}`; // 使用用户ID作为文件夹名

      // 3. 上传文件
      const { error: uploadError, data } = await supabase.storage
        .from('user')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // 4. 获取公开URL
      const { data: { publicUrl } } = supabase.storage
        .from('user')
        .getPublicUrl(filePath);

      // 5. 更新用户记录
      const { error: updateError } = await supabase
        .from('users')
        .update({ 
          avatar_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('walletaddress', account.address.toLowerCase());

      if (updateError) throw updateError;

      // 6. 更新本地状态
      setProfile(prev => prev ? {
        ...prev,
        avatar_url: publicUrl
      } : null);

      toast.success('Avatar updated successfully');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload avatar');
    } finally {
      toast.dismiss();
    }
  };

  return (
    <PageContainer withHeader={false} size="md">
      {/* 顶部背景和头像 */}
      <div className="relative -mx-4 sm:-mx-6 md:-mx-8">
        {/* 背景图 */}
        <div className="h-48 md:h-64 w-full bg-gradient-to-r from-purple-600 to-blue-600 safe-area-top" />
        
        {/* 个人信息卡片 */}
        <div className="absolute left-4 right-4 md:left-6 md:right-6 lg:left-8 lg:right-8 -bottom-24 md:-bottom-20">
          <CardContainer>
            <div className="p-6 flex flex-col md:flex-row items-center gap-4">
              {/* 头像部分 */}
              <div className="relative shrink-0">
                <Avatar
                  src={profile?.avatar_url || '/default-avatar.png'}
                  alt={profile?.nickname || 'User'}
                  className="w-24 h-24 md:w-28 md:h-28 border-4 border-purple-500/20 rounded-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/default-avatar.png';
                  }}
                />
                <label 
                  htmlFor="avatarUpload" 
                  className="absolute bottom-0 right-0 p-2 bg-purple-600 rounded-full cursor-pointer hover:bg-purple-700 transition-colors"
                
                  >
                  <FiEdit3 className="w-5 h-5 text-white" />
                  <input
                    id="avatarUpload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                  />
                </label>
              </div>

              {/* ���户信息 */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold mb-1">
                  {profile?.nickname || 'Anonymous'}
                </h2>
                <div className="flex items-center justify-center md:justify-start gap-2 text-gray-400">
                  <span className="font-mono text-sm">
                    {truncateAddress(account?.address || '')}
                  </span>
                  <button
                    title="Copy Address"
                    onClick={() => {
                      navigator.clipboard.writeText(account?.address || '');
                      toast.success('Address copied');
                    }}
                    className="p-1 hover:bg-purple-600/20 rounded transition-colors"
                  >
                    <FiCopy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </CardContainer>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="pt-32 md:pt-28 pb-8">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="w-full flex overflow-x-auto scrollbar-none mb-6 bg-purple-900/20 p-1 rounded-lg sticky top-0 z-10 backdrop-blur-lg">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="updates">Updates</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <div className="space-y-6">
            <TabsContent value="profile">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* NFT Assets */}
                <ContentCard title="NFT Assets">
                  <Collapsible>
                    <CollapsibleTrigger className="w-full">
                      <div className="flex items-center justify-between p-4 hover:bg-purple-600/10 rounded-lg transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-600/20 rounded-lg">
                            <FiStar className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-medium">Star NFT</h4>
                            <p className="text-sm text-gray-400">View your Star NFT collection</p>
                          </div>
                        </div>
                        <ChevronDownIcon className="w-5 h-5 transition-transform duration-200" />
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-4 pb-4">
                      <NFTDisplay type="star" address={account?.address} />
                    </CollapsibleContent>
                  </Collapsible>

                  <Collapsible>
                    <CollapsibleTrigger className="w-full">
                      <div className="flex items-center justify-between p-4 hover:bg-purple-600/10 rounded-lg transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-600/20 rounded-lg">
                            <FiFeather className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-medium">Angel NFT</h4>
                            <p className="text-sm text-gray-400">View your Angel NFT collection</p>
                          </div>
                        </div>
                        <ChevronDownIcon className="w-5 h-5 transition-transform duration-200" />
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-4 pb-4">
                      <AngelNFT address={account?.address} />
                    </CollapsibleContent>
                  </Collapsible>
                </ContentCard>

                {/* Social Links */}
                <ContentCard title="Social Links">
                  <div className="space-y-4">
                    {Object.entries(profile?.social || {}).map(([platform, link]) => (
                      <div key={platform} className="flex items-center gap-3 p-4 bg-purple-900/20 rounded-lg">
                        <div className="p-2 bg-purple-600/20 rounded-lg">
                          {getSocialIcon(platform)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="capitalize font-medium">{platform}</h4>
                          <p className="text-sm text-gray-400 truncate">{link}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ContentCard>
              </div>
            </TabsContent>

            <TabsContent value="events">
              <EventRegistration />
            </TabsContent>

            <TabsContent value="updates">
              <CompanyUpdates />
            </TabsContent>

            <TabsContent value="notifications">
              <Notification />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </PageContainer>
  );
}

// 辅助函数：获取社交平台图标
function getSocialIcon(platform: string) {
  switch (platform.toLowerCase()) {
    case 'discord':
      return <FiMessageCircle className="w-5 h-5" />;
    case 'twitter':
      return <FiTwitter className="w-5 h-5" />;
    case 'telegram':
      return <FiSend className="w-5 h-5" />;
    default:
      return <FiLink className="w-5 h-5" />;
  }
} 