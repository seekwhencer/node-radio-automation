const
    fs = require('fs-extra'),
    slugify = require('slugify'),
    crypto = require('crypto'),
    Module = require('../Module'),
    Downloader = require('./Downloader.js');

module.exports = class Podcast extends Module {

    constructor(args) {
        super(args);
        return new Promise((resolve, reject) => {
            this.name = 'podcast';
            this.label = 'PODCAST';
            this.mergeOptions();

            LOG('');
            LOG(this.label, 'INIT', this.name);

            STORAGE.createFolder(this.path);

            this.downloader = new Downloader({
                path: this.path,
                url: this.options.url,
                limit: this.options.limit
            });


            this.on('ready', () => {
                LOG(this.label, '>>> READY', this.name);
                this.ready = true;
                if (this.options.autostart === true) {
                    this.downloader
                        .fetch()
                        .then(items => {
                            LOG(this.label, 'EPISODES:', items.length);
                            resolve(this);
                        });
                } else {
                    resolve(this);
                }
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
            this.options.id = `id${crypto.createHash('md5').update(`${Date.now()}`).digest("hex")}`;

        this.id = this.options.id;
        this.name = this.options.name;
        this.slug = this.options.slug;

        this.options.conf_path = this.args.path;
        this.options.conf_file = P(`${this.options.conf_path}/${this.id}.json`);

        this.path = P(`${APP_DIR}/${CONFIG.station.path.audio}/podcast/${this.id}`);
    }

    save() {
        fs.writeJsonSync(this.options.conf_file, this.options);
        this.emit('ready');
    }
};