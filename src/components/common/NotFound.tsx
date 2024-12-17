import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a1a] to-black pt-[72px]">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-lg mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">
            {t('app.404.title')}
          </h1>
          <p className="text-gray-400 mb-8">
            {t('app.404.message')}
          </p>
          <Link 
            to="/" 
            className="text-purple-500 hover:text-purple-400 transition-colors"
          >
            {t('app.404.backHome')}
          </Link>
        </div>
      </div>
    </div>
  );
} 