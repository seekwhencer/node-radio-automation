const
    fs = require('fs-extra'),
    Module = require('../Module'),
    Podcast = require('./Podcast');


module.exports = class Podcasts extends Module {

    constructor(args) {
        super(args);
        return new Promise((resolve, reject) => {
            this.name = 'podcasts';
            this.label = 'PODCASTS';
            LOG(this.label, 'INIT');
            this.mergeOptions();
            this.items = [];
            this.path = P(`${STORAGE.path}/${this.options.path}`);

            if (this.options.flush_on_startup === true) {
                STORAGE.flush(this.path);
            }
            STORAGE.createFolder(this.path);

            this.on('ready', () => {
                //LOG('>>>>>>', this.items);
                LOG(this.label, '>>> READY');
                LOG('');
                resolve(this);
            });
            if (this.options.load_on_startup === true) {
                this.buildFromStorage()
                    .then(() => {
                        this.emit('ready');
                    });
            } else {
                this.buildFromOptions()
                    .then(() => {
                        this.emit('ready');
                    });
            }
        });
    }

    buildFromOptions() {
        LOG(this.label, 'BUILD FROM OPTIONS');
        return this.build(0, this.options.items);
    }

    buildFromStorage() {
        LOG(this.label, 'BUILD FROM STORAGE');
        const podcasts = STORAGE.fetch.podcasts(this.path);
        if (podcasts.length === 0) {
            return this.buildFromOptions();
        }
        return this.build(0, podcasts);
    }

    build(index, podcasts) {
        if (podcasts.length === index) {
            return Promise.resolve();
        }
        return new Podcast({
            path: this.path,
            options: podcasts[index]
        }).then(podcast => {
            this.items.push(podcast);
            return this.build(index + 1, podcasts);
        });
    }

    get(match, field, not) {
        if (!field) {
            field = 'slug';
        }
        if (typeof field === 'string') {
            return this.items.filter(podcast => {
                if (podcast[field].toLowerCase() === match.toLowerCase()) {
                    return not !== podcast.id;
                }
            })[0];
        }
        if (typeof field === 'number') {
            return this.items[field];
        }
    };

    create(args) {
        return new Podcast({
            path: this.path,
            options: args
        }).then(podcast => {
            this.items.push(podcast);
            return Promise.resolve(podcast);
        });
    }

    delete(id) {
        const name = this.get(id, 'id').name;
        this.items = this.items.filter(i => {
            return i.id !== id;
        });
        LOG(this.label, 'DELETED PODCAST', name, this.items.length);
    }

};