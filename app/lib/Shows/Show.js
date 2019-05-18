const
    fs = require('fs-extra'),
    slugify = require('slugify'),
    crypto = require('crypto'),
    Module = require('../Module'),
    Playlist = require('./Playlist');

module.exports = class Show extends Module {

    constructor(args) {

        super(args);
        this.name = 'show';
        this.label = 'SHOW';
        this.mergeOptions();
        LOG(this.label, 'INIT', this.name);

        this.setOptionsFromStorage();

        this.playlist = new Playlist({
            options: {},
            show: this
        });
        this.save();
    }

    mergeOptions() {
        this.options = R.mergeDeepLeft(this.args.options, CONFIG.show.defaults);

        if (!this.options.slug)
            this.options.slug = slugify(this.options.name, {replacement: '_', lower: true});

        if (!this.options.id)
            this.options.id = crypto.createHash('md5').update(`${Date.now()}`).digest("hex");

        Object.keys(this.options.path).forEach((p) => {
            if (!this.options[p].path) {
                this.options[p].path = P(`${APP_DIR}/${CONFIG.station.path.audio}/${this.options.path[p]}/${this.options[p].folder}`);
            }
        });

        this.id = this.options.id;
        this.name = this.options.name;
        this.slug = this.options.slug;

        this.options.conf_path = this.args.path;
        this.options.conf_file = P(`${this.options.conf_path}/${this.id}.json`);
    }

    save() {
        fs.writeJsonSync(this.options.conf_file, this.options);
    }

    get channel() {
        return this._channel;
    }

    set channel(channel) {
        this._channel = channel;
        if (this.channel) {
            this.playlist.show = this; //  playlist 'show' setter
        }
    }

    setOptionsFromStorage() {
        LOG(this.label, 'BUILD FROM STORAGE');
        const options = STORAGE.fetch.one(this.options.conf_file);
        if (!options) {
            return false;
        }
        this.args = options; // override the existing options
        this.mergeOptions();
    }


};