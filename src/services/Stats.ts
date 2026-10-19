import { load } from './loader';
import type { ApiResponse, OverallStats } from './types';

class StatsService {
    // Every attempt the signed-in user has made, grouped per quiz.
    static async getMine() {
        return load<ApiResponse<OverallStats>>({
            url: 'stats',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}

export default StatsService;
