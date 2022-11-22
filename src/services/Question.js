import { load } from './loader';

class QuestionService {
    static async createQuestion(body) {
        return load({
            url: 'api/question/create',
            method: 'POST',
            body: body,
        });
    }

    static async getQuestion(id) {
        return load({
            url: `api/question/${id}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    static async updateQuestion(id, body) {
        return load({
            url: `api/question/update/${id}`,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
    }

    static async removeQuestion(id) {
        return load({
            url: `api/question/remove/${id}`,
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}

export default QuestionService;
