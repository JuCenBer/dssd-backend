import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './lang/en/translation.json';
import esTranslation from './lang/es/translation.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      es: { translation: esTranslation }
    },
    lng: 'es', // Idioma por defecto
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React ya se encarga de escapar
    }
  });

export default i18n;