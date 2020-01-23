export default class CloudinaryManager {
    constructor(options) {
        this.options = options;
    }

    createMediaString(formdata) {
        let mediaStr = (formdata.minWidth !== "") ? `media="(min-width: ${formdata.minWidth})"` : `media="(max-width: ${formdata.maxWidth})"`;
        return mediaStr;
    }

    createImageString(formdata) {
        let queryArr = [];

        if (formdata.width !== "") {
            queryArr.push("w_" + formdata.width + "px");
        }

        if (formdata.height !== "") {
            queryArr.push("h_" + formdata.height + "px");
        }

        if (formdata.gravity != "") {
            queryArr.push("g_" + formdata.gravity);
        }

        if (formdata.crop != "") {
            queryArr.push("c_" + formdata.crop);
        }

        let imgStr;
        let queryStr;

        if (queryArr.length < 1) {
            imgStr = `https://res.cloudinary.com/${this.options.acctName}/image/upload/${formData.codename}`;
        } else if (queryArr.length > 1) {
            for (var i = 0; i < queryArr.length; i++) {
                if (i == 0) {
                    queryStr = queryArr[i] + ",";
                } else if (i == (queryArr.length - 1)) {
                    queryStr = queryStr + queryArr[i];
                } else {
                    queryStr = queryStr + queryArr[i] + ",";
                }

                imgStr = `https://res.cloudinary.com/${acctName}/image/upload/${queryStr}/${formdata.codename}`;
            }
        }
        return imgStr;
    }
}