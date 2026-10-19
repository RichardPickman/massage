import js from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(
    {
        ignores: ['build/', 'coverage/', 'dist/', 'node_modules/'],
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        plugins: {
            react: pluginReact,
        },
        rules: {
            ...pluginReact.configs.recommended.rules,
            'react/prop-types': 'off',
            'react/react-in-jsx-scope': 'off',
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    }
);
