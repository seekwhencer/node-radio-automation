import Module from '../Module.js';
import Show from './Show.js';

export default class Shows extends Module {

    constructor(args) {
        super(args);
        return new Promise((resolve, reject) => {
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
            const newShow = new Show({
                path: this.path,
                options: options
            });
            newShow.shows = this;
            this.items.push(newShow);
        });
    }

    buildFromStorage() {
        LOG(this.label, 'BUILD FROM STORAGE');
        const shows = STORAGE.fetch.shows(this.path);
        if (!shows) {
            this.buildFromOptions();
            return false;
        }
        shows.forEach((show) => {
            const newShow = new Show({
                path: this.path,
                options: show
            });
            newShow.shows = this;
            this.items.push(newShow);
        });
    }

    create(args) {
        return new Promise((resolve, reject) => {
            const newShow = new Show({
                path: this.path,
                options: args
            });
            newShow.shows = this;
            this.items.push(newShow);
            resolve(newShow);
        });
    }

    delete(id) {
        const name = this.get(id, 'id').name;
        this.items = this.items.filter(i => {
            return i.id !== id;
        });
        LOG(this.label, 'DELETED SHOW', name, this.items.length);
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
