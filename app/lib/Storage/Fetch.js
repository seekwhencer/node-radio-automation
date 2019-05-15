const
    fs = require('fs-extra'),
    Module = require('../Module.js');

module.exports = class StorageFetch extends Module {
    constructor(args) {
        super(args);
        this.name = 'storagefetch';
        this.label = 'STORAGEFETCH';
        LOG(this.label, 'INIT');
        this.mergeOptions();
        this.path = false;
        this.ready = true;
    }

    /**
     *
     * @returns {Array}
     */
    channels(folder) {
        const files = RDIRSYNC(folder, false, ['json']);
        LOG(this.label, 'GOT', files.length, 'CHANNELS');
        let data = [];
        files.forEach(function (i) {
            const channel_data = fs.readJsonSync(i.file_path);
            data.push(channel_data);
        });

        if (data.length > 0) {
            return data;
        }
        return data;
    };

    /**
     *
     * @param folder
     * @param recursive
     * @returns {Array}
     */
    audio(folder, recursive) {
        const data = RDIRSYNC(folder, recursive, ['mp3']);
        LOG(this.label, 'GOT AUDIO SOURCES', data.length, 'FILES  IN', folder, 'RECURSIVE', recursive);

        return data;
    };

    /**
     *
     * @param folder
     * @returns {Array}
     */
    shows(folder) {
        const files = RDIRSYNC(folder, false, ['json']);
        LOG(this.label, 'GOT', files.length, 'SHOWS');

        let data = [];
        files.forEach(function (i) {
            const show_data = fs.readJsonSync(i.file_path);
            data.push(show_data);
        });

        if (data.length > 0) {
            return data;
        }
        return data;
    }

    inputs(folder) {
        const data = RDIRSYNC(folder, false, ['json']);
        LOG(this.name, 'FETCHED', data.length, 'INPUTS');
        return data;
    }

    icecast(folder) {
        if (!fs.existsSync(folder))
            return false;

        const files = RDIRSYNC(folder, false, ['json']);
        if (files.length === 0) {
            return false;
        }
        const data = fs.readJsonSync(files[0].file_path);

        if (data) {
            LOG(this.label, 'GOT ICECAST CONFIG', files[0].file_path);
            return data;
        }

        return false;
    }

    all(folder) {
        const files = RDIRSYNC(folder, false, ['json']);
        if (!files) {
            return false;
        }
        LOG(this.label, 'GOT ALL', files.length, folder);

        let data = [];
        files.forEach(i => {
            const item = fs.readJsonSync(i.file_path);
            data.push(item);
        });

        if (data.length > 0) {
            return data;
        }
        return false;
    }

    one(file_path) {
        if (!fs.existsSync(file_path)) {
            return false;
        }
        const item = fs.readJsonSync(file_path);
        if (!item) {
            return false;
        }
    }


    get path() {
        return this._path;
    }

    set path(path) {
        this._path = path;
    }
};