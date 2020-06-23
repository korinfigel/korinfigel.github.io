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


        return (queryArr.length == 0) ? `https://res.cloudinary.com/${this.options.acctName}/image/upload/${formdata.codename}` : `https://res.cloudinary.com/${this.options.acctName}/image/upload/${queryArr.join(",")}/${formdata.codename}`;
    }

    setImagePreview(imageName) {
        document.getElementById('image').src = `https://res.cloudinary.com/${this.options.acctName}/image/upload/${imageName}`;
    }
}