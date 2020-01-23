export default class SquidexManager {
    constructor(options) {
        this.options = options;
    }

    getAssets() {
        let { accessToken, tokenType, acctName } = this.options;

        return new Promise((resolved, rejected) => {
            // https://cloud.squidex.io/api/apps/${acctName}/assets
            fetch(`http://localhost/api/apps/test/assets`,
                    {
                        headers: {
                            Authorization: `${tokenType} ${accessToken}`
                        }
                    })
                .then(res => res.json())
                .then(res => resolved(res.items));
        });

    }

}
