import dayjs from 'dayjs';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import 'dayjs/locale/pl';

import en from './locales/en';
import pl from './locales/pl';

// The study group is Polish, so a visitor who has not chosen yet gets Polish;
// English is an explicit choice that is remembered.
export const DEFAULT_LANGUAGE = 'pl';
export const LANGUAGES = ['pl', 'en'] as const;

export type Language = (typeof LANGUAGES)[number];

const STORAGE_KEY = 'massage.lang';

const isLanguage = (value: string | null): value is Language =>
    value === 'pl' || value === 'en';

export const readLanguage = (): Language => {
    if (typeof window === 'undefined') {
        return DEFAULT_LANGUAGE;
    }

    const stored = window.localStorage.getItem(STORAGE_KEY);

    return isLanguage(stored) ? stored : DEFAULT_LANGUAGE;
};

// One place that keeps the three consumers in step: react-i18next, the document
// (screen readers and hyphenation) and dayjs (month names in dates).
export const setLanguage = (language: Language) => {
    window.localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
    dayjs.locale(language);

    return i18n.changeLanguage(language);
};

const initialLanguage = readLanguage();

document.documentElement.lang = initialLanguage;
dayjs.locale(initialLanguage);

i18n.use(initReactI18next).init({
    resources: {
        en: { translation: en },
        pl: { translation: pl },
    },
    lng: initialLanguage,
    fallbackLng: DEFAULT_LANGUAGE,
    interpolation: { escapeValue: false },
    returnNull: false,
    react: { useSuspense: false },
});

export default i18n;
