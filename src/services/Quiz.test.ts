import { beforeEach, describe, expect, it, vi } from 'vitest';
import { load } from './loader';
import QuizService from './Quiz';

vi.mock('./loader', () => ({ load: vi.fn() }));

const loadMock = vi.mocked(load);
const json = { 'Content-Type': 'application/json' };

describe('QuizService', () => {
    beforeEach(() => {
        loadMock.mockReset();
        loadMock.mockResolvedValue({} as never);
    });

    it('creates a quiz with a JSON body', () => {
        QuizService.createQuiz({ title: 'Test', questions: [] } as never);

        expect(loadMock).toHaveBeenCalledWith({
            url: 'quiz/create',
            method: 'POST',
            headers: json,
            body: JSON.stringify({ title: 'Test', questions: [] }),
        });
    });

    it('sends the id inside the update body as well as in the path', () => {
        QuizService.updateQuiz('abc', {
            title: 'Nowy',
            questions: [],
        } as never);

        expect(loadMock).toHaveBeenCalledWith({
            url: 'quiz/update/abc',
            method: 'PUT',
            headers: json,
            body: JSON.stringify({ id: 'abc', title: 'Nowy', questions: [] }),
        });
    });

    it('reads a quiz for playing', () => {
        QuizService.getQuiz('abc');

        expect(loadMock).toHaveBeenCalledWith({
            url: 'quiz/abc',
            method: 'GET',
            headers: json,
        });
    });

    it('reads a quiz for editing from its own endpoint', () => {
        QuizService.getQuizForEdit('abc');

        expect(loadMock).toHaveBeenCalledWith({
            url: 'quiz/abc/edit',
            method: 'GET',
            headers: json,
        });
    });

    it('submits answers and never a score', () => {
        const answers = [{ question: 'q1', selected: ['a'] }];

        QuizService.submitQuiz('abc', answers as never);

        expect(loadMock).toHaveBeenCalledWith({
            url: 'quiz/abc/submit',
            method: 'POST',
            headers: json,
            body: JSON.stringify({ answers }),
        });
    });

    it('reads the statistics of one quiz', () => {
        QuizService.getQuizStats('abc');

        expect(loadMock).toHaveBeenCalledWith({
            url: 'quiz/abc/stats',
            method: 'GET',
            headers: json,
        });
    });

    it('reads one page of quizzes', () => {
        QuizService.getQuizzesPage(3, 10);

        expect(loadMock).toHaveBeenCalledWith({
            url: 'quiz/all?page=3&limit=10',
            method: 'GET',
            headers: json,
        });
    });

    it('removes a quiz', () => {
        QuizService.removeQuiz('abc');

        expect(loadMock).toHaveBeenCalledWith({
            url: 'quiz/remove/abc',
            method: 'POST',
            headers: json,
            body: JSON.stringify({ id: 'abc' }),
        });
    });
});
