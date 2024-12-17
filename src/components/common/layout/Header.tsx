import { useTranslation } from "react-i18next";
import logoWhite from "@/assets/logos/logo-white.png";
import { Link } from 'react-router-dom';
import { Menu } from '@headlessui/react';
import { IoLanguageOutline, IoChevronDownOutline } from 'react-icons/io5';
import { ConnectButton } from '@/components/auth/ConnectButton';

interface Language {
  code: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'th', name: 'ไทย', flag: '🇹🇭' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'ms', name: 'Bahasa Melayu', flag: '🇲🇾' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' }
];

export function Header() {
  const { t, i18n } = useTranslation();

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-black/30 backdrop-blur-lg border-b border-purple-500/20 z-50">
      <div className="container mx-auto px-4">
        <div className="h-14 flex items-center justify-between">
          {/* 左侧 Logo */}
          <Link to="/" className="flex items-center">
            <img src={logoWhite} alt="Logo" className="h-8 w-auto" />
          </Link>

          {/* 右侧功能区 */}
          <div className="flex items-center gap-4">
            {/* 语言切换菜单 */}
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-purple-900/30">
                <IoLanguageOutline className="w-4 h-4" />
                <span>{currentLanguage.flag}</span>
                <span>{currentLanguage.name}</span>
                <IoChevronDownOutline className="w-4 h-4" />
              </Menu.Button>

              <Menu.Items className="absolute right-0 mt-2 w-48 bg-black/90 backdrop-blur-lg border border-purple-500/20 rounded-xl shadow-lg overflow-hidden">
                <div className="py-1">
                  {languages.map((language) => (
                    <Menu.Item key={language.code}>
                      {({ active }) => (
                        <button
                          className={`
                            ${active ? 'bg-purple-900/50 text-white' : 'text-gray-300'}
                            group flex w-full items-center gap-2 px-4 py-2 text-sm
                          `}
                          onClick={() => i18n.changeLanguage(language.code)}
                        >
                          <span>{language.flag}</span>
                          <span>{language.name}</span>
                        </button>
                      )}
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Items>
            </Menu>

            {/* 连接钱包按钮 */}
            <ConnectButton />
          </div>
        </div>
      </div>
    </nav>
  );
}