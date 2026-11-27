import { randomBytes } from 'node:crypto';
import { defineConfig, devices } from '@playwright/test';

// End-to-end runs use their own stack, never the deployed one:
//
//   * the API is `massage-backend/e2e/server.ts` — the real router and middleware on
//     an in-memory MongoDB seeded with one admin, one student, one lecture and one
//     quiz (ports 8281, so a dev API on 8280 is untouched);
//   * the web app is a production build pointed at that API, served by `vite preview`.
//
// Nothing here reads a secret: SECRET_KEY is a fixed test value, and the database is
// created and thrown away inside the run.
const API = 'http://127.0.0.1:8281';
const WEB = 'http://127.0.0.1:4173';

// Generated per run and handed to the API in its environment. A fixed string here
// would be a secret-shaped literal in the repository, which is exactly what the
// scanners are meant to catch: the point is that nothing has to be managed.
const SESSION_SECRET = randomBytes(32).toString('hex');

export default defineConfig({
    testDir: './e2e',
    // The suite shares one database: a test that registers a user would collide with
    // another running beside it.
    fullyParallel: false,
    workers: 1,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 1 : 0,
    timeout: 45_000,
    expect: { timeout: 10_000 },
    reporter: process.env.CI
        ? [['list'], ['html', { open: 'never' }]]
        : [['list']],
    use: {
        baseURL: WEB,
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        // The product defaults to Polish; the assertions below are English, so the
        // language is pinned before the app boots rather than translated per test.
        storageState: {
            cookies: [],
            origins: [
                {
                    origin: WEB,
                    localStorage: [{ name: 'massage.lang', value: 'en' }],
                },
            ],
        },
    },
    projects: [
        {
            name: 'desktop',
            use: {
                ...devices['Desktop Chrome'],
                viewport: { width: 1280, height: 800 },
            },
        },
        {
            name: 'mobile',
            use: { ...devices['Pixel 7'] },
        },
    ],
    webServer: [
        {
            // A script in that package, not `pnpm exec`: run through `pnpm run` the
            // entry point resolves from the package directory, which is where ts-node
            // looks for it.
            command: 'pnpm --dir ../massage-backend run e2e:api',
            // The auth throttle allows ten tries per quarter hour, which a suite that
            // signs in before every scenario trips on its own: the eleventh run answers
            // "Too many attempts" and the failure looks like a broken form.
            env: {
                SECRET_KEY: SESSION_SECRET,
                E2E_PORT: '8281',
                AUTH_ATTEMPT_LIMIT: '1000',
                AUTH_ATTEMPT_WINDOW_MS: '1000',
            },
            url: `${API}/api/health`,
            reuseExistingServer: !process.env.CI,
            timeout: 120_000,
        },
        {
            // `--host 127.0.0.1`: on a CI runner `vite preview` may bind the IPv6
            // loopback only, and the readiness probe then never sees the app. `open`
            // stays off — the preview server tried `xdg-open` on a machine without a
            // browser and that is a crash waiting to happen.
            command: `VITE_APP_API_URL=${API} pnpm build && pnpm exec vite preview --host 127.0.0.1 --port 4173 --strictPort --open false`,
            url: WEB,
            reuseExistingServer: !process.env.CI,
            timeout: 240_000,
        },
    ],
});
