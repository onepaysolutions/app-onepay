import { Link, Outlet, useLocation } from 'react-router-dom';
import { Avatar } from '@/components/ui/avatar';
import { useActiveAccount } from 'thirdweb/react';
import { FiEdit3, FiUser, FiCalendar, FiBell, FiInfo } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import { Header } from '@/components/layout/Header';
import { TabBar } from '@/components/layout/TabBar';

interface UserProfile {
  id: string;
  nickname: string | null;
  avatar_url: string | null;
}

export function ProfileLayout() {
  const location = useLocation();
  const account = useActiveAccount();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      if (!account?.address) return;
      
      try {
        const { data, error } = await supabase
          .from('users')
          .select('id, nickname, avatar_url')
          .eq('walletaddress', account.address.toLowerCase())
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile');
      }
    }

    fetchProfile();
  }, [account?.address]);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !profile?.id) return;

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `avatars/${profile.id}/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      await supabase
        .from('users')
        .update({ avatar_url: publicUrl })
        .eq('id', profile.id);

      setProfile(prev => prev ? { ...prev, avatar_url: publicUrl } : null);
      toast.success('Avatar updated successfully');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload avatar');
    }
  };

  const tabs = [
    { path: '/profile', label: 'Profile', icon: FiUser },
    { path: '/profile/events', label: 'Events', icon: FiCalendar },
    { path: '/profile/updates', label: 'Updates', icon: FiInfo },
    { path: '/profile/notifications', label: 'Notifications', icon: FiBell }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900/20 via-black/50 to-black">
      <Header />
      
      {/* Profile Header Background */}
      <div className="relative">
        {/* 渐变背景 */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-purple-900/20 backdrop-blur" />
        
        {/* 装饰图案 */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
        </div>

        {/* Profile Header Content */}
        <div className="relative h-64 container mx-auto px-4 pt-[72px]">
          <div className="absolute left-1/2 -bottom-20 -translate-x-1/2 flex flex-col items-center">
            <div className="relative">
              <Avatar
                src={profile?.avatar_url || '/default-avatar.png'}
                alt={profile?.nickname || 'User'}
                size="lg"
                className="border-4 border-white/10 shadow-xl"
              />
              <label 
                className="absolute bottom-0 right-0 p-2 bg-purple-600/90 rounded-full cursor-pointer 
                  hover:bg-purple-500/90 transition-all duration-300 shadow-lg
                  hover:scale-110 active:scale-95"
                aria-label="Upload avatar"
              >
                <FiEdit3 className="w-5 h-5 text-white" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  aria-label="Upload avatar"
                />
              </label>
            </div>
            <h1 className="mt-4 text-xl font-medium text-white">
              {profile?.nickname || 'Anonymous'}
            </h1>
            <p className="text-sm text-gray-400 font-mono">
              {account?.address ? `${account.address.slice(0, 6)}...${account.address.slice(-4)}` : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="container mx-auto px-4 pt-24">
        <nav className="flex overflow-x-auto no-scrollbar">
          {tabs.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`
                flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all duration-300
                border-b-2 hover:text-purple-400
                ${location.pathname === path
                  ? 'border-purple-500 text-purple-400'
                  : 'border-transparent text-gray-400'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 pb-24">
        <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-purple-500/10 p-6">
          <Outlet />
        </div>
      </div>

      <TabBar />
    </div>
  );
} 