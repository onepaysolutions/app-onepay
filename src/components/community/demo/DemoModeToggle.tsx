import { useTranslation } from 'react-i18next';
import { FaPlayCircle } from 'react-icons/fa';

interface DemoModeToggleProps {
  isDemoMode: boolean;
  onToggle: () => void;
}

export function DemoModeToggle({ isDemoMode, onToggle }: DemoModeToggleProps) {
  const { t } = useTranslation();

  return (
    <button
      onClick={onToggle}
      className={`
        fixed bottom-4 right-4 z-50 
        px-4 py-2 rounded-lg
        flex items-center gap-2
        transition-all duration-200
        ${isDemoMode 
          ? 'bg-yellow-400/80 hover:bg-yellow-400 text-black'
          : 'bg-purple-600/80 hover:bg-purple-600 text-white'
        }
      `}
    >
      <FaPlayCircle className="text-lg" />
      <span className="text-sm font-medium">
        {isDemoMode ? t('demo.exit') : t('demo.start')}
      </span>
    </button>
  );
} 