import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll } from 'vitest';

// The product defaults to Polish, the suite was written against the English copy.
// Pin the language once here instead of rewriting every assertion; Polish itself
// is covered by src/i18n/i18n.test.ts.
beforeAll(async () => {
    window.localStorage.setItem('massage.lang', 'en');

    const { setLanguage } = await import('../i18n');

    await setLanguage('en');
});

// Vitest runs without globals, so Testing Library cannot register its own
// cleanup hook; every test unmounts what it rendered here.
afterEach(() => {
    cleanup();
});
