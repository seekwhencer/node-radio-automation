const
    fs = require('fs-extra'),
    slugify = require('slugify'),
    crypto = require('crypto'),
    Module = require('../Module');

module.exports = class Podcast extends Module {

    constructor(args) {
        return new Promise((resolve, reject) => {
            super(args);
            this.name = 'podcast';
            this.label = 'PODCAST';
            this.mergeOptions();

            LOG('');
            LOG(this.label, 'INIT', this.name);

            STORAGE.createFolder(this.path);

            this.on('ready', () => {
                LOG(this.label, '>>> READY');
                this.ready = true;
                if (this.options.autostart === true) {
                }
                resolve(this);
            });

            // save the channel as json
            this.save();

        });
    }

    mergeOptions(args) {
        if (!args) {
            this.options = R.mergeDeepLeft(this.args.options, CONFIG.podcast);
        } else {
            this.options = R.mergeDeepLeft(args, this.options);
        }

        if (!this.options.slug)
            this.options.slug = slugify(this.options.name, {replacement: '_', lower: true});

        if (!this.options.id)
            this.options.id = crypto.createHash('md5').update(`${Date.now()}`).digest("hex");

        this.id = this.options.id;
        this.name = this.options.name;
        this.slug = this.options.slug;

        this.options.conf_path = this.args.path;
        this.options.conf_file = P(`${this.options.conf_path}/${this.id}.json`);

        //this.path = `${this.options.conf_path}/${this.id}`;
        this.path =  P(`${APP_DIR}/${CONFIG.station.path.audio}/podcast/${this.id}`);
    }

    save() {
        fs.writeJsonSync(this.options.conf_file, this.options);
        this.emit('ready');
    }
};