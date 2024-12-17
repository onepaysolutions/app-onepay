import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { LAYOUT_CONFIG } from '@/config/layout';

export function Footer() {
  const { t } = useTranslation();

  const links = [
    { path: '/about', label: t('layout.about') },
    { path: '/blog', label: t('layout.blog') },
    { path: '/docs', label: t('layout.documentation') },
    { path: '/nft-market', label: t('layout.nftMarket') },
  ];

  return (
    <footer 
      className="fixed bottom-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-lg border-t border-purple-500/20"
      style={{ height: LAYOUT_CONFIG.footerHeight }}
    >
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <div className="text-sm text-gray-400">
          © 2024 OnePay. All rights reserved.
        </div>

        <nav className="hidden md:flex items-center gap-6">
          {links.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
} 