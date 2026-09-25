import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SupportedLocale } from '../types/bi';
import { TranslationDictionary, SUPPORTED_LOCALES, getTranslation, LocaleMeta } from '../locales';

interface I18nContextType {
  locale: SupportedLocale;
  setLocale: (newLocale: SupportedLocale) => void;
  t: TranslationDictionary;
  locales: LocaleMeta[];
  currentMeta: LocaleMeta;
  dir: 'ltr' | 'rtl';
}

const STORAGE_KEY = 'great_shift_locale_v2';

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<SupportedLocale>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as SupportedLocale;
      if (saved && ['en', 'hi', 'mr', 'gu', 'bn', 'ta', 'te', 'kn', 'ml', 'ur'].includes(saved)) {
        return saved;
      }
    } catch {
      // LocalStorage access fallback
    }
    return 'en';
  });

  const setLocale = (newLocale: SupportedLocale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem(STORAGE_KEY, newLocale);
    } catch {
      // ignore
    }
  };

  const currentMeta = SUPPORTED_LOCALES.find((l) => l.code === locale) || SUPPORTED_LOCALES[0];
  const t = getTranslation(locale);
  const dir = currentMeta.direction || 'ltr';

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = locale;
  }, [dir, locale]);

  return (
    <I18nContext.Provider
      value={{
        locale,
        setLocale,
        t,
        locales: SUPPORTED_LOCALES,
        currentMeta,
        dir,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
