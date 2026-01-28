import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { getSyncResources } from './translationService';

// Initialize i18next
// In a real app with a backend, we would use i18next-http-backend.
// Here we load the transformed resources directly from our mock service.

const resources = getSyncResources();

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false, // React already safe from XSS
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'], // 2. Frontend: Store user's preferred language in localStorage
    }
  });

export default i18n;