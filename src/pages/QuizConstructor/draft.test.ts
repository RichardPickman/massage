import { describe, expect, it, vi } from 'vitest';
import {
    clearDraft,
    DRAFT_KEY,
    DRAFT_TTL_MS,
    isEmptyDraft,
    loadDraft,
    saveDraft,
} from './draft';

const makeStorage = () => {
    const map = new Map<string, string>();

    return {
        getItem: (key: string) => map.get(key) ?? null,
        setItem: (key: string, value: string) => void map.set(key, value),
        removeItem: (key: string) => void map.delete(key),
        raw: map,
    };
};

const draft = {
    title: 'Cervical spine',
    threshold: '75',
    questions: [
        {
            id: 'q1',
            question: 'Which nerve innervates the masseter?',
            answers: [
                { id: 'a', text: 'Trigeminal' },
                { id: 'b', text: 'Facial' },
            ],
            correctAnswers: ['a'],
        },
    ],
};

describe('constructor draft', () => {
    it('round-trips title, threshold and questions', () => {
        const storage = makeStorage();

        saveDraft(draft, storage);
        const restored = loadDraft(storage);

        expect(restored?.title).toBe('Cervical spine');
        expect(restored?.threshold).toBe('75');
        expect(restored?.questions[0].correctAnswers).toEqual(['a']);
    });

    it('stamps the save time', () => {
        const storage = makeStorage();
        const before = Date.now();

        saveDraft(draft, storage);
        const restored = loadDraft(storage);

        expect(restored?.savedAt).toBeGreaterThanOrEqual(before);
    });

    it('expires after a week', () => {
        const storage = makeStorage();

        saveDraft(draft, storage);
        const restored = loadDraft(storage, Date.now() + DRAFT_TTL_MS + 1000);

        expect(restored).toBeNull();
        expect(storage.getItem(DRAFT_KEY)).toBeNull();
    });

    it('keeps a draft one day younger than the limit', () => {
        const storage = makeStorage();

        saveDraft(draft, storage);
        const restored = loadDraft(storage, Date.now() + DRAFT_TTL_MS - 1000);

        expect(restored).not.toBeNull();
    });

    it('drops corrupt json instead of throwing', () => {
        const storage = makeStorage();

        storage.setItem(DRAFT_KEY, '{not json');

        expect(loadDraft(storage)).toBeNull();
        expect(storage.getItem(DRAFT_KEY)).toBeNull();
    });

    it('ignores an empty draft', () => {
        const storage = makeStorage();

        saveDraft(
            {
                title: '',
                threshold: '50',
                questions: [
                    {
                        id: 'q1',
                        question: '  ',
                        answers: [{ id: 'a', text: '' }],
                        correctAnswers: [],
                    },
                ],
            },
            storage
        );

        expect(loadDraft(storage)).toBeNull();
        expect(
            isEmptyDraft({
                title: '',
                threshold: '50',
                questions: [
                    {
                        id: 'q1',
                        question: '',
                        answers: [{ id: 'a', text: ' ' }],
                        correctAnswers: [],
                    },
                ],
            })
        ).toBe(true);
    });

    it('clears on demand', () => {
        const storage = makeStorage();

        saveDraft(draft, storage);
        clearDraft(storage);

        expect(storage.getItem(DRAFT_KEY)).toBeNull();
    });

    it('survives storage throwing on write', () => {
        const storage = {
            getItem: () => null,
            setItem: vi.fn(() => {
                throw new Error('quota');
            }),
            removeItem: vi.fn(),
        };

        expect(() => saveDraft(draft, storage)).not.toThrow();
    });
});
