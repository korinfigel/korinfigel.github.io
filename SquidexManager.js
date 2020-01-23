import UIManager from "./UIManager";

export default class SquidexManager {
    constructor(options) {
        this.options = options;
        this.form = new SquidexFormField();
        this.form.onInit(this.initializeSquidexManager.bind(this));
        this.form.onValueChanged(() => this.form.valueChanged(this.uiManager.sources.join("")))
    }

    async initializeSquidexManager(ctx) {
        let initialVal = this.form.getValue();
        if (initialVal !== null) {
            this.initForm(initialVal);
        }
        this.uiManager = new UIManager(this.options)
        this.uiManager.initializeUIManager(this.getAssets())
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
