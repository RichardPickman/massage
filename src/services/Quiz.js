import { load } from './loader';

class QuizService {
    static async createQuiz(body) {
        return load({
            url: 'api/quiz/create',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
    }

    static async updateQuiz(id, body) {
        return load({
            url: `api/quiz/update/${id}`,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
    }

    static async getQuiz(id, body) {
        return load({
            url: `api/quiz/${id}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
    }

    static async getAllQuizzes() {
        return load({
            url: 'api/quiz/all',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    static async removeQuiz(id) {
        return load({
            url: `api/quiz/remove/${id}`,
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}

export default QuizService;
