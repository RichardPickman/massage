import { load } from './loader';
import type { ApiResponse } from './types';
import type { Question } from './models';

class QuestionService {
    static async createQuestion(body: FormData) {
        return load<ApiResponse<Question>>({
            url: 'question/create',
            method: 'POST',
            body: body,
        });
    }

    static async getQuestion(id: string) {
        return load<ApiResponse<Question>>({
            url: `question/${id}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    static async updateQuestion(id: string, body: FormData) {
        return load<ApiResponse<Question>>({
            url: `question/update/${id}`,
            method: 'PUT',
            body: body,
        });
    }

    static async removeQuestion(id: string) {
        return load<ApiResponse<Question>>({
            url: `question/remove/${id}`,
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}

export default QuestionService;
