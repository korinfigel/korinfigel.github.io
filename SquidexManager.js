import UIManager from "./UIManager.js";

export default class SquidexManager {
    constructor(options) {
        this.options = options;
        this.form = new SquidexFormField();
        this.form.onInit(this.initializeSquidexManager.bind(this));
    }

    async initializeSquidexManager(ctx) {
        let { access_token, token_type } = ctx.user.user;
        this.options.accessToken = access_token;
        this.options.tokenType = token_type;

        let assets = await this.getAssets();
        this.uiManager = new UIManager(this.options, assets);

        let initialVal = this.form.getValue();
        if (initialVal !== null) {
            this.uiManager.initForm(initialVal);
        }
    }

    getAssets() {
        let { accessToken, tokenType, appName, baseUrl } = this.options;

        return new Promise((resolved, rejected) => {
            fetch(`http://${baseUrl}/api/apps/${appName}/assets`,
                    {
                        headers: {
                            Authorization: `${tokenType} ${accessToken}`
                        }
                    })
                .then(res => res.json())
                .then(res => resolved(res.items))
                .catch(err => rejected(err))
        });

    }

}
