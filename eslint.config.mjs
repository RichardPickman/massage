import ts from '@eslint/ts';
import pluginReact from 'eslint-plugin-react';
import { defineConfig } from 'eslint/config';
import globals from 'globals';

export default defineConfig([
    {
        files: ['**/*.{js,mjs,cjs,jsx,tsx,ts}'],
        plugins: { ts },
        extends: ['ts/recommended'],
        languageOptions: { globals: globals.browser },
    },
    pluginReact.configs.flat.recommended,
]);
