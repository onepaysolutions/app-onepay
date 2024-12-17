import { useTranslation } from 'react-i18next';
import { FiEdit3, FiCopy, FiExternalLink } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { Avatar } from '@/components/ui/avatar';
import { truncateAddress } from '@/utils/address';
// UserProfile 类型的定义已移除
import { Badge } from '@/components/ui/badge';

interface ProfileInfoProps {
  profile: any | null;
  address?: string;
  onAvatarUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ProfileInfo({ profile, address, onAvatarUpload }: ProfileInfoProps) {
  const { t } = useTranslation();

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast.success(t('common.copied'));
    }
  };

  return (
    <div className="p-6 flex flex-col md:flex-row items-center gap-6">
      {/* 头像部分 */}
      <div className="relative shrink-0 group">
        <div className="relative">
          <Avatar
            src={profile?.avatar_url || '/default-avatar.png'}
            alt={profile?.nickname || 'User'}
            className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover ring-4 ring-purple-500/20 group-hover:ring-purple-500/40 transition-all duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/default-avatar.png';
            }}
          />
          <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        <label 
          htmlFor="avatarUpload" 
          className="absolute bottom-0 right-0 p-2 bg-purple-600 rounded-full cursor-pointer hover:bg-purple-500 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
          aria-label={t('profile.uploadAvatar')}
          title={t('profile.uploadAvatar')}
        >
          <FiEdit3 className="w-5 h-5 text-white" />
          <input
            id="avatarUpload"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={onAvatarUpload}
            aria-label={t('profile.uploadAvatar')}
          />
        </label>
      </div>

      {/* 用户信息 */}
      <div className="flex-1 text-center md:text-left space-y-3">
        <div>
          <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
            <h2 className="text-2xl font-bold">
              {profile?.nickname || t('common.anonymous')}
            </h2>
            {profile?.level && (
              <Badge variant="success" glow>Level {profile.level}</Badge>
            )}
          </div>
          <div className="flex items-center justify-center md:justify-start gap-2 text-gray-400">
            <span className="font-mono text-sm">
              {truncateAddress(address || '')}
            </span>
            <button
              onClick={handleCopyAddress}
              className="p-1.5 hover:bg-purple-600/20 rounded-lg transition-colors"
              aria-label={t('common.copyAddress')}
              title={t('common.copyAddress')}
            >
              <FiCopy className="w-4 h-4" />
            </button>
            {address && (
              <a
                href={`https://etherscan.io/address/${address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 hover:bg-purple-600/20 rounded-lg transition-colors"
                aria-label={t('common.viewOnExplorer')}
                title={t('common.viewOnExplorer')}
              >
                <FiExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {profile?.created_at && (
          <p className="text-sm text-gray-400">
            {t('profile.memberSince', {
              date: new Date(profile.created_at).toLocaleDateString()
            })}
          </p>
        )}
      </div>
    </div>
  );
} 