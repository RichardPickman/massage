import { expect, test, type Page } from '@playwright/test';

// The paths a student actually walks, end to end through the real router, the real
// API and a real database: guest → sign in → lectures → quiz → result, plus the
// admin panel. Unit tests cover the parts; only this proves the parts are wired
// together.

// The seed derives the password from the nickname (massage-backend/e2e/seed.ts), so
// the suite computes it the same way: no credential literal lives in the repository.
const passwordFor = (login: string) => `${login}-e2e-test`;

const STUDENT = 'studentka';
const ADMIN = 'kierownik';
const LECTURE_TOPIC = 'Anatomia zęba — test E2E';
const QUIZ_TITLE = 'Test E2E — instrumentarium';

const signIn = async (page: Page, login: string) => {
    await page.goto('/auth/login');

    // Scoped to the form: the header carries a "Sign in" control of its own, and a
    // page-wide lookup clicks that one instead of the submit button.
    const form = page.locator('form');

    await form.getByLabel('Nickname or email').fill(login);
    await form.getByLabel('Password').fill(passwordFor(login));
    await form.getByRole('button', { name: /sign in/i }).click();

    await expect(page).not.toHaveURL(/\/auth\/login$/);
};

test('a guest who opens the lectures is sent to sign-in', async ({ page }) => {
    await page.goto('/lectures');

    // The lectures sit behind a session; a guest used to land on the error page
    // because the loader ran before anything could redirect.
    await expect(page).toHaveURL(/\/auth\/login$/);
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
});

test('a student signs in and sees the lecture list', async ({ page }) => {
    await signIn(page, STUDENT);

    // Following the nav link from the overview is the path a student takes, but the
    // tab bar also carries one below `md`; the address is used so the assertion does
    // not depend on which of the two is on screen.
    await page.getByRole('link', { name: 'Lectures' }).first().click();
    await expect(page).toHaveURL(/\/lectures/);

    // Both the table (from `md`) and the card list (below it) are in the DOM, so the
    // topic matches twice on a desktop width.
    await expect(
        page.getByRole('link', { name: LECTURE_TOPIC }).first()
    ).toBeVisible();
});

test('a student opens a lecture and reads it', async ({ page }) => {
    await signIn(page, STUDENT);
    await page.goto('/lectures');

    await page.getByRole('link', { name: LECTURE_TOPIC }).first().click();

    await expect(page).toHaveURL(/\/lectures\/[0-9a-f]{24}$/);
    // The lecture screen is the image viewer: the topic stays in the list, and a
    // lecture without slides says so instead of showing an empty frame.
    await expect(page.getByText('This lecture has no images.')).toBeVisible();
});

// The server shuffles the questions of a test on every open, so a scenario cannot
// assume an order: it reads the answers on screen and decides from them which one
// is the right one.
const answerQuestion = async (
    page: Page,
    verdict: 'right' | 'wrong',
    last: boolean
) => {
    const answers = page.getByRole('group', { name: 'Answers' });
    const labels = await answers.getByRole('button').allInnerTexts();
    const isInstrumentQuestion = labels.some((label) =>
        label.includes('Kiretka')
    );

    const right = isInstrumentQuestion ? 'Kiretka' : '60%';
    const wrong = isInstrumentQuestion ? 'Kleszcze' : '50%';

    await answers
        .getByRole('button', { name: verdict === 'right' ? right : wrong })
        .click();
    await page
        .getByRole('button', { name: last ? 'Finish test' : 'Next' })
        .click();
};

test('a student answers every question and sees the result', async ({
    page,
}) => {
    await signIn(page, STUDENT);

    await page.goto('/quiz');
    await page.getByRole('link', { name: QUIZ_TITLE }).click();

    await expect(page.getByText(/Question 1 of 2/)).toBeVisible();

    // Both answers are right, so the verdict is a pass at the seeded 60% threshold.
    await answerQuestion(page, 'right', false);
    await answerQuestion(page, 'right', true);

    await expect(page.getByText(/2 of 2 right/)).toBeVisible();
    await expect(page.getByText('Passed')).toBeVisible();
});

test('a wrong answer is reported, not silently accepted', async ({ page }) => {
    await signIn(page, STUDENT);

    await page.goto('/quiz');
    await page.getByRole('link', { name: QUIZ_TITLE }).click();

    await answerQuestion(page, 'wrong', false);
    await answerQuestion(page, 'wrong', true);

    await expect(page.getByText(/0 of 2 right/)).toBeVisible();
    await expect(page.getByText('Not passed')).toBeVisible();
});

test('an admin reaches the registration code and the user list', async ({
    page,
}) => {
    await signIn(page, ADMIN);

    await page.goto('/admin');

    await expect(page.getByRole('tab', { name: /code/i })).toBeVisible();

    await page.getByRole('tab', { name: /users/i }).click();

    // Exact, because each row also prints the derived address that contains the
    // nickname.
    await expect(page.getByText(STUDENT, { exact: true })).toBeVisible();
    await expect(page.getByText(ADMIN, { exact: true })).toBeVisible();
});

test('signing out hides the content again', async ({ page }) => {
    await signIn(page, STUDENT);

    // The header button is hidden below `md`, where the account lives in the tab bar:
    // take whichever one is on screen.
    await page
        .getByRole('button', { name: /account/i })
        .filter({ visible: true })
        .first()
        .click();
    // The account menu is a popover of buttons, not an ARIA menu.
    await page.getByRole('button', { name: 'Log out' }).click();

    await page.goto('/lectures');

    await expect(page).toHaveURL(/\/auth\/login$/);
});
