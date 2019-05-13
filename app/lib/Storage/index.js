const
    fs = require('fs-extra'),
    Module = require('../Module.js'),
    Fetch = require('./Fetch');

module.exports = class Storage extends Module {

    constructor(args) {
        return new Promise((resolve, reject) => {
            super(args);
            this.name = 'storage';
            this.label = 'STORAGE';
            LOG(this.label, 'INIT');
            this.mergeOptions();

            this.fetch = new Fetch();
            this.path = P(`${APP_DIR}/${this.options.path}`);

            if (this.options.flush_all_on_startup === true) {
                this.flushAll();
            }
            this.createFolder();
            LOG(this.label, '>>> READY');
            LOG('');
            resolve(this);
        });

    }

    createFolder(folder) {
        if (!folder) {
            folder = this.path;
        }
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder);
            LOG(this.label, 'FOLDER CREATED:', folder);
        }
    }

    flushAll() {
        if (fs.existsSync(this.path)) {
            fs.removeSync(this.path);
            LOG(this.label, 'FLUSHED COMPLETE', this.path);
        }
    };

    flush(folder) {
        if (fs.existsSync(folder)) {
            fs.removeSync(folder);
            LOG(this.label, 'FLUSHED FOLDER', folder);
        }
    }

    get path() {
        return this._path;
    }

    set path(path) {
        this._path = path;
        this.fetch.path = this.path;
    }
};