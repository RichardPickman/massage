import type en from './locales/en.json';

// Typed keys: a key that does not exist in the English resource is a typecheck
// error, not a raw `lectures.save` rendered on the screen.
declare module 'i18next' {
    interface CustomTypeOptions {
        defaultNS: 'translation';
        resources: {
            translation: typeof en;
        };
    }
}
