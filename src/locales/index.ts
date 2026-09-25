import { SupportedLocale } from '../types/bi';
import { TranslationDictionary, LocaleMeta } from './types';
import { en } from './en';
import { hi } from './hi';
import { mr } from './mr';
import { gu } from './gu';
import { bn } from './bn';
import { ta } from './ta';
import { te } from './te';
import { kn } from './kn';
import { ml } from './ml';
import { ur } from './ur';

export * from './types';

export const SUPPORTED_LOCALES: LocaleMeta[] = [
  { code: 'en', name: 'English', nativeName: 'English', direction: 'ltr' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', direction: 'ltr' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', direction: 'ltr' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', direction: 'ltr' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', direction: 'ltr' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', direction: 'ltr' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', direction: 'ltr' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', direction: 'ltr' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', direction: 'ltr' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', direction: 'rtl' },
];

export const TRANSLATIONS: Record<SupportedLocale, TranslationDictionary> = {
  en,
  hi,
  mr,
  gu,
  bn,
  ta,
  te,
  kn,
  ml,
  ur,
};

export const getTranslation = (locale: SupportedLocale): TranslationDictionary => {
  return TRANSLATIONS[locale] || TRANSLATIONS.en;
};
