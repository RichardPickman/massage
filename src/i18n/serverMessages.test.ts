import { describe, expect, it } from 'vitest';

import { setLanguage } from '.';
import { describeServerMessage } from './serverMessages';

describe('describeServerMessage', () => {
    it('translates a known code and ignores the English message', async () => {
        await setLanguage('pl');

        expect(describeServerMessage('attempt.saved', 'Attempt saved')).toBe(
            'Podejście zapisane'
        );

        await setLanguage('en');

        expect(describeServerMessage('attempt.saved', 'Attempt saved')).toBe(
            'Attempt saved'
        );
    });

    it('falls back to the server text for a code this build does not know', async () => {
        await setLanguage('pl');

        // A newer API must never render a raw key on the screen.
        expect(
            describeServerMessage('invented.fromTheFuture', 'Something new')
        ).toBe('Something new');
    });

    it('falls back when the response carries no code at all', () => {
        expect(describeServerMessage(undefined, 'Plain message')).toBe(
            'Plain message'
        );
    });
});
