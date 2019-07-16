import fs from 'fs-extra';
import Module from '../Module.js';
import Fetch from './Fetch.js';

export default class Storage extends Module {

    constructor(args) {
        super(args);

        return new Promise((resolve, reject) => {
            this.name = 'storage';
            this.label = 'STORAGE';
            LOG(this.label, 'INIT');
            this.fetch = new Fetch();

            this.mergeOptions();

            if (this.options.flush_all_on_startup === true) {
                this.flushAll();
            }
            this.createFolder();
            if (this.options.load_on_startup) {
                this.setOptionsFromStorage();
            }

            this.save();

            LOG(this.label, '>>> READY');
            LOG('');

            resolve(this);
        });
    }

    mergeOptions() {
        super.mergeOptions();
        this.path = P(`${APP_DIR}/${this.options.path}`);
        this.options.conf_file = `${this.path}/${this.name}.json`;
    }

    createFolder(folder) {
        if (!folder) {
            folder = this.path;
        }
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder);
            LOG(this.label, 'FOLDER CREATED:', folder);
        }
        const audioFolder = P(`${APP_DIR}/${CONFIG.station.path.audio}`);
           if (!fs.existsSync(audioFolder)) {
            fs.mkdirSync(audioFolder);
            LOG(this.label, 'AUDIO FOLDER CREATED:', folder);
        }
    }

    flushAll() {
        if (fs.existsSync(this.path)) {
            fs.removeSync(this.path);
            this.createFolder();
            LOG(this.label, 'FLUSHED COMPLETE', this.path);
        }
    };

    flush(folder) {
        if (fs.existsSync(folder)) {
            fs.removeSync(folder);
            LOG(this.label, 'FLUSHED FOLDER', folder);
        }
    }

    save() {
        let save = this.options;
        fs.writeJsonSync(this.options.conf_file, save);
        LOG(this.label, 'JSON SAVED', this.options.conf_file);
    }

    setOptionsFromStorage() {
        LOG(this.label, 'BUILD FROM STORAGE');
        const options = this.fetch.one(this.options.conf_file);
        if (!options) {
            return false;
        }
        this.args = options; // override the existing options
        this.mergeOptions();
        this.save();
    }

    get path() {
        return this._path;
    }

    set path(path) {
        this._path = path;
        this.fetch.path = this.path;
    }
};