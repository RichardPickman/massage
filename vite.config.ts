import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        port: 3000,
        open: true,
    },
    resolve: {
        alias: {
            '@': resolve(import.meta.dirname, './src'),
        },
    },
    test: {
        environment: 'jsdom',
        setupFiles: './src/test/setup.ts',
        include: ['src/**/*.test.{ts,tsx}'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'text-summary'],
            include: ['src/**/*.{ts,tsx}'],
            // shadcn primitives are vendored components with no logic of ours; the
            // entry point only mounts the app, and the test harness is not product
            // code. Counting them would push the number around without testing
            // anything.
            exclude: [
                'src/components/ui/**',
                'src/main.tsx',
                'src/test/**',
                'src/**/*.test.{ts,tsx}',
                'src/**/*.d.ts',
            ],
            // The gate, not a report: `pnpm test:coverage` fails under these.
            thresholds: {
                lines: 70,
                branches: 60,
            },
        },
    },
});
