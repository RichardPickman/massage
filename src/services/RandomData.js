class RandomData {
    static async getImage(width, height) {
        const url = new URL(`https://picsum.photos/${width}/${height}`);

        return fetch(url, {
            method: 'GET',
        });
    }

    static async getBeer(size) {
        const url = new URL(
            `https://random-data-api.com/api/v2/beers?size=${size}&response_type=json`
        );

        return fetch(url, {
            method: 'GET',
        })
            .then((res) => res.json())
            .then((res) => res);
    }
}

export default RandomData;
