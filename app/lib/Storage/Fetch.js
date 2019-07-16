import fs from 'fs-extra';
import Module from '../Module.js';

/**
 * @param file_path
 * @param files
 * @returns {Array}
 */
const readFilesData = (files) => {
    let data = [];
    files.forEach(i => {
        const item = fs.readJsonSync(i.file_path);
        data.push(item);
    });

    if (data.length > 0) {
        return data;
    }

    return false;
};


export default class StorageFetch extends Module {

    constructor(args) {
        super(args);
        this.name = 'storagefetch';
        this.label = 'STORAGEFETCH';
        LOG(this.label, 'INIT');
        this.mergeOptions();
        this.path = false;
        this.ready = true;
    };

    /**
     *
     * @param folder
     * @returns {Array}
     */
    channels(folder) {
        const files = RDIRSYNC(folder, false, ['json']);
        LOG(this.label, 'GOT', files.length, 'CHANNELS');
        return readFilesData(files);
    };

    /**
     *
     * @param folder
     * @returns {Array}
     */
    podcasts(folder) {
        const files = RDIRSYNC(folder, false, ['json']);
        LOG(this.label, 'GOT', files.length, 'PODCASTS');
        return readFilesData(files);
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
        return readFilesData(files);
    };

    /**
     *
     * @param folder
     * @returns {Array}
     */
    inputs(folder) {
        const data = RDIRSYNC(folder, false, ['json']);
        LOG(this.name, 'FETCHED', data.length, 'INPUTS');
        return data;
    };

    /**
     *
     * @param folder
     * @returns {*}
     */
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
    };

    /**
     *
     * @param folder
     * @returns {Array}
     */
    schedules(folder) {
        const files = RDIRSYNC(folder, false, ['json']);
        LOG(this.label, 'GOT', files.length, 'SCHEDULES');
        return readFilesData(files);
    };

    /**
     *
     * @param folder
     * @returns {*}
     */
    all(folder) {
        const files = RDIRSYNC(folder, false, ['json']);
        if (!files) {
            return false;
        }
        LOG(this.label, 'GOT ALL', files.length, folder);
        return readFilesData(files);
    };

    one(file_path) {
        if (!fs.existsSync(file_path)) {
            return false;
        }
        const item = fs.readJsonSync(file_path);
        if (!item) {
            return false;
        }
    };


    get path() {
        return this._path;
    };

    set path(path) {
        this._path = path;
    };
};