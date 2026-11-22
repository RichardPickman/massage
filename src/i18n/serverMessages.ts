import i18n from '.';

// Codes the API sends next to its English `message` (see the backend ticket).
// The list is closed on purpose: a code the app does not know must fall back to
// the server's text, never to a blank line.
export type ServerMessageCode =
    | 'lecture.created'
    | 'lecture.updated'
    | 'lecture.notFound'
    | 'lecture.updateFailed'
    | 'quiz.created'
    | 'quiz.createFailed'
    | 'quiz.notFound'
    | 'quiz.removed'
    | 'quiz.invalidThreshold'
    | 'attempt.saved'
    | 'common.forbidden'
    | 'common.invalidInputs'
    | 'common.imageUploadFailed'
    | 'auth.notAuthorised'
    | 'auth.invalidEmail'
    | 'user.removed';

export const describeServerMessage = (
    code: string | undefined,
    fallback: string
): string => {
    if (!code) {
        return fallback;
    }

    const key = `server.${code}`;

    // A newer server may send a code this build has never heard of; the English
    // message is still better than a raw key on the screen.
    return i18n.exists(key) ? i18n.t(key as never) : fallback;
};
