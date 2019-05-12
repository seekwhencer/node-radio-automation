const
    fs = require("fs-extra");

/**
 * autoloads config files from the config folder by the given environment NODE_ENV
 */

module.exports = class AppConfig {

    constructor(args){
        this.name = 'appconfig';
        this.label = 'APPCONFIG';
        this.data = {};
        this.keys = [];

        LOG(this.label, 'INIT');

        this.config_dir = `${APP_DIR}/config/${ENV}`;
        this.load();
        LOG(this.label, '>>> READY');
        return this.data;
    }

    load() {
        fs.readdirSync(this.config_dir).forEach(function (file) {
            LOG(this.label, 'READING FILE:', file);
            let key = file.replace(/\.js/, '').toLowerCase();
            let req = require(`${this.config_dir}/${file}`);
            this.set(key, req);
        }.bind(this));

        if (this.keys.length === 0) {
            LOG(this.label, 'NO FILE FOUND');
        } else {
            LOG(this.label, this.keys.length, 'FILES LOADED');
        }
    }

    set(key, value) {
        if (typeof key === 'string' && value) {
            this.data[key] = value;
            this.keys.push(key);
        }
        if (typeof key === 'object' && !value) {
            this.setAll(key);
        }
        return true;
    }

    setAll(data) {
        for (let c in data) {
            this.set(c, data[c]);
        }
        return true;
    }

    get(key) {
        if (key) {
            return this.data[key];
        } else {
            return this.getAll();
        }
    }

    getAll() {
        let conf = {};
        for (let k in this.keys) {
            conf[this.keys[k]] = this.get(this.keys[k]);
        }
        return conf;
    }
};
