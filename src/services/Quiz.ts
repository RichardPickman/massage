import { load } from './loader';
import type { ApiResponse } from './types';
import type { Quiz, QuizPayload, QuizSummary } from './models';

class QuizService {
    static async createQuiz(body: QuizPayload) {
        return load<ApiResponse<QuizSummary>>({
            url: 'quiz/create',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
    }

    static async updateQuiz(id: string, body: QuizPayload) {
        return load<ApiResponse<QuizSummary>>({
            url: `quiz/update/${id}`,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, ...body }),
        });
    }

    static async getQuiz(id: string) {
        return load<ApiResponse<Quiz>>({
            url: `quiz/${id}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    static async getAllQuizzes() {
        return load<ApiResponse<QuizSummary[]>>({
            url: 'quiz/all',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    static async removeQuiz(id: string) {
        return load<ApiResponse<QuizSummary>>({
            url: `quiz/remove/${id}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }),
        });
    }
}

export default QuizService;
