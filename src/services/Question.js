import { load } from './loader';

class QuestionService {
    static async createQuestion(body) {
        return load({
            url: 'api/question/create',
            method: 'POST',
            body: body,
            credentials: 'include',
        })
            .then((res) => res.json())
            .then((res) => res);
    }

    static async getQuestion(id) {
        return load({
            url: `api/question/${id}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then((res) => res);
    }

    static async updateQuestion(id, body) {
        return load({
            url: `api/question/update/${id}`,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(body),
        })
            .then((res) => res.json())
            .then((res) => res);
    }

    static async removeQuestion(id) {
        return load({
            url: `api/question/remove/${id}`,
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        })
            .then((res) => res.json())
            .then((res) => res);
    }
}

export default QuestionService;
