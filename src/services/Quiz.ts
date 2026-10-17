import { load } from './loader';
import type {
    ApiResponse,
    QuizStats,
    SubmitResult,
    SubmittedAnswer,
} from './types';
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

    // Author only: the play view strips the answers, this one keeps them so a
    // quiz can be loaded back into the constructor.
    static async getQuizForEdit(id: string) {
        return load<ApiResponse<Quiz>>({
            url: `quiz/${id}/edit`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    // The server grades the submission; the client never supplies a score.
    static async submitQuiz(id: string, answers: SubmittedAnswer[]) {
        return load<ApiResponse<SubmitResult>>({
            url: `quiz/${id}/submit`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ answers }),
        });
    }

    static async getQuizStats(id: string) {
        return load<ApiResponse<QuizStats>>({
            url: `quiz/${id}/stats`,
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
