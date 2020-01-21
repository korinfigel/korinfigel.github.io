import SquidexManager from "./SquidexManager.js";
import CloudinaryManager from "./CloudinaryManager.js";

export default class UIManager {
    constructor(options) {
        this.options = options;
        this.formData = { codename: "", id: "", maxWidth: "", minWidth: "", width: "", height: "", crop: "", gravity: "", sourceTag: "" };
        this.data = { assets: [], sources: [] };
        this.sources = []; 
        this.form = new SquidexFormField();
        this.form.onInit(this.initializeSquidexManager.bind(this));
    }

    async initializeSquidexManager(ctx) {
        let { access_token, token_type } = ctx.user.user;
        this.options.accessToken = access_token;
        this.options.tokenType = token_type;

        this.squidexManager = new SquidexManager(this.options);
        this.cloudinaryManager = new CloudinaryManager(this.options);
        this.data.assets = await this.squidexManager.getAssets();
        this.buildAssetList();
 
        let maxSelect = document.getElementById('maxWidth');
        let minSelect = document.getElementById('minWidth');

        document.getElementById('asset-selector')
            .addEventListener('change', this.updateImagePreview.bind(this));

        minSelect.addEventListener('change', this.updateValues.bind(this));
        minSelect.addEventListener('change', (e) => {
            this.formData.minWidth = e.target.value;
                document.getElementById("maxWidth").setAttribute("disabled", "disabled");
                if (this.value == '')
                    document.getElementById("maxWidth").removeAttribute("disabled");
        });

        maxSelect.addEventListener('change', this.updateValues.bind(this));
        maxSelect.addEventListener('change', (e) => {
                    document.getElementById("minWidth").setAttribute("disabled", "disabled");
                    if (this.value == '')
                        document.getElementById("minWidth").removeAttribute("disabled");
            });

        document.getElementById('width')
            .addEventListener('change', this.updateValues.bind(this));
        document.getElementById('height')
            .addEventListener('change', this.updateValues.bind(this));
        document.getElementById('gravity')
            .addEventListener('change', this.updateValues.bind(this));
        document.getElementById('crop')
            .addEventListener('change', this.updateValues.bind(this));

        document.getElementById('addBtn')
            .addEventListener('click', this.add.bind(this));

        let initialVal = this.form.getValue();
        this.parseSourceString(initialVal);

        if (initialVal !== null) {
            this.initImagePreview(initialVal);
        }
    }

    add() {
        var sourcetag = this.buildItemPreview(this.formData);
        this.sources.push(this.formData);
        
        var ul = document.getElementById("item-preview");
        var li = document.createElement('li');
        li.setAttribute('id', sourcetag);
        li.innerHTML = `Image Name: ${this.formData.codename}  Width: ${this.formData.width}  Height: ${this.formData.height}  Gravity: ${this.formData.gravity}  Crop: ${this.formData.crop}`;
        li.addEventListener("click", e => this.parseSourceString(sourcetag));
        var removeButton = document.createElement('button');
        removeButton.className = "btn btn-secondary btn-sm";
        removeButton.appendChild(document.createTextNode("remove"));
        removeButton.addEventListener("click", e => this.removeItem(sourcetag));
        li.appendChild(removeButton);
        ul.appendChild(li);

        this.formData = { codename: this.formData.codename, id: this.formData.id, maxWidth: "", minWidth: "", width: "", height: "", crop: "", gravity: "", sourceTag: "" };
        var frm = document.getElementById('squidex-form');
        frm.reset();
        document.getElementById("maxWidth").removeAttribute("disabled");
        document.getElementById("minWidth").removeAttribute("disabled");
        document.getElementById('asset-selector').value = this.formData.codename;
    }

    parseSourceString(srcString) {
        let assetRegex = /([^\/])+[\.][^com]{3}/;
        let asset = assetRegex.exec(srcString)[0];
        document.getElementById('asset-selector').value = asset;
        this.formData.codename = document.getElementById('asset-selector').value;

        let mediaSizeRegex = /(?<mediaType>max|min)(?:-width:\s)(?<mediaSize>\d+)/;
        let widthRegex = /w_(?<width>\d+)/;
        let heightRegex = /h_(?<height>\d+)/;
        let gravityRegex = /g_(?<gravity>.+?)([,\/].*?)/;
        let cropRegex = /c_(?<crop>\w+)(?:,|\/)/;

        let minOrMax = mediaSizeRegex.exec(srcString).groups.mediaType;
        let minMaxValue = mediaSizeRegex.exec(srcString).groups.mediaSize;

        let isMax;
        if (minOrMax == "max") {
            isMax = true;
        } else {
            isMax = false;
        }

        if (isMax == false) {
            document.getElementById('minWidth').value = minMaxValue + "px";
            document.getElementById('maxWidth').value = "";
            this.formData.minWidth = minMaxValue;
        } else {
            document.getElementById('maxWidth').value = minMaxValue + "px";
            document.getElementById('minWidth').value = "";
            this.formData.maxWidth = minMaxValue;
        }

        let w = widthRegex.exec(srcString);
        document.getElementById('width').value = (w == null) ? "" : widthRegex.exec(srcString).groups.width;
        this.formData.width = document.getElementById('width').value;

        let h = heightRegex.exec(srcString);
        document.getElementById('height').value = (h == null) ? "" : heightRegex.exec(srcString).groups.height;
        this.formData.height = document.getElementById('height').value;

        let g = gravityRegex.exec(srcString);
        document.getElementById('gravity').value = (g == null) ? "" : gravityRegex.exec(srcString).groups.gravity;
        this.formData.gravity = document.getElementById('gravity').value;

        let c = cropRegex.exec(srcString);
        document.getElementById('crop').value = (c == null) ? "" : cropRegex.exec(srcString).groups.crop;
        this.formData.crop = document.getElementById('crop').value;
    }

    removeItem(sourcetag) {
        var element = document.getElementById(sourcetag);
        element.parentNode.removeChild(element);

        for (var i = 0; i < this.sources.length; i++) {
            if (this.sources[i].sourceTag == sourcetag) {
                this.sources.splice(i, 1);
            }
        }
    }

    updateValues(e) {
        for (name in this.formData) {
            if (e.target.name == name) {
                this.formData[name] = e.target.value;
            }
        }
    }

    initImagePreview() {
        let imageName = document.getElementById('asset-selector').value;
        document.getElementById('image').src = `https://res.cloudinary.com/${this.options.acctName}/image/upload/${imageName}`;
    }

    updateImagePreview(e) {
        this.formData.codename = e.target.value;
        this.formData.id = e.target.options[e.target.selectedIndex].id;

        document.getElementById('image').src  = `https://res.cloudinary.com/${this.options.acctName}/image/upload/${this.formData.codename}`;
    }

    updateValue(pictureStr) {
        let imageString = pictureStr;
        this.form.valueChanged(imageString);
    }

    buildItemPreview(selected) {
        let mediaString = this.cloudinaryManager.createMediaString(this.formData);
        let imgString = this.cloudinaryManager.createImageString(this.formData);

        let sourceTag = `<source ${mediaString} data-srcset="${imgString}">`;
        this.formData.sourceTag = sourceTag;
        
        this.updateValue(sourceTag);
        return sourceTag;
    }

    buildAssetList() {
        let assetSelector = document.getElementById('asset-selector');

        this.data.assets.forEach(item => {
            let opt = document.createElement('option');
            opt.label = item.slug;
            opt.value = item.fileName;
            opt.id = item.id;
            assetSelector.appendChild(opt);
        });
    }
}