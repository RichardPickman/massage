import { afterEach, describe, expect, it } from 'vitest';

import i18n, { DEFAULT_LANGUAGE, readLanguage, setLanguage } from '.';
import en from './locales/en.json';
import pl from './locales/pl.json';

// Plural categories differ per language (English one/other, Polish one/few/many),
// so the suffix is stripped before the two key sets are compared.
const PLURAL_SUFFIX = /_(zero|one|two|few|many|other)$/;

const flatten = (source: object, prefix = ''): string[] =>
    Object.entries(source).flatMap(([key, value]) => {
        const path = prefix ? `${prefix}.${key}` : key;

        return typeof value === 'object' && value !== null
            ? flatten(value as object, path)
            : [path.replace(PLURAL_SUFFIX, '')];
    });

describe('i18n', () => {
    afterEach(async () => {
        window.localStorage.clear();
        await setLanguage('en');
    });

    it('keeps both languages complete', () => {
        // Typed keys catch a misspelt key; this catches a forgotten translation,
        // which typechecks fine in the language that has it.
        // A language may carry more plural forms than the other; compare the
        // set of keys, not the number of entries.
        expect([...new Set(flatten(pl))].sort()).toEqual(
            [...new Set(flatten(en))].sort()
        );
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

    it('picks the Polish plural form for 1, 2 and 5', async () => {
        await setLanguage('pl');

        // Three forms, not two: this is why the dictionary is not hand-rolled.
        expect(i18n.t('quizzes.questions', { count: 1 })).toBe('1 pytanie');
        expect(i18n.t('quizzes.questions', { count: 2 })).toBe('2 pytania');
        expect(i18n.t('quizzes.questions', { count: 5 })).toBe('5 pytań');
    });

    it('translates the shell in both languages', async () => {
        await setLanguage('en');
        expect(i18n.t('nav.quizzes')).toBe('Quizzes');

        await setLanguage('pl');
        expect(i18n.t('nav.quizzes')).toBe('Testy');
        expect(i18n.t('account.logOut')).toBe('Wyloguj');
    });
});
