const
    fs = require('fs-extra'),
    slugify = require('slugify'),
    crypto = require('crypto'),
    Module = require('../Module'),
    Shows = require('../Shows'),
    Schedules = require('../Schedules'),
    Show = require('../Shows//Show'),
    Mpd = require('./Mpd'),
    Mpc = require('./Mpc');

module.exports = class Channel extends Module {

    constructor(args) {
        super(args);

        return new Promise((resolve, reject) => {
            this.name = 'channel';
            this.label = 'CHANNEL';
            this.mergeOptions();

            LOG('');
            LOG(this.label, 'INIT', this.name);

            STORAGE.createFolder(this.path);

            this.on('ready', () => {
                LOG(this.label, '>>> READY');
                this.ready = true;
                if (this.options.autostart === true) {
                    setTimeout(() => {
                        this.initPlaylist();
                    }, 5000);
                }
                this.setStatus();
                resolve(this);
            });

            // Music Player Daemon
            this.initMPD();
            this.mpd.run();

            // Music Player Client
            this.initMPC();
            this.mpc.run();

            // save the channel as json
            this.save();

            // set default show by config file
            this
                .setShowsFromStorage()
                .then(() => {
                    return this.setSchedulesFromStorage();
                })
                .then(() => {
                    this.setDefaultShow();
                    this.checkReady();
                });

        });
    }

    mergeOptions(args) {
        if (!args) {
            this.options = R.mergeDeepLeft(this.args.options, CONFIG.channel);
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

        this.path = `${this.options.conf_path}/${this.id}`;
    }

    save() {
        let save = this.options;
        save.mpd = R.mergeDeepLeft(save.mpd, this.mpd.options);
        fs.writeJsonSync(this.options.conf_file, save);
    }

    delete() {
        this.shutdown();
        setTimeout(() => {
            fs.removeSync(this.path);
            fs.removeSync(this.options.conf_file);
            CHANNELS.delete(this.id);
        }, 5000);
    }

    /**
     * this is an important function!
     * this function assign a show to a channel
     * watch the setters: 'show.channel' and 'playlist.show'
     *
     * If you set a show to a channel, the playlist of a show will be:
     *  - generated instantly
     *  - saved and
     *  - played
     *
     * @param match
     * @param field
     */
    setShow(match, field) {
        const show = this.shows.get(match, field);
        LOG(this.label, this.name, 'SELECTING SHOW', show.name);
        this.show = show;
        this.show.channel = this; // watch show channel setter
        let update = {
            id: this.show.id
        };
        this.updateField('show', update);
    }


    updateField(field, update) {
        const includes = ['id', 'name', 'slug', 'show', 'options'];
        if (!includes.includes(field))
            return false;

        LOG(this.label, 'UPDATING', field);

        switch (field) {
            case 'show':
                this.options.show = update;
                break;
        }

        this.save();
    }

    update(updateOptions) {
        return new Promise((resolve, reject) => {
            this.mergeOptions(updateOptions);
            this.save();

            resolve(this);
        });
    }

    setDefaultShow() {
        if (this.options.show) {
            const field = Object.keys(this.options.show)[0];
            if (field)
                this.setShow(this.options.show[field], field);
        }
    }

    setShowsFromStorage() {
        const options = {
            id: false, // create a new one
            load_on_startup: true,
            flush_on_startup: false,
            path: `channels/${this.id}/shows`
        };
        return new Shows(options)
            .then((shows) => {
                this.shows = shows;
                this.shows.items.forEach(i => {
                    i.channel = this;
                });
                return Promise.resolve(this);
            });
    }

    setSchedulesFromStorage() {
        const options = {
            id: false, // create a new one
            load_on_startup: true,
            flush_on_startup: false,
            path: `channels/${this.id}/schedules`
        };
        return new Schedules(options)
            .then((schedules) => {
                this.schedules = schedules;
                this.schedules.channel = this;
                this.schedules.items.forEach(i => {
                    i.channel = this;
                });
                return Promise.resolve(this);
            });
    }

    checkReady() {
        LOG(this.label, this.name, 'CHECK IF MPD AND MPC IS READY...', this.mpd.ready, this.mpc.ready);
        if (this.mpd.ready && this.mpc.ready) {
            this.emit('ready');
            return;
        } else {
            setTimeout(() => {
                this.checkReady();
            }, this.options.checkup_delay);
        }
    }

    initMPD() {
        // Music Player Daemon
        this.mpd = new Mpd({
            channel: this,
            options: this.options.mpd
        });
    }

    initMPC() {
        // Music Player Client
        this.mpc = new Mpc({
            channel: this,
            options: this.options.mpc
        });
    }

    initPlaylist() {
        this.mpc.initPlaylist();
    }

    loadPlaylist(playlist) {
        this.mpc.loadPlaylist(playlist);
    };

    updateDatabase() {
        this.mpc.updateDatabase();
    };

    updatePlaylist(playlist) {
        this.mpc.updatePlaylist(playlist);
    };

    setCrossfade(seconds) {
        this.mpc.setCrossfade(seconds);
    };

    play(number) {
        this.mpc.play(number);
    };

    repeat() {
        this.mpc.repeat();
    };

    pause() {
        this.mpc.pause();
    };

    stop() {
        this.mpc.stop();
    };

    status() {
        this.mpc.status();
    };

    crop() {
        this.mpc.crop();
    };

    shuffle() {
        this.mpc.shuffle();
    };

    skip() {
        this.mpc.skip();
    };

    spawn() {
        this.mpd.run();
        setTimeout(() => {
            LOG(this.label, this.name, '1 SECOND IDLE BEFORE UPDATE PLAYLIST');
            this.initPlaylist();
        }, 1000);
    }


    respawn() {
        this.shutdown();
        LOG(this.label, this.name, '5 SECONDS IDLE BEFORE RESTART');
        setTimeout(() => {
            this.spawn();
        }, 5000);
    }

    shutdown() {
        this.mpd.shutdown();
    }

    reload() {
        this.shutdown();
        setTimeout(() => {
            this.initMPD();
            this.initMPC();
            this.setShow(this.options.show[Object.keys(this.options.show)[0]], Object.keys(this.options.show)[0]); // sorry @TODO
            setTimeout(() => {
                this.spawn();
            }, 2000);
        }, 2000);
    }

    setStatus() {
        this.status = ICECAST.getStatusByChannel(this.name);
        setTimeout(() => {
            this.setStatus();
        }, 500);
    }

    get path() {
        return this._path;
    }

    set path(path) {
        this._path = path;
    }
};