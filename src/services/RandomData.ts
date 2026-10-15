import type { Beer } from './models';

class RandomData {
    static async getImage(width: number, height: number) {
        const url = new URL(`https://picsum.photos/${width}/${height}`);

        return fetch(url, {
            method: 'GET',
        });
    }

    static async getBeer(size: number) {
        const url = new URL(
            `https://random-data-api.com/v2/beers?size=${size}&response_type=json`
        );

        const response = await fetch(url, {
            method: 'GET',
        });

        return (await response.json()) as Beer | Beer[];
    }
}

export default RandomData;
