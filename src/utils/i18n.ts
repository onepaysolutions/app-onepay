import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../i18n/locales/en.json';
import zh from '../i18n/locales/zh.json';
import ja from '../i18n/locales/ja.json';
import ko from '../i18n/locales/ko.json';
import th from '../i18n/locales/th.json';
import vi from '../i18n/locales/vi.json';
import ms from '../i18n/locales/ms.json';
import fr from '../i18n/locales/fr.json';
import ar from '../i18n/locales/ar.json';
import de from '../i18n/locales/de.json';

const resources = {
  en: { translation: en },
  zh: { translation: zh },
  ja: { translation: ja },
  ko: { translation: ko },
  th: { translation: th },
  vi: { translation: vi },
  ms: { translation: ms },
  fr: { translation: fr },
  ar: { translation: ar },
  de: { translation: de }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // 默认语言
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n; 