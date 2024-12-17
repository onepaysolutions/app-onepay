import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 导入所有翻译资源
import en from './locales/en.json';
import zh from './locales/zh.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';
import ms from './locales/ms.json';
import fr from './locales/fr.json';
import de from './locales/de.json';
import ar from './locales/ar.json';

// 定义资源类型
type TranslationResource = {
  [key: string]: {
    translation: typeof en;
  };
};

// 创建资源对象
const resources: TranslationResource = {
  en: { translation: en },
  zh: { translation: zh },
  ja: { translation: ja },
  ko: { translation: ko },
  ms: { translation: ms },
  fr: { translation: fr },
  de: { translation: de },
  ar: { translation: ar }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n; 