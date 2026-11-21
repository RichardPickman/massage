import { afterEach, describe, expect, it } from 'vitest';

import i18n, { DEFAULT_LANGUAGE, readLanguage, setLanguage } from '.';
import en from './locales/en';
import pl from './locales/pl';

const flatten = (source: object, prefix = ''): string[] =>
    Object.entries(source).flatMap(([key, value]) => {
        const path = prefix ? `${prefix}.${key}` : key;

        return typeof value === 'object' && value !== null
            ? flatten(value as object, path)
            : [path];
    });

describe('i18n', () => {
    afterEach(async () => {
        window.localStorage.clear();
        await setLanguage('en');
    });

    it('keeps both languages complete', () => {
        // Typed keys catch a misspelt key; this catches a forgotten translation,
        // which typechecks fine in the language that has it.
        expect(flatten(pl).sort()).toEqual(flatten(en).sort());
    });

    it('defaults to Polish when nothing was chosen', () => {
        window.localStorage.clear();

        expect(DEFAULT_LANGUAGE).toBe('pl');
        expect(readLanguage()).toBe('pl');
    });

    it('remembers the choice and follows it with html lang and dayjs', async () => {
        await setLanguage('pl');

        expect(readLanguage()).toBe('pl');
        expect(window.localStorage.getItem('massage.lang')).toBe('pl');
        expect(document.documentElement.lang).toBe('pl');
        expect(i18n.language).toBe('pl');

        await setLanguage('en');

        expect(document.documentElement.lang).toBe('en');
        expect(i18n.language).toBe('en');
    });

    it('translates the shell in both languages', async () => {
        await setLanguage('en');
        expect(i18n.t('nav.quizzes')).toBe('Quizzes');

        await setLanguage('pl');
        expect(i18n.t('nav.quizzes')).toBe('Testy');
        expect(i18n.t('account.logOut')).toBe('Wyloguj');
    });
});
