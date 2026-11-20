import type { Answer } from '../../services/models';

export const DRAFT_KEY = 'quiz-constructor-draft';

// A 250-question quiz is not one sitting. A week is long enough to survive "I
// will finish this tomorrow" and short enough that a forgotten draft does not
// resurface months later as a puzzle.
export const DRAFT_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export interface DraftQuestion {
    id: string;
    question: string;
    answers: Answer[];
    correctAnswers: string[];
}

export interface ConstructorDraft {
    savedAt: number;
    title: string;
    threshold: string;
    questions: DraftQuestion[];
}

type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

const storageOrNull = (): StorageLike | null => {
    try {
        return window.localStorage;
    } catch {
        // Private mode and blocked storage throw on access, not on write.
        return null;
    }
};

// Images are deliberately not drafted: a File cannot be serialised, and silently
// restoring a question without its picture would be worse than not restoring it.
export const saveDraft = (
    draft: Omit<ConstructorDraft, 'savedAt'>,
    storage: StorageLike | null = storageOrNull()
) => {
    if (!storage) {
        return;
    }

    try {
        storage.setItem(
            DRAFT_KEY,
            JSON.stringify({ ...draft, savedAt: Date.now() })
        );
    } catch {
        // Full or unavailable storage must never break typing.
    }
};

export const isEmptyDraft = (draft: Omit<ConstructorDraft, 'savedAt'>) =>
    !draft.title.trim() &&
    draft.questions.every(
        (question) =>
            !question.question.trim() &&
            question.answers.every((answer) => !answer.text.trim())
    );

export const loadDraft = (
    storage: StorageLike | null = storageOrNull(),
    now: number = Date.now()
): ConstructorDraft | null => {
    if (!storage) {
        return null;
    }

    const raw = storage.getItem(DRAFT_KEY);

    if (!raw) {
        return null;
    }

    let parsed: ConstructorDraft;

    try {
        parsed = JSON.parse(raw) as ConstructorDraft;
    } catch {
        storage.removeItem(DRAFT_KEY);
        return null;
    }

    const wellFormed =
        parsed &&
        typeof parsed.savedAt === 'number' &&
        typeof parsed.title === 'string' &&
        Array.isArray(parsed.questions);

    if (!wellFormed || now - parsed.savedAt > DRAFT_TTL_MS) {
        storage.removeItem(DRAFT_KEY);
        return null;
    }

    if (isEmptyDraft(parsed)) {
        return null;
    }

    return parsed;
};

export const clearDraft = (storage: StorageLike | null = storageOrNull()) => {
    if (!storage) {
        return;
    }

    try {
        storage.removeItem(DRAFT_KEY);
    } catch {
        // Nothing to do: a stale draft expires on its own.
    }
};
