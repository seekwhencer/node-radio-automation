const
    fs = require('fs-extra'),
    Module = require('../Module'),
    Show = require('./Show');


module.exports = class Shows extends Module {

    constructor(args) {
        return new Promise((resolve, reject) => {
            super(args);
            this.name = 'shows';
            this.label = 'SHOWS';
            LOG(this.label, 'INIT');
            this.mergeOptions();
            this.items = [];

            this.path = P(`${STORAGE.path}/${this.options.path}`);

            if (this.options.flush_on_startup === true) {
                STORAGE.flush(this.path);
            }
            STORAGE.createFolder(this.path);

            if (this.options.load_on_startup === true) {
                this.buildFromStorage();
            } else {
                this.buildFromOptions();
            }
            LOG(this.label, '>>> READY');
            LOG('');

            resolve(this);
        });
    }

    buildFromOptions() {
        LOG(this.label, 'BUILD FROM OPTIONS');
        this.options.items.forEach((options) => {
            this.items.push(new Show({
                path: this.path,
                options: options
            }));
        });
    }

    buildFromStorage() {
        LOG(this.label, 'BUILD FROM STORAGE');
        const shows = STORAGE.fetch.shows(this.path);
        if (shows.length === 0) {
            this.buildFromOptions();
            return false;
        }
        shows.forEach((show) => {
            this.items.push(new Show({
                path: this.path,
                options: show
            }));
        });
    }

    create(args) {
        return new Promise((resolve, reject) => {
            const show = new Show({
                path: this.path,
                options: args
            });
            this.items.push(show);
            resolve(show);
        });
    }

    /**
     *
     * @param value
     * @param field
     *
     * possible fields: id, slug, name
     */
    get(match, field) {
        if (!['id', 'name', 'slug'].includes(field))
            return false;

        if (!field) {
            field = 'slug';
        }
        if (typeof field === 'string') {
            return this.items.filter(show => {
                if (show[field].toLowerCase() === match.toLowerCase()) {
                    return show;
                }
            })[0];
        }
        if (typeof field === 'number') {
            return this.items[field];
        }
    };
};
