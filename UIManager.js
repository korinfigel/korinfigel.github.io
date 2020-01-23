import CloudinaryManager from "./CloudinaryManager.js";
import SquidexManager from "./SquidexManager.js";

export default class UIManager {
    constructor(options, assets) {
        this.options = options;
        this.formData = { codename: "", id: "", maxWidth: "", minWidth: "", width: "", height: "", crop: "", gravity: "", sourceTag: "" };
        this.assets = assets;
        this.sources = []; 
        this.initializeUIManager();
    }

    async initializeUIManager() {
        this.cloudinaryManager = new CloudinaryManager(this.options);
        this.squidexManager = new SquidexManager(this.options);
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
    }

    initForm(sourcesString) {
        let sourcesArr = "";
        sourcesArr = sourcesString.split('>');
        sourcesArr.pop();

        sourcesArr.forEach(source => {
            let parsedSource = this.regexParser(source);

            this.formData.codename = parsedSource.image;
            this.formData.maxWidth = parsedSource.maxWidth;
            this.formData.minWidth = parsedSource.minWidth;
            this.formData.width = parsedSource.width;
            this.formData.height = parsedSource.height;
            this.formData.gravity = parsedSource.gravity;
            this.formData.crop = parsedSource.crop;

            this.add();
        });

        this.cloudinaryManager.setImagePreview(this.formData.codename);
    }

    add() {
        let sourcetag = this.buildSourceTag(this.formData);
        this.sources.push(this.formData);
        
        let ul = document.getElementById("item-preview");
        let li = document.createElement('li');
        li.setAttribute('id', sourcetag);

        li.innerHTML = (this.formData.minWidth !== "") ? `<b>Min Width:</b> ${this.formData.minWidth}  <b>Width:</b> ${this.formData.width}  <b>Height:</b> ${this.formData.height}  <b>Gravity:</b> ${this.formData.gravity}  <b>Crop:</b> ${this.formData.crop}` : `<b>Max Width:</b> ${this.formData.maxWidth}  <b>Width:</b> ${this.formData.width}  <b>Height:</b> ${this.formData.height}  <b>Gravity:</b> ${this.formData.gravity}  <b>Crop:</b> ${this.formData.crop}`;

        li.addEventListener("click", e => this.parseSourceString(e, sourcetag));
        let removeButton = document.createElement('button');
        removeButton.className = "btn btn-secondary btn-sm";
        removeButton.appendChild(document.createTextNode("remove"));
        removeButton.addEventListener("click", e => this.removeItem(e, sourcetag));
        li.appendChild(removeButton);
        ul.appendChild(li);

        this.formData = { codename: this.formData.codename, id: this.formData.id, maxWidth: "", minWidth: "", width: "", height: "", crop: "", gravity: "", sourceTag: "" };
        let frm = document.getElementById('squidex-form');
        frm.reset();
        document.getElementById("maxWidth").removeAttribute("disabled");
        document.getElementById("minWidth").removeAttribute("disabled");
        document.getElementById('asset-selector').value = this.formData.codename;

        this.updateValue();
    }

    updateValue() {
        let allSourcesStr = "";
        for (var i = 0; i < this.sources.length; i++) {
            allSourcesStr = allSourcesStr + this.sources[i].sourceTag;
        }

        //this.form.valueChanged(allSourcesStr);
        this.squidexManager.updateFormValues(allSourcesStr);
    }

    regexParser(stringToBeParsed) {
        let parsed = { image: "", maxWidth: "", minWidth: "", width: "", height: "", crop: "", gravity: "", sourceTag: "" };

        let assetRegex = /([^\/])+[\.][^com]{3}/;
        let mediaSizeRegex = /(?<mediaType>max|min)(?:-width:\s)(?<mediaSize>\d+)/;
        let widthRegex = /w_(?<width>\d+)/;
        let heightRegex = /h_(?<height>\d+)/;
        let gravityRegex = /g_(?<gravity>.+?)([,\/].*?)/;
        let cropRegex = /c_(?<crop>\w+)(?:,|\/)/;

        let minOrMax = mediaSizeRegex.exec(stringToBeParsed).groups.mediaType;
        let minMaxValue = mediaSizeRegex.exec(stringToBeParsed).groups.mediaSize;

        let isMax = (minOrMax == "max") ? true : false;

        if (isMax == false) {
            parsed.minWidth = minMaxValue + "px";
            parsed.maxWidth = "";
        } else {
            parsed.maxWidth = minMaxValue + "px";
            parsed.minWidth = "";
        }
        
        let w = widthRegex.exec(stringToBeParsed);
        let h = heightRegex.exec(stringToBeParsed);
        let g = gravityRegex.exec(stringToBeParsed);
        let c = cropRegex.exec(stringToBeParsed);

        parsed.image = assetRegex.exec(stringToBeParsed)[0];
        parsed.width = (w == null) ? "" : widthRegex.exec(stringToBeParsed).groups.width;
        parsed.height = (h == null) ? "" : heightRegex.exec(stringToBeParsed).groups.height;
        parsed.gravity = (g == null) ? "" : gravityRegex.exec(stringToBeParsed).groups.gravity;
        parsed.crop = (c == null) ? "" : cropRegex.exec(stringToBeParsed).groups.crop;

        return parsed;
    }

    parseSourceString(e, srcString) {
        let selected = this.regexParser(srcString);

        document.getElementById('asset-selector').value = selected.image;
        this.formData.codename = document.getElementById('asset-selector').value;

        document.getElementById('minWidth').value = (selected.minWidth !== "") ? selected.minWidth : "";
        this.formData.minWidth = document.getElementById('minWidth').value;

        document.getElementById('maxWidth').value = (selected.maxWidth !== "") ? selected.maxWidth : "";
        this.formData.maxWidth = document.getElementById('maxWidth').value

        document.getElementById('width').value = selected.width;
        this.formData.width = document.getElementById('width').value;
        document.getElementById('height').value = selected.height;
        this.formData.height = document.getElementById('height').value;
        document.getElementById('gravity').value = selected.gravity;
        this.formData.gravity = document.getElementById('gravity').value;
        document.getElementById('crop').value = selected.crop;
        this.formData.crop = document.getElementById('crop').value;

        this.buildSourceTag();
    }

    removeItem(e, sourcetag) {
        let element = document.getElementById(sourcetag);
        element.parentNode.removeChild(element);

        for (var i = 0; i < this.sources.length; i++) {
            if (this.sources[i].sourceTag == sourcetag) {
                this.sources.splice(i, 1);
            }

            if (sourcetag == this.formData.sourceTag) {
                document.getElementById('maxWidth').value = "";
                this.formData.maxWidth = "";
                document.getElementById('minWidth').value = "";
                this.formData.minWidth = "";
                document.getElementById('width').value = "";
                this.formData.width = "";
                document.getElementById('height').value = "";
                this.formData.height = "";
                document.getElementById('gravity').value = "";
                this.formData.gravity = "";
                document.getElementById('crop').value = "";
                this.formData.crop = "";
            }
        }
        this.updateValue();
        e.stopPropagation()
    }

    updateValues(e) {
        for (name in this.formData) {
            if (e.target.name == name) {
                this.formData[name] = e.target.value;
            }
        }
    }

    updateImagePreview(e) {
        this.formData.codename = e.target.value;
        this.formData.id = e.target.options[e.target.selectedIndex].id;

        this.cloudinaryManager.setImagePreview(this.formData.codename);
    }

    buildSourceTag() {
        let mediaString = this.cloudinaryManager.createMediaString(this.formData);
        let imgString = this.cloudinaryManager.createImageString(this.formData);

        let sourceTag = `<source ${mediaString} data-srcset="${imgString}">`;
        this.formData.sourceTag = sourceTag;

        return sourceTag;
    }

    buildAssetList() {
        let assetSelector = document.getElementById('asset-selector');

        this.assets.forEach(item => {
            let opt = document.createElement('option');
            opt.label = item.slug;
            opt.value = item.fileName;
            opt.id = item.id;
            assetSelector.appendChild(opt);
        });
    }
}