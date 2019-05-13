const
    fs = require('fs-extra'),
    slugify = require('slugify'),
    crypto = require('crypto'),
    Module = require('../Module'),
    Mpd = require('./Mpd.js');

module.exports = class Channel extends Module {

    constructor(args) {
        return new Promise((resolve, reject) => {
            super(args);
            this.name = 'channel';
            this.label = 'CHANNEL';
            this.mergeOptions();
            LOG('');
            LOG(this.label, 'INIT', this.name);

            this.path = `${this.options.conf_path}/${this.id}`;
            STORAGE.createFolder(this.path);

            this.on('ready', () => {
                LOG(this.label, '>>> READY');
                this.ready = true;
                resolve(this);
            });

            this.mpd = new Mpd({
                channel: this,
                options: this.options.mpd
            });

            this.mpd.run();
            this.mpc = false;

            this.save();

            // set default show by config file
            this.setDefaultShow();
            this.checkReady();
        });
    }

    mergeOptions() {
        this.options = R.mergeDeepLeft(this.args.options, CONFIG.channel);

        if (!this.options.slug)
            this.options.slug = slugify(this.options.name, {replacement: '_', lower: true});

        if (!this.options.id)
            this.options.id = crypto.createHash('md5').update(`${Date.now()}`).digest("hex");

        this.id = this.options.id;
        this.name = this.options.name;
        this.slug = this.options.slug;

        this.options.playlist = this.options.slug;

        if (!this.options.mpd)
            this.options.mpd = {};

        this.options.mpd.id = this.options.id;
        this.options.mpd.name = this.options.name;
        this.options.mpd.slug = this.options.slug;
        this.options.mpd.autostart = this.options.autostart;

        if (!this.options.mpc)
            this.options.mpc = {};

        this.options.mpc.id = this.options.id;
        this.options.mpc.name = this.options.name;
        this.options.mpc.slug = this.options.slug;
        this.options.mpc.port = this.options.mpd.config.port;
        this.options.mpc.host = this.options.mpd.config.bind_to_address;

        this.options.conf_path = this.args.path;
        this.options.conf_file = P(`${this.options.conf_path}/${this.id}.json`);
    }

    save() {
        let save = this.options;
        save.mpd = R.merge(save.mpd, this.mpd.options);
        fs.writeJsonSync(this.options.conf_file, save);
    }

    setShow(match, field) {
        this.show = (SHOWS.get(match, field)); // @TODO clone it here
        this.show.channel = this;
        LOG(this.label, this.name, 'SELECTING SHOW', this.show.name);
    }

    setDefaultShow() {
        if (this.options.show) {
            const field = Object.keys(this.options.show)[0];
            this.setShow(this.options.show[field], field);
        }
    }

    checkReady() {
        LOG(this.label,this.name, 'CHECK IF MPD AND MPC IS READY...', this.mpd.ready, this.mpc.ready);
        //@TODO if (this.mpd.ready && this.mpc.ready) {
        if (this.mpd.ready) {
            this.emit('ready');
        } else {
            setTimeout(() => {
                this.checkReady();
            }, this.options.checkup_delay);
        }
    }

    get path() {
        return this._path;
    }

    set path(path) {
        this._path = path;
    }
};