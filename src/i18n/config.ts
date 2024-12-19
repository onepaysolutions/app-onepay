import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 导入翻译文件
import en from './locales/en.json';
import zh from './locales/zh.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';
import ms from './locales/ms.json';

// 简化的资源类型
type TranslationResource = {
  [key: string]: {
    translation: Record<string, any>;
  };
};

// 简化的资源配置
const resources: TranslationResource = {
  en: { translation: en },
  zh: { translation: zh },
  ja: { translation: ja },
  ko: { translation: ko },
  ms: { translation: ms }
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