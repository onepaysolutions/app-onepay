import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 导入翻译文件
import en from './locales/en.json';
import zh from './locales/zh.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';
import vi from './locales/vi.json';
import th from './locales/th.json';
import ms from './locales/ms.json';

const resources = {
  en: { translation: en },
  zh: { translation: zh },
  ja: { translation: ja },
  ko: { translation: ko },
  vi: { translation: vi },
  th: { translation: th },
  ms: { translation: ms },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: true, // 开发时打开调试
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n; 